from django.urls import path
from .views import DailyMealPlanView

urlpatterns = [
    path('daily-plan/', DailyMealPlanView.as_view(), name='daily-meal-plan'),
]

