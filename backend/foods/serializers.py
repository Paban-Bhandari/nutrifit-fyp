from rest_framework import serializers
from .models import Food

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = [
            'id', 'food_name', 'category', 'calories', 'protein',
            'carbohydrates', 'fat', 'glycemic_index', 'gi_category',
            'is_diabetes_friendly', 'is_vegetarian', 'meal_type',
            'average_price', 'created_at', 'updated_at'
        ]