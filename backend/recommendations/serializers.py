from rest_framework import serializers
from foods.models import Food


class FoodMiniSerializer(serializers.ModelSerializer):
    """Lightweight food serializer for meal plan response."""

    class Meta:
        model = Food
        fields = [
            'id',
            'food_name',
            'category',
            'calories',
            'protein',
            'carbohydrates',
            'fat',
            'glycemic_index',
            'gi_category',
            'is_diabetes_friendly',
            'is_vegetarian',
            'meal_type',
            'average_price',
        ]


class MealPlanSerializer(serializers.Serializer):
    """Serializer for the daily meal plan response."""

    user = serializers.DictField()
    breakfast = FoodMiniSerializer(many=True)
    lunch = FoodMiniSerializer(many=True)
    dinner = FoodMiniSerializer(many=True)
    total_calories = serializers.FloatField()
    total_protein = serializers.FloatField()
    total_carbs = serializers.FloatField()
    total_fats = serializers.FloatField()
    target_calories = serializers.FloatField()
    nutritional_accuracy = serializers.FloatField()

