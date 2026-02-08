from django.contrib import admin
from .models import MealPlan

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'get_breakfast_count', 'get_lunch_count', 'get_dinner_count', 'total_calories', 'nutritional_accuracy', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user_profile__user__username']
    readonly_fields = ['created_at']
    
    def get_breakfast_count(self, obj):
        return obj.breakfast.count()
    get_breakfast_count.short_description = 'Breakfast Items'
    
    def get_lunch_count(self, obj):
        return obj.lunch.count()
    get_lunch_count.short_description = 'Lunch Items'
    
    def get_dinner_count(self, obj):
        return obj.dinner.count()
    get_dinner_count.short_description = 'Dinner Items'