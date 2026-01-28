from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'gender', 'bmi', 'bmi_category', 'activity_level', 'dietary_preference', 'diabetes_status', 'daily_calories']
    list_filter = ['gender', 'activity_level', 'dietary_preference', 'diabetes_status', 'goal']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['bmi', 'bmi_category', 'daily_calories', 'daily_protein', 'daily_carbs', 'daily_fats', 'created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Basic Information', {
            'fields': ('age', 'gender')
        }),
        ('Physical Measurements', {
            'fields': ('height', 'weight', 'bmi', 'bmi_category')
        }),
        ('Activity & Preferences', {
            'fields': ('activity_level', 'dietary_preference', 'goal')
        }),
        ('Health Information', {
            'fields': ('diabetes_status',)
        }),
        ('Budget', {
            'fields': ('daily_budget',)
        }),
        ('Calculated Requirements', {
            'fields': ('daily_calories', 'daily_protein', 'daily_carbs', 'daily_fats'),
            'description': 'These values are automatically calculated based on profile data'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )