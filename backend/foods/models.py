from django.db import models

class Food(models.Model):
    """Model representing Nepali foods with nutritional information"""
    
    CATEGORY_CHOICES = [
        ('MEAL', 'Complete Meal'),
        ('GRAIN', 'Grain'),
        ('LEGUME', 'Legume'),
        ('VEGETABLE', 'Vegetable'),
        ('FRUIT', 'Fruit'),
        ('MEAT', 'Meat'),
        ('DAIRY', 'Dairy'),
        ('SNACK', 'Snack'),
        ('BEVERAGE', 'Beverage'),
        ('DESSERT', 'Dessert'),
    ]
    
    GI_CATEGORY_CHOICES = [
        ('LOW', 'Low (0-55)'),
        ('MEDIUM', 'Medium (56-69)'),
        ('HIGH', 'High (70-100)'),
    ]
    
    # Basic Information
    food_name = models.CharField(max_length=200, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Nutritional Information
    calories = models.DecimalField(max_digits=6, decimal_places=2, help_text="Calories in kcal")
    protein = models.DecimalField(max_digits=5, decimal_places=2, help_text="Protein in grams")
    carbohydrates = models.DecimalField(max_digits=5, decimal_places=2, help_text="Carbs in grams")
    fat = models.DecimalField(max_digits=5, decimal_places=2, help_text="Fat in grams")
    
    # Glycemic Index
    glycemic_index = models.IntegerField(help_text="GI value (0-100)")
    gi_category = models.CharField(max_length=10, choices=GI_CATEGORY_CHOICES, blank=True)
    
    # Dietary Properties
    is_diabetes_friendly = models.BooleanField(default=False)
    is_vegetarian = models.BooleanField(default=True)
    
    # Meal Type (stored as comma-separated values)
    meal_type = models.CharField(max_length=100, help_text="e.g., Breakfast,Lunch,Dinner")
    
    # Pricing
    average_price = models.DecimalField(max_digits=8, decimal_places=2, help_text="Price in NPR")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['food_name']
        verbose_name = 'Food Item'
        verbose_name_plural = 'Food Items'
    
    def __str__(self):
        return self.food_name
    
    def save(self, *args, **kwargs):
        """Auto-set GI category based on glycemic index"""
        if self.glycemic_index <= 55:
            self.gi_category = 'LOW'
        elif 56 <= self.glycemic_index <= 69:
            self.gi_category = 'MEDIUM'
        else:
            self.gi_category = 'HIGH'
        super().save(*args, **kwargs)