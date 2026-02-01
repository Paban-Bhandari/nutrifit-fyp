from django.urls import path
from .views import (
    FoodListView,
    FoodDetailView,
    FoodCategoryListView,
    FoodStatsView,
)

urlpatterns = [
    path('', FoodListView.as_view(), name='food-list'),
    path('<int:pk>/', FoodDetailView.as_view(), name='food-detail'),
    path('categories/', FoodCategoryListView.as_view(), name='food-categories'),
    path('stats/', FoodStatsView.as_view(), name='food-stats'),
]