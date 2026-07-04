from django.contrib.auth import get_user_model
from django.test import TestCase

from accounts.models import UserProfile
from foods.models import Food
from recommendations.recommendation_engine import MealRecommendationEngine


class MealRecommendationFallbackTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='tester', password='pass1234')
        self.profile = UserProfile.objects.create(
            user=self.user,
            age=25,
            gender='MALE',
            height=170.00,
            weight=70.00,
            activity_level='MODERATELY_ACTIVE',
            dietary_preference='MIXED',
            diabetes_status='NONE',
            goal='MAINTAIN_WEIGHT',
        )
        Food.objects.all().delete()

    def test_generate_meal_plan_bootstraps_food_data_from_csv(self):
        engine = MealRecommendationEngine(self.profile)
        plan = engine.generate_meal_plan()

        self.assertIsNotNone(plan)
        self.assertGreater(Food.objects.count(), 0)
        self.assertGreater(len(plan['breakfast']) + len(plan['lunch']) + len(plan['dinner']), 0)
