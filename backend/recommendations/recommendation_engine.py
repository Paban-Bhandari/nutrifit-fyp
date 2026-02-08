"""
Content-Based Recommendation Engine
Uses cosine similarity and multi-constraint filtering to recommend meals
"""

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from foods.models import Food
from accounts.models import UserProfile

class MealRecommendationEngine:
    """Generate personalized meal plans for users"""
    
    def __init__(self, user_profile):
        self.user = user_profile
        self.foods = Food.objects.all()
    
    def get_user_nutritional_vector(self):
        """
        Create a feature vector representing user's nutritional needs
        Returns: [calories, protein, carbs, fats]
        """
        return np.array([
            float(self.user.daily_calories),
            float(self.user.daily_protein),
            float(self.user.daily_carbs),
            float(self.user.daily_fats),
        ]).reshape(1, -1)
    
    def get_food_nutritional_vector(self, food):
        """
        Create a feature vector for a food item
        Returns: [calories, protein, carbs, fats]
        """
        return np.array([
            float(food.calories),
            float(food.protein),
            float(food.carbohydrates),
            float(food.fat),
        ])
    
    def apply_constraints(self, queryset):
        """
        Apply user-specific constraints to food queryset
        - Dietary preference (vegetarian/non-vegetarian)
        - Budget constraints
        - Diabetes-aware filtering (low GI foods)
        """
        # Filter by dietary preference
        if self.user.dietary_preference == 'VEGETARIAN':
            queryset = queryset.filter(is_vegetarian=True)
        elif self.user.dietary_preference == 'NON_VEGETARIAN':
            queryset = queryset.filter(is_vegetarian=False)
        # MIXED: no filtering
        
        # Filter by budget (if specified)
        if self.user.daily_budget:
            avg_meal_budget = float(self.user.daily_budget) / 3  # 3 meals per day
            queryset = queryset.filter(average_price__lte=avg_meal_budget)
        
        # Diabetes-aware filtering
        if self.user.diabetes_status in ['PRE_DIABETIC', 'TYPE_1', 'TYPE_2']:
            # Prioritize low GI foods, exclude high GI
            queryset = queryset.exclude(gi_category='HIGH')
        
        return queryset
    
    def calculate_similarity_scores(self, foods_queryset):
        """
        Calculate cosine similarity between user needs and each food
        Returns: List of (food, similarity_score) tuples
        """
        user_vector = self.get_user_nutritional_vector()
        
        food_scores = []
        for food in foods_queryset:
            food_vector = self.get_food_nutritional_vector(food).reshape(1, -1)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(user_vector, food_vector)[0][0]
            
            food_scores.append((food, similarity))
        
        # Sort by similarity score (descending)
        food_scores.sort(key=lambda x: x[1], reverse=True)
        
        return food_scores
    
    def select_meal(self, meal_type, target_calories, exclude_foods=None):
        """
        Select best food for a specific meal type
        
        Args:
            meal_type: 'Breakfast', 'Lunch', 'Dinner'
            target_calories: Target calories for this meal
            exclude_foods: List of food IDs to exclude (avoid repetition)
        
        Returns:
            Food object or None
        """
        if exclude_foods is None:
            exclude_foods = []
        
        # Get foods suitable for this meal type
        foods = self.foods.filter(meal_type__contains=meal_type)
        
        # Apply constraints
        foods = self.apply_constraints(foods)
        
        # Exclude already selected foods
        foods = foods.exclude(id__in=exclude_foods)
        
        if not foods.exists():
            return None
        
        # Calculate similarity scores
        food_scores = self.calculate_similarity_scores(foods)
        
        if not food_scores:
            return None
        
        # Select food closest to target calories
        best_food = None
        min_calorie_diff = float('inf')
        
        for food, score in food_scores[:10]:  # Top 10 similar foods
            calorie_diff = abs(float(food.calories) - target_calories)
            
            if calorie_diff < min_calorie_diff:
                min_calorie_diff = calorie_diff
                best_food = food
        
        return best_food
    
    def generate_meal_plan(self):
        """
        Generate complete daily meal plan (breakfast, lunch, dinner)
        
        Returns:
            {
                'breakfast': Food object,
                'lunch': Food object,
                'dinner': Food object,
                'total_calories': float,
                'total_protein': float,
                'total_carbs': float,
                'total_fats': float,
                'nutritional_accuracy': float (%)
            }
        """
        total_calories = float(self.user.daily_calories)
        
        # Distribute calories: Breakfast 25%, Lunch 40%, Dinner 35%
        breakfast_calories = total_calories * 0.25
        lunch_calories = total_calories * 0.40
        dinner_calories = total_calories * 0.35
        
        selected_foods = []
        
        # Select breakfast
        breakfast = self.select_meal('Breakfast', breakfast_calories, selected_foods)
        if breakfast:
            selected_foods.append(breakfast.id)
        
        # Select lunch
        lunch = self.select_meal('Lunch', lunch_calories, selected_foods)
        if lunch:
            selected_foods.append(lunch.id)
        
        # Select dinner
        dinner = self.select_meal('Dinner', dinner_calories, selected_foods)
        
        # Calculate totals
        meals = [m for m in [breakfast, lunch, dinner] if m]
        
        if not meals:
            return None
        
        total_cal = sum(float(m.calories) for m in meals)
        total_protein = sum(float(m.protein) for m in meals)
        total_carbs = sum(float(m.carbohydrates) for m in meals)
        total_fats = sum(float(m.fat) for m in meals)
        
        # Calculate accuracy (how close to target)
        accuracy = (1 - abs(total_cal - total_calories) / total_calories) * 100
        
        return {
            'breakfast': breakfast,
            'lunch': lunch,
            'dinner': dinner,
            'total_calories': round(total_cal, 2),
            'total_protein': round(total_protein, 2),
            'total_carbs': round(total_carbs, 2),
            'total_fats': round(total_fats, 2),
            'target_calories': total_calories,
            'nutritional_accuracy': round(accuracy, 2),
            'user': {
                'username': self.user.user.username,
                'cluster': self.user.cluster_name,
                'dietary_preference': self.user.dietary_preference,
                'diabetes_status': self.user.diabetes_status,
            }
        }
    
    def get_alternative_meals(self, meal_type, exclude_foods=None, limit=5):
        """
        Get alternative meal options for variety
        
        Args:
            meal_type: 'Breakfast', 'Lunch', 'Dinner'
            exclude_foods: List of food IDs to exclude
            limit: Number of alternatives to return
        
        Returns:
            List of Food objects
        """
        if exclude_foods is None:
            exclude_foods = []
        
        foods = self.foods.filter(meal_type__contains=meal_type)
        foods = self.apply_constraints(foods)
        foods = foods.exclude(id__in=exclude_foods)
        
        food_scores = self.calculate_similarity_scores(foods)
        
        return [food for food, score in food_scores[:limit]]