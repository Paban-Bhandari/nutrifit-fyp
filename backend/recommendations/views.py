from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from accounts.models import UserProfile
from .recommendation_engine import MealRecommendationEngine
from .serializers import MealPlanSerializer


class DailyMealPlanView(APIView):
    """
    Generate a personalized daily meal plan for the logged-in user.

    GET /api/recommendations/daily-plan/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {"detail": "User profile not found. Please complete your profile first."},
                status=400,
            )

        engine = MealRecommendationEngine(profile)
        meal_plan = engine.generate_meal_plan()

        if meal_plan is None:
            return Response(
                {"detail": "Unable to generate meal plan with current constraints and foods."},
                status=400,
            )

        serializer = MealPlanSerializer(meal_plan)
        return Response(serializer.data)

