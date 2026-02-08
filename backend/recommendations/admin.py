from django.contrib import admin
from .models import MealPlan

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'breakfast', 'lunch', 'dinner', 'total_calories', 'nutritional_accuracy', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user_profile__user__username']
    readonly_fields = ['created_at']