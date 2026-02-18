"""
Content-Based Recommendation Engine (Improved)
Uses composite scoring with cosine similarity, macro-balance, GI awareness,
goal-aware calorie density, category diversity, and controlled randomization.
"""

import random
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from foods.models import Food
from accounts.models import UserProfile


# ---------------------------------------------------------------------------
# Category constants
# ---------------------------------------------------------------------------

# Categories that should NEVER appear as standalone meal items
# (cooking fats, pure sweeteners, condiments/chutneys/pickles)
EXCLUDED_MAIN_CATEGORIES = {
    'FAT',        # Ghee, Mustard Oil, Coconut Oil
    'SWEETENER',  # Jaggery, Honey
    'CONDIMENT',  # Achar, Chutney, Pickle
}

# CSV category strings that map to the above (case-insensitive match)
EXCLUDED_CSV_CATEGORIES = {
    'fat', 'sweetener', 'condiment', 'salad',
}

# Categories that count as a "carb base" for meal structure enforcement
CARB_CATEGORIES = {'GRAIN', 'BREAD', 'LEGUME', 'MEAL', 'NOODLES', 'RICE'}

# Categories that count as a "protein source"
PROTEIN_CATEGORIES = {'MEAT', 'LEGUME', 'DAIRY', 'PROTEIN', 'CURRY'}

# Breakfast-appropriate categories
BREAKFAST_CATEGORIES = {'GRAIN', 'BREAD', 'DAIRY', 'BREAKFAST', 'FRUIT', 'BEVERAGE'}

# How many top candidates to sample from (for variety)
TOP_N_SAMPLE = 8


class MealRecommendationEngine:
    """Generate personalized meal plans for users"""

    def __init__(self, user_profile):
        self.user = user_profile
        self.foods = Food.objects.all()

    # ------------------------------------------------------------------
    # Nutritional vectors
    # ------------------------------------------------------------------

    def get_meal_target_vector(self, calorie_fraction):
        """
        Create a feature vector for a specific meal's calorie target.
        Uses the same macro ratios as the user's daily targets, scaled
        to the meal's calorie fraction.

        Fix #1: Compare food vectors to per-meal targets, not daily totals.
        """
        return np.array([
            float(self.user.daily_calories) * calorie_fraction,
            float(self.user.daily_protein) * calorie_fraction,
            float(self.user.daily_carbs) * calorie_fraction,
            float(self.user.daily_fats) * calorie_fraction,
        ]).reshape(1, -1)

    def get_food_nutritional_vector(self, food):
        """Feature vector for a food item: [calories, protein, carbs, fats]"""
        return np.array([
            float(food.calories),
            float(food.protein),
            float(food.carbohydrates),
            float(food.fat),
        ])

    # ------------------------------------------------------------------
    # Constraint filtering
    # ------------------------------------------------------------------

    def apply_constraints(self, queryset):
        """
        Apply user-specific hard constraints to food queryset:
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
            budget_divisor = 3
            if self.user.cluster_name == 'Budget-Conscious Users':
                budget_divisor = 4
            avg_meal_budget = float(self.user.daily_budget) / budget_divisor
            queryset = queryset.filter(average_price__lte=avg_meal_budget)

        # Diabetes-aware filtering
        if self.user.diabetes_status in ['PRE_DIABETIC', 'TYPE_1', 'TYPE_2']:
            queryset = queryset.exclude(gi_category='HIGH')
            if self.user.cluster_name == 'Diabetic Management':
                queryset = queryset.filter(is_diabetes_friendly=True)

        return queryset

    def _is_excluded_category(self, food):
        """
        Fix #3: Return True if this food belongs to a category that should
        never appear as a standalone main meal item (fats, sweeteners, condiments).
        """
        cat = (getattr(food, 'category', '') or '').upper()
        if cat in EXCLUDED_MAIN_CATEGORIES:
            return True
        # Also check by CSV category string (stored in category field)
        cat_lower = cat.lower()
        for excl in EXCLUDED_CSV_CATEGORIES:
            if excl in cat_lower:
                return True
        return False

    # ------------------------------------------------------------------
    # Composite scoring
    # ------------------------------------------------------------------

    def calculate_composite_scores(self, foods_queryset, calorie_fraction):
        """
        Fix #1 + #4 + #5: Calculate a composite score for each food.

        Score = 0.50 * cosine_similarity (vs per-meal target)
              + 0.25 * protein_score      (rewards protein-rich foods)
              + 0.15 * gi_score           (rewards low-GI foods)
              + 0.10 * goal_score         (calorie density aligned with goal)

        For diabetic users, gi_score weight is increased to 0.25 and
        protein_score reduced to 0.15.

        Returns: List of (food, composite_score) sorted descending.
        """
        meal_vector = self.get_meal_target_vector(calorie_fraction)
        is_diabetic = self.user.diabetes_status in ['PRE_DIABETIC', 'TYPE_1', 'TYPE_2']

        # Weight adjustments for diabetic users
        w_cosine  = 0.50
        w_protein = 0.15 if is_diabetic else 0.25
        w_gi      = 0.25 if is_diabetic else 0.15
        w_goal    = 0.10

        food_scores = []
        for food in foods_queryset:
            # Fix #3: Skip excluded categories
            if self._is_excluded_category(food):
                continue

            food_vector = self.get_food_nutritional_vector(food).reshape(1, -1)

            # --- Cosine similarity (Fix #1: per-meal vector) ---
            cos_score = float(cosine_similarity(meal_vector, food_vector)[0][0])

            # --- Protein score (normalized 0-1 over a 40g max) ---
            protein_score = min(float(food.protein) / 40.0, 1.0)

            # --- GI score ---
            gi_map = {'LOW': 1.0, 'MEDIUM': 0.6, 'HIGH': 0.2, '': 0.5, None: 0.5}
            gi_score = gi_map.get(getattr(food, 'gi_category', ''), 0.5)

            # --- Goal-aware calorie density score (Fix #5) ---
            cal_density = float(food.calories)  # kcal per serving
            goal = getattr(self.user, 'goal', 'MAINTAIN_WEIGHT')
            if goal == 'LOSE_WEIGHT':
                # Prefer lower calorie items (penalty for >300 kcal)
                goal_score = max(0.0, 1.0 - (cal_density - 150) / 400)
            elif goal == 'GAIN_WEIGHT':
                # Prefer higher calorie items (bonus for >200 kcal)
                goal_score = min(1.0, cal_density / 400)
            else:
                goal_score = 0.5  # neutral

            composite = (
                w_cosine  * cos_score +
                w_protein * protein_score +
                w_gi      * gi_score +
                w_goal    * goal_score
            )
            food_scores.append((food, composite))

        food_scores.sort(key=lambda x: x[1], reverse=True)
        return food_scores

    # ------------------------------------------------------------------
    # Meal selection
    # ------------------------------------------------------------------

    def _weighted_sample(self, food_scores, n):
        """
        Fix #6: Pick up to n items from the top TOP_N_SAMPLE candidates
        using weighted random sampling (score as weight).
        This gives variety across days while still preferring good matches.
        """
        pool = food_scores[:TOP_N_SAMPLE]
        if not pool:
            return []
        foods, weights = zip(*pool)
        weights = np.array(weights, dtype=float)
        weights = np.clip(weights, 0, None)
        total = weights.sum()
        if total == 0:
            weights = np.ones(len(weights))
            total = float(len(weights))
        weights = weights / total

        chosen = []
        available = list(range(len(foods)))
        for _ in range(min(n, len(available))):
            if not available:
                break
            w = weights[available]
            w = w / w.sum()
            idx = random.choices(available, weights=w, k=1)[0]
            chosen.append(foods[idx])
            available.remove(idx)
        return chosen

    def select_meal(self, meal_type, calorie_fraction, exclude_foods=None, max_items=4):
        """
        Select multiple foods for a specific meal type.

        Improvements applied:
        - Fix #1: Uses per-meal calorie fraction for similarity scoring
        - Fix #2: Enforces category diversity (no two items same category,
                  except VEGETABLE which can appear twice)
        - Fix #3: Excludes fat/sweetener/condiment categories
        - Fix #6: Uses weighted random sampling from top candidates
        - Fix #7: Enforces meal structure (carb base + protein source)

        Args:
            meal_type:        'Breakfast', 'Lunch', 'Dinner'
            calorie_fraction: Fraction of daily calories for this meal (e.g. 0.25)
            exclude_foods:    List of food IDs already used today
            max_items:        Maximum food items for this meal

        Returns:
            List of Food objects
        """
        if exclude_foods is None:
            exclude_foods = []

        target_calories = float(self.user.daily_calories) * calorie_fraction

        # Get foods for this meal type
        foods = self.foods.filter(meal_type__icontains=meal_type)
        foods = self.apply_constraints(foods)
        foods = foods.exclude(id__in=exclude_foods)

        if not foods.exists():
            return []

        # Score all candidates
        food_scores = self.calculate_composite_scores(foods, calorie_fraction)
        if not food_scores:
            return []

        selected_foods = []
        total_calories = 0
        used_categories = {}   # category -> count

        def category_of(food):
            return (getattr(food, 'category', '') or 'UNKNOWN').upper()

        def beverage_count():
            return used_categories.get('BEVERAGE', 0)

        def has_non_beverage():
            return any(c != 'BEVERAGE' for c in used_categories)

        def has_full_meal():
            return used_categories.get('MEAL', 0) > 0

        # Fix #2: Category diversity check
        def category_allowed(food):
            cat = category_of(food)
            if cat == 'BEVERAGE':
                # At most 1 beverage, and only as an add-on
                if beverage_count() >= 1:
                    return False
                if not has_non_beverage():
                    return False
                return True
            if cat == 'MEAL':
                # At most 1 complete meal item
                if has_full_meal():
                    return False
                return True
            if cat == 'VEGETABLE':
                # Allow up to 2 different vegetables
                return used_categories.get('VEGETABLE', 0) < 2
            # All other categories: at most 1 per meal
            return used_categories.get(cat, 0) < 1

        # First pass: fill up to target calories
        remaining_scores = list(food_scores)
        while len(selected_foods) < max_items and remaining_scores:
            # Sample from top candidates (Fix #6)
            candidate = self._weighted_sample(remaining_scores, 1)
            if not candidate:
                break
            food = candidate[0]
            # Remove from remaining pool
            remaining_scores = [(f, s) for f, s in remaining_scores if f.id != food.id]

            if not category_allowed(food):
                continue

            new_total = total_calories + float(food.calories)
            if new_total <= target_calories * 1.30:
                selected_foods.append(food)
                total_calories = new_total
                exclude_foods.append(food.id)
                cat = category_of(food)
                used_categories[cat] = used_categories.get(cat, 0) + 1

                if abs(total_calories - target_calories) / target_calories <= 0.05:
                    break

        # Fix #7: Meal structure enforcement — ensure carb base + protein source
        # for Lunch and Dinner
        if meal_type.lower() in ('lunch', 'dinner'):
            has_carb = any(category_of(f) in CARB_CATEGORIES for f in selected_foods)
            has_protein = any(category_of(f) in PROTEIN_CATEGORIES for f in selected_foods)

            # If missing carb base, try to add one from remaining pool
            if not has_carb and len(selected_foods) < max_items:
                carb_candidates = [
                    (f, s) for f, s in food_scores
                    if f.id not in [x.id for x in selected_foods]
                    and category_of(f) in CARB_CATEGORIES
                    and category_allowed(f)
                    and total_calories + float(f.calories) <= target_calories * 1.35
                ]
                if carb_candidates:
                    food = carb_candidates[0][0]
                    selected_foods.append(food)
                    total_calories += float(food.calories)
                    cat = category_of(food)
                    used_categories[cat] = used_categories.get(cat, 0) + 1

            # If missing protein source, try to add one
            if not has_protein and len(selected_foods) < max_items:
                protein_candidates = [
                    (f, s) for f, s in food_scores
                    if f.id not in [x.id for x in selected_foods]
                    and category_of(f) in PROTEIN_CATEGORIES
                    and category_allowed(f)
                    and total_calories + float(f.calories) <= target_calories * 1.35
                ]
                if protein_candidates:
                    food = protein_candidates[0][0]
                    selected_foods.append(food)
                    total_calories += float(food.calories)
                    cat = category_of(food)
                    used_categories[cat] = used_categories.get(cat, 0) + 1

        return selected_foods

    # ------------------------------------------------------------------
    # Full meal plan
    # ------------------------------------------------------------------

    def generate_meal_plan(self):
        """
        Generate complete daily meal plan with multiple foods per meal.

        Calorie distribution:
            Breakfast: 25%
            Lunch:     40%
            Dinner:    35%

        Returns:
            {
                'breakfast': [Food objects],
                'lunch':     [Food objects],
                'dinner':    [Food objects],
                'total_calories': float,
                'total_protein':  float,
                'total_carbs':    float,
                'total_fats':     float,
                'nutritional_accuracy': float (%),
                'target_calories': float,
                'user': {...}
            }
        """
        total_calories = float(self.user.daily_calories)

        selected_food_ids = []

        # Breakfast: 25% of daily calories, 1-3 items
        breakfast = self.select_meal(
            'Breakfast', 0.25, selected_food_ids, max_items=3
        )
        selected_food_ids.extend([f.id for f in breakfast])

        # Lunch: 40% of daily calories, 2-5 items
        lunch = self.select_meal(
            'Lunch', 0.40, selected_food_ids, max_items=5
        )
        selected_food_ids.extend([f.id for f in lunch])

        # Dinner: 35% of daily calories, 2-5 items
        dinner = self.select_meal(
            'Dinner', 0.35, selected_food_ids, max_items=5
        )

        all_meals = breakfast + lunch + dinner
        if not all_meals:
            return None

        total_cal    = sum(float(m.calories)      for m in all_meals)
        total_protein = sum(float(m.protein)       for m in all_meals)
        total_carbs   = sum(float(m.carbohydrates) for m in all_meals)
        total_fats    = sum(float(m.fat)           for m in all_meals)

        accuracy = (1 - abs(total_cal - total_calories) / total_calories) * 100
        accuracy = min(accuracy, 100.0)

        return {
            'breakfast': breakfast,
            'lunch':     lunch,
            'dinner':    dinner,
            'total_calories':      round(total_cal, 2),
            'total_protein':       round(total_protein, 2),
            'total_carbs':         round(total_carbs, 2),
            'total_fats':          round(total_fats, 2),
            'target_calories':     total_calories,
            'nutritional_accuracy': round(accuracy, 2),
            'user': {
                'username':          self.user.user.username,
                'cluster':           self.user.cluster_name,
                'dietary_preference': self.user.dietary_preference,
                'diabetes_status':   self.user.diabetes_status,
                'goal':              getattr(self.user, 'goal', 'MAINTAIN_WEIGHT'),
            }
        }

    # ------------------------------------------------------------------
    # Alternatives
    # ------------------------------------------------------------------

    def get_alternative_meals(self, meal_type, exclude_foods=None, limit=5):
        """
        Get alternative meal options for variety.

        Args:
            meal_type:     'Breakfast', 'Lunch', 'Dinner'
            exclude_foods: List of food IDs to exclude
            limit:         Number of alternatives to return

        Returns:
            List of Food objects
        """
        if exclude_foods is None:
            exclude_foods = []

        # Use the midpoint calorie fraction for scoring alternatives
        fraction_map = {'breakfast': 0.25, 'lunch': 0.40, 'dinner': 0.35}
        fraction = fraction_map.get(meal_type.lower(), 0.33)

        foods = self.foods.filter(meal_type__icontains=meal_type)
        foods = self.apply_constraints(foods)
        foods = foods.exclude(id__in=exclude_foods)

        food_scores = self.calculate_composite_scores(foods, fraction)
        return [food for food, score in food_scores[:limit]]