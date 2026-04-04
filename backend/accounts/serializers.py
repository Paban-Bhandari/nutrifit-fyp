from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'age', 'gender', 'height', 'weight',
            'bmi', 'bmi_category', 'activity_level', 'dietary_preference',
            'diabetes_status', 'goal', 'daily_budget',
            'daily_calories', 'daily_protein', 'daily_carbs', 'daily_fats',
            'cluster_id', 'cluster_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'bmi', 'bmi_category', 'daily_calories', 
            'daily_protein', 'daily_carbs', 'daily_fats',
            'created_at', 'updated_at'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)
    
    # Profile fields
    age = serializers.IntegerField(write_only=True)
    gender = serializers.ChoiceField(choices=UserProfile.GENDER_CHOICES, write_only=True)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, write_only=True)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, write_only=True)
    activity_level = serializers.ChoiceField(choices=UserProfile.ACTIVITY_LEVEL_CHOICES, write_only=True)
    dietary_preference = serializers.ChoiceField(choices=UserProfile.DIETARY_PREFERENCE_CHOICES, write_only=True)
    diabetes_status = serializers.ChoiceField(choices=UserProfile.DIABETES_STATUS_CHOICES, write_only=True, required=False)
    goal = serializers.ChoiceField(choices=UserProfile.GOAL_CHOICES, write_only=True, required=False)
    daily_budget = serializers.DecimalField(max_digits=8, decimal_places=2, write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2', 'first_name', 'last_name',
            'age', 'gender', 'height', 'weight', 'activity_level', 
            'dietary_preference', 'diabetes_status', 'goal', 'daily_budget'
        ]
    
    def validate(self, data):
        """Validate password match"""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        """Create user and profile"""
        # Extract profile data
        profile_data = {
            'age': validated_data.pop('age'),
            'gender': validated_data.pop('gender'),
            'height': validated_data.pop('height'),
            'weight': validated_data.pop('weight'),
            'activity_level': validated_data.pop('activity_level'),
            'dietary_preference': validated_data.pop('dietary_preference'),
            'diabetes_status': validated_data.pop('diabetes_status', 'NONE'),
            'goal': validated_data.pop('goal', 'MAINTAIN_WEIGHT'),
            'daily_budget': validated_data.pop('daily_budget', None),
        }
        
        # Remove password2
        validated_data.pop('password2')
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create profile
        UserProfile.objects.create(user=user, **profile_data)
        
        return user

class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)