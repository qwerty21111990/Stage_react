from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Meal, Photo


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"

class MealSerializer(serializers.ModelSerializer):

    photos = PhotoSerializer(many=True)
    class Meta:
        model = Meal
        fields = '__all__'

class TopMealSerializer(serializers.ModelSerializer):

    click_count = serializers.IntegerField()

    class Meta:
        model = Meal
        fields = ('id', 'name', 'click_count')

class TopUserSerializer(serializers.ModelSerializer):

    user_click_count = serializers.IntegerField()

    class Meta:
        model = User
        fields = ('id', 'username', 'user_click_count')
