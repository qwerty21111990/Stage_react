from django.shortcuts import render
from django.db.models import OuterRef, Subquery, Count
from qsstats import QuerySetStats
from .models import Meal, User, MealClick
from django.utils import timezone


def menu(request):
    meal_categories = list(filter(lambda el: 'NO_TYPE' not in el[0], Meal.MealType.choices))
    return render(request, 'cafe_app/menu.html', {'meal_categories': meal_categories})


def meal_category(request, meal_category):
    meals_by_category = Meal.objects.filter(meal_type=meal_category)
    return render(request, 'cafe_app/meals.html', {'meals': meals_by_category, 'meal_category': meal_category})


def meal(request, meal_id):
    meal = Meal.objects.get(id=meal_id)
    meal.mealclick_set.create(click_date=timezone.now(), user=request.user)
    return render(request, 'cafe_app/meal.html', {'meal': meal})


def statistics(request):
    top3meals = Meal.objects.annotate(click_count=Count('mealclick')).order_by('-click_count')[:3]
    top10users = User.objects.annotate(user_click_count=Count('mealclick')).order_by('-user_click_count')[:10]
    meal_categories = list(filter(lambda el: 'NO_TYPE' not in el[0], Meal.MealType.choices))
    return render(request, 'cafe_app/statistics.html',
                  {'meals': top3meals, 'users': top10users, 'meal_categories': meal_categories})


def category_statistics(request):
    clicks = MealClick.objects.filter(meal__meal_type=request.GET.get('meal_category'), user=OuterRef("pk"))
    clicks_v = clicks.values('user')
    click_count = clicks_v.annotate(c=Count('*')).values('c')
    top_users = User.objects.filter(mealclick__in=clicks).distinct().annotate(
        user_click_count=Subquery(click_count)).order_by(
        '-user_click_count')[:int(request.GET.get('user_count'))]
    return render(request, 'cafe_app/category_statistics.html',
                  {'users': top_users, 'category': request.GET.get('meal_category'),
                   'num': request.GET.get('user_count')})


def meal_statistics(request, meal_id):
    meal = Meal.objects.get(id=meal_id)
    clicks = MealClick.objects.filter(meal=meal_id)
    interval = "days"
    num = 7
    if request.GET.get('num'):
        num = int(request.GET.get('num'))
    end_date = timezone.now()

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
        date_format = "M j G:i"
    else:
        date_format = "M j"

    qsstats = QuerySetStats(clicks, date_field='click_date', aggregate=Count('id'))
    stat_values = qsstats.time_series(start_date, end_date, interval=interval)

    print(qsstats)
    print(stat_values)

    return render(request, 'cafe_app/meal_statistics.html',
                  {'meal': meal, 'stat_values': stat_values, 'period_select': period_data.keys(),
                   'date_format': date_format})

