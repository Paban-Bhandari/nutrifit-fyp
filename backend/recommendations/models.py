from django.db import models
from accounts.models import UserProfile
from foods.models import Food

class MealPlan(models.Model):
    """Store generated meal plans for users"""
    
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='meal_plans')
    
    # Meals (Many-to-Many for multiple foods per meal)
    breakfast = models.ManyToManyField(Food, related_name='breakfast_plans', blank=True)
    lunch = models.ManyToManyField(Food, related_name='lunch_plans', blank=True)
    dinner = models.ManyToManyField(Food, related_name='dinner_plans', blank=True)
    
    # Nutritional totals
    total_calories = models.DecimalField(max_digits=6, decimal_places=2)
    total_protein = models.DecimalField(max_digits=5, decimal_places=2)
    total_carbs = models.DecimalField(max_digits=5, decimal_places=2)
    total_fats = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Accuracy
    nutritional_accuracy = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage accuracy")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Meal Plan'
        verbose_name_plural = 'Meal Plans'
    
    def __str__(self):
        return f"Meal Plan for {self.user_profile.user.username} - {self.created_at.date()}"