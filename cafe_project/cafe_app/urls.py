from django.urls import path, include
from . import views, api
from rest_framework import routers


app_name = 'cafe_app'

router = routers.DefaultRouter()
router.register('menu', api.MenuViewSet, 'meal_categories')
router.register('meals', api.MealViewSet, 'meals')
router.register('statistics_meals', api.TopMealViewSet, 'meals')
router.register('statistics_users', api.TopUserViewSet, 'users')
router.register('statistics_users_category/(?P<meal_category>[^/.]+)', api.TopUserCategoryViewSet, 'users')
router.register('statistics_chart/(?P<meal_id>[^/.]+)', api.MealStatisticsViewSet, 'clicks')
router.register('(?P<meal_category>[^/.]+)', api.MealCategoryViewSet, 'meals')


urlpatterns = [
    path('', views.menu, name='menu'),
    path('menu', views.menu, name='menu'),
    path('statistics', views.statistics, name='statistics'),
    path('category_statistics', views.category_statistics, name='category_statistics'),
    path('meal_statistics/<int:meal_id>', views.meal_statistics, name='meal_statistics'),
    path('<meal_category>', views.meal_category, name='meal_category'),
    path('<int:meal_id>/meal', views.meal, name='meal'),
    path('api/', include(router.urls)),
]

# urlpatterns += router.urls