import os
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from .transliteration import transliteration


class Meal(models.Model):
    name = models.CharField('Название блюда', max_length=100)
    description = models.TextField('Описание блюда')
    price = models.IntegerField('Стоимость блюда')
    size = models.IntegerField('Граммовка блюда')

    class MealType(models.TextChoices):
        HOT_MEALS = 'Горячие блюда'
        DRINKS = 'Напитки'
        DESSERTS = 'Десерты'
        NO_TYPE = 'NO_TYPE'

    meal_type = models.CharField(
        'Категория блюда',
        max_length=30,
        choices=MealType.choices,
        default=MealType.NO_TYPE
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name="Блюдо"
        verbose_name_plural="Блюда"
        ordering = ('meal_type', 'name')


class MealClick(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.DO_NOTHING)
    click_date = models.DateTimeField('Дата клика')
    user=models.ForeignKey(User, default=13, on_delete=models.DO_NOTHING)

def get_path_upload_image(file, meal):
    end_extention = file.split('.')[1]
    head = file.split('.')[0]
    if len(head) > 10:
        head = head[:10]
    file_name = head + '.' + end_extention
    return os.path.join('{}', '{}').format(meal, file_name)

class Photo(models.Model):
    meal = models.ForeignKey(Meal, verbose_name="Блюдо", related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField("Фото", upload_to="meals/")

    def __str__(self):
        return '{}'.format(self.image.name)[15:]

    def save(self, *args, **kwargs):
        trans_meal = transliteration(self.meal)
        self.image.name = get_path_upload_image(self.image.name, trans_meal)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Фотография"
        verbose_name_plural = "Фотографии"
        ordering = ('id',)