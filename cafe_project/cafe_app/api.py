import datetime

from django.contrib.auth.models import User
from django.db.models import Count, OuterRef, Subquery
from django.utils import timezone
from qsstats import QuerySetStats
from rest_framework.response import Response
from .models import Meal, MealClick
from rest_framework import viewsets, permissions
from .serializers import MealSerializer, TopMealSerializer, TopUserSerializer


class MenuViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        types = [[Meal.MealType.choices[i][0], Meal.MealType.names[i]] for i in range(len(Meal.MealType.choices))]
        meal_categories = list(filter(lambda el: 'NO_TYPE' not in el[0], types))
        return Response(meal_categories)


class MealCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            # queryset just for schema generation metadata
            return Meal.objects.none()
        index = Meal.MealType.names.index(self.kwargs['meal_category'])
        queryset=Meal.objects.filter(meal_type=Meal.MealType.values[index])

        if self.action == 'retrieve':
            meal = queryset.get(id=self.kwargs['pk'])
            if self.request.user.id:
                meal.mealclick_set.create(click_date=timezone.now(), user=self.request.user)
            else:
                meal.mealclick_set.create(click_date=timezone.now())

        return queryset

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Meal.objects.all()


class TopMealViewSet(viewsets.ModelViewSet):
    serializer_class = TopMealSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Meal.objects.annotate(click_count=Count('mealclick')).order_by('-click_count')


class TopUserViewSet(viewsets.ModelViewSet):
    serializer_class = TopUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.exclude(id=13).annotate(user_click_count=Count('mealclick')).order_by('-user_click_count')


class TopUserCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = TopUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            # queryset just for schema generation metadata
            return User.objects.none()
        index = Meal.MealType.names.index(self.kwargs['meal_category'])
        clicks = MealClick.objects.filter(meal__meal_type=Meal.MealType.values[index], user=OuterRef("pk"))
        clicks_v = clicks.values('user')
        click_count = clicks_v.annotate(c=Count('*')).values('c')
        top_users = User.objects.exclude(id=13).filter(mealclick__in=clicks).distinct().annotate(
            user_click_count=Subquery(click_count)).order_by('-user_click_count')
        return top_users


class MealStatisticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        clicks = MealClick.objects.filter(meal=self.kwargs['meal_id'])
        interval = "days"
        num = 7
        if request.GET.get('num'):
            num = int(request.GET.get('num'))
        end_date = timezone.now()
        print(timezone.now())
        delta = timezone.timedelta(days=num)

        period_data = {"Часы": ("hours", timezone.timedelta(hours=num)),
                       "Дни": ("days", timezone.timedelta(days=num)),
                       "Недели": ("weeks", timezone.timedelta(weeks=num)),
                       "Месяцы": ("months", timezone.timedelta(days=num * 30))}
        if request.GET.get('period'):
            interval = period_data[request.GET.get('period')][0]
            delta = period_data[request.GET.get('period')][1]

        start_date = end_date - delta

        if interval == "hours":
            date_format = '%d.%m %H:%M'
        elif interval == "months":
            date_format = '%m.%Y'
        else:
            date_format = '%d.%m'

        qsstats = QuerySetStats(clicks, date_field='click_date', aggregate=Count('id'))
        stat_values = qsstats.time_series(start_date, end_date, interval=interval)

        stat_data = []

        for key, value in stat_values:
            stat_data.append({'date': key.strftime(date_format), 'click_count': value})

        return Response(stat_data)
