from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class UserProfile(models.Model):
    """Extended user profile with health and dietary information"""
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ]
    
    ACTIVITY_LEVEL_CHOICES = [
        ('SEDENTARY', 'Sedentary (little or no exercise)'),
        ('LIGHTLY_ACTIVE', 'Lightly Active (exercise 1-3 days/week)'),
        ('MODERATELY_ACTIVE', 'Moderately Active (exercise 3-5 days/week)'),
        ('VERY_ACTIVE', 'Very Active (exercise 6-7 days/week)'),
        ('EXTREMELY_ACTIVE', 'Extremely Active (physical job or training twice/day)'),
    ]
    
    DIETARY_PREFERENCE_CHOICES = [
        ('VEGETARIAN', 'Vegetarian'),
        ('NON_VEGETARIAN', 'Non-Vegetarian'),
        ('MIXED', 'Mixed (Both)'),
    ]
    
    DIABETES_STATUS_CHOICES = [
        ('NONE', 'None'),
        ('PRE_DIABETIC', 'Pre-Diabetic'),
        ('TYPE_1', 'Type 1 Diabetes'),
        ('TYPE_2', 'Type 2 Diabetes'),
    ]
    
    GOAL_CHOICES = [
        ('LOSE_WEIGHT', 'Lose Weight'),
        ('MAINTAIN_WEIGHT', 'Maintain Weight'),
        ('GAIN_WEIGHT', 'Gain Weight'),
    ]
    
    # One-to-One relationship with Django User
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Basic Information
    age = models.IntegerField(
        validators=[MinValueValidator(10), MaxValueValidator(120)],
        help_text="Age in years"
    )
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Physical Measurements
    height = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(50), MaxValueValidator(300)],
        help_text="Height in centimeters"
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(20), MaxValueValidator(500)],
        help_text="Weight in kilograms"
    )
    
    # Calculated Fields
    bmi = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Body Mass Index (auto-calculated)"
    )
    bmi_category = models.CharField(max_length=20, blank=True)
    
    # Activity and Lifestyle
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_LEVEL_CHOICES)
    
    # Dietary Preferences
    dietary_preference = models.CharField(max_length=20, choices=DIETARY_PREFERENCE_CHOICES)
    
    # Health Information
    diabetes_status = models.CharField(max_length=20, choices=DIABETES_STATUS_CHOICES, default='NONE')
    
    # Goals
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='MAINTAIN_WEIGHT')
    
    # Budget
    daily_budget = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Daily food budget in NPR"
    )
    
    # Calculated Nutritional Requirements
    daily_calories = models.IntegerField(null=True, blank=True, help_text="Daily calorie requirement")
    daily_protein = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    daily_carbs = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    daily_fats = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
    # Clustering information
    cluster_id = models.IntegerField(null=True, blank=True, help_text="K-Means cluster assignment")
    cluster_name = models.CharField(max_length=50, blank=True, help_text="Cluster label")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def calculate_bmi(self):
        """Calculate BMI: weight(kg) / (height(m))^2"""
        height_in_meters = float(self.height) / 100
        bmi_value = float(self.weight) / (height_in_meters ** 2)
        return round(bmi_value, 2)
    
    def get_bmi_category(self):
        """Categorize BMI according to WHO standards"""
        bmi = self.bmi
        if bmi < 18.5:
            return "Underweight"
        elif 18.5 <= bmi < 25:
            return "Normal"
        elif 25 <= bmi < 30:
            return "Overweight"
        else:
            return "Obese"
    
    def calculate_bmr(self):
        """
        Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
        Men: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
        Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
        """
        weight = float(self.weight)
        height = float(self.height)
        age = self.age
        
        if self.gender == 'MALE':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:  # FEMALE or OTHER
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        return round(bmr, 2)
    
    def calculate_tdee(self):
        """
        Calculate Total Daily Energy Expenditure (TDEE)
        TDEE = BMR * Activity Multiplier
        """
        activity_multipliers = {
            'SEDENTARY': 1.2,
            'LIGHTLY_ACTIVE': 1.375,
            'MODERATELY_ACTIVE': 1.55,
            'VERY_ACTIVE': 1.725,
            'EXTREMELY_ACTIVE': 1.9,
        }
        
        bmr = self.calculate_bmr()
        multiplier = activity_multipliers.get(self.activity_level, 1.2)
        tdee = bmr * multiplier
        
        # Adjust based on goal
        if self.goal == 'LOSE_WEIGHT':
            tdee = tdee - 500  # 500 calorie deficit
        elif self.goal == 'GAIN_WEIGHT':
            tdee = tdee + 500  # 500 calorie surplus
        
        return round(tdee, 0)
    
    def calculate_macros(self):
        """
        Calculate daily macronutrient requirements
        Protein: 25-30% of calories
        Carbs: 45-50% of calories
        Fats: 25-30% of calories
        """
        calories = self.daily_calories or self.calculate_tdee()
        
        # Protein: 25% (1g protein = 4 calories)
        protein_grams = (calories * 0.25) / 4
        
        # Carbs: 50% (1g carb = 4 calories)
        carbs_grams = (calories * 0.50) / 4
        
        # Fats: 25% (1g fat = 9 calories)
        fats_grams = (calories * 0.25) / 9
        
        return {
            'protein': round(protein_grams, 2),
            'carbs': round(carbs_grams, 2),
            'fats': round(fats_grams, 2),
        }
    
    def save(self, *args, **kwargs):
        """Override save to auto-calculate BMI, BMR, TDEE, macros, and assign cluster"""
        # Calculate BMI
        self.bmi = self.calculate_bmi()
        self.bmi_category = self.get_bmi_category()
        
        # Calculate daily calorie requirement
        self.daily_calories = self.calculate_tdee()
        
        # Calculate macros
        macros = self.calculate_macros()
        self.daily_protein = macros['protein']
        self.daily_carbs = macros['carbs']
        self.daily_fats = macros['fats']
        
        # Assign cluster (after saving first time)
        super().save(*args, **kwargs)
        
        # Update cluster assignment
        try:
            from recommendations.clustering import UserClustering
            clustering = UserClustering()
            cluster_id, cluster_name = clustering.predict_cluster(self)
            
            # Update without triggering save again
            UserProfile.objects.filter(id=self.id).update(
                cluster_id=cluster_id,
                cluster_name=cluster_name
            )
        except Exception as e:
            print(f"Cluster assignment failed: {e}")