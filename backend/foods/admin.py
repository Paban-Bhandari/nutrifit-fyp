from django.contrib import admin
from .models import Food

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ['food_name', 'category', 'calories', 'protein', 'glycemic_index', 'gi_category', 'is_vegetarian', 'average_price']
    list_filter = ['category', 'gi_category', 'is_vegetarian', 'is_diabetes_friendly']
    search_fields = ['food_name']
    ordering = ['food_name']