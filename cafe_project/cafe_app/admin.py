from django.contrib import admin
from .models import Meal, Photo

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'meal_type')
    list_filter = ('meal_type', )
    seach_fields = ('meal_type',)

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'meal', 'image')
    list_filter = ('meal',)
    seach_fields = ('meal',)
