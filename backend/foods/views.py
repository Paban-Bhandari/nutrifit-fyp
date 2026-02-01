from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Food
from .serializers import FoodSerializer

class FoodListView(generics.ListAPIView):
    """Get all foods with optional filtering"""
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Food.objects.all()

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category.upper())

        # Filter by vegetarian
        vegetarian = self.request.query_params.get('vegetarian')
        if vegetarian:
            is_veg = vegetarian.lower() in ['true', 'yes', '1']
            queryset = queryset.filter(is_vegetarian=is_veg)

        # Filter by diabetes friendly
        diabetes = self.request.query_params.get('diabetes_friendly')
        if diabetes:
            is_diabetes = diabetes.lower() in ['true', 'yes', '1']
            queryset = queryset.filter(is_diabetes_friendly=is_diabetes)

        # Filter by GI category
        gi_category = self.request.query_params.get('gi_category')
        if gi_category:
            queryset = queryset.filter(gi_category=gi_category.upper())

        # Filter by meal type
        meal_type = self.request.query_params.get('meal_type')
        if meal_type:
            queryset = queryset.filter(meal_type__contains=meal_type)

        # Filter by max price
        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(average_price__lte=float(max_price))

        # Search by name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(food_name__icontains=search)

        return queryset

class FoodDetailView(generics.RetrieveAPIView):
    """Get single food by ID"""
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]
    queryset = Food.objects.all()

class FoodCategoryListView(APIView):
    """Get list of all available categories"""
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Food.objects.values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})

class FoodStatsView(APIView):
    """Get food database statistics"""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'total_foods': Food.objects.count(),
            'vegetarian': Food.objects.filter(is_vegetarian=True).count(),
            'non_vegetarian': Food.objects.filter(is_vegetarian=False).count(),
            'diabetes_friendly': Food.objects.filter(is_diabetes_friendly=True).count(),
            'categories': Food.objects.values_list('category', flat=True).distinct(),
        })