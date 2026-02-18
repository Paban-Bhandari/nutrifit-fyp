"""
Management command to test the recommendation engine.
Usage: python manage.py test_recommendations [--username USERNAME]
"""

from django.core.management.base import BaseCommand
from accounts.models import UserProfile
from recommendations.recommendation_engine import MealRecommendationEngine


class Command(BaseCommand):
    help = 'Test the recommendation engine for all users (or a specific user)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            help='Test for a specific username only',
        )

    def handle(self, *args, **options):
        username = options.get('username')

        if username:
            profiles = UserProfile.objects.filter(user__username=username)
        else:
            profiles = UserProfile.objects.all()

        if not profiles.exists():
            self.stdout.write(self.style.WARNING('No user profiles found.'))
            return

        for profile in profiles:
            self.stdout.write('\n' + '=' * 60)
            self.stdout.write(self.style.SUCCESS(
                f"User: {profile.user.username}"
            ))
            self.stdout.write(
                f"  Goal: {getattr(profile, 'goal', 'N/A')} | "
                f"Diet: {profile.dietary_preference} | "
                f"Diabetes: {profile.diabetes_status} | "
                f"Cluster: {profile.cluster_name or 'N/A'}"
            )
            self.stdout.write(
                f"  Daily target: {profile.daily_calories} kcal | "
                f"Protein: {profile.daily_protein}g | "
                f"Carbs: {profile.daily_carbs}g | "
                f"Fats: {profile.daily_fats}g"
            )

            engine = MealRecommendationEngine(profile)
            plan = engine.generate_meal_plan()

            if not plan:
                self.stdout.write(self.style.ERROR('  [FAIL] No meal plan generated.'))
                continue

            issues = []

            for meal_name in ('breakfast', 'lunch', 'dinner'):
                items = plan[meal_name]
                self.stdout.write(f"\n  {meal_name.capitalize()}:")

                if not items:
                    self.stdout.write(self.style.WARNING('    (no items)'))
                    issues.append(f'{meal_name}: no items selected')
                    continue

                categories_seen = []
                for food in items:
                    cat = getattr(food, 'category', 'UNKNOWN')
                    gi  = getattr(food, 'gi_category', '?')
                    self.stdout.write(
                        f"    - {food.food_name:<40} "
                        f"[{cat:<12}] {food.calories} kcal  GI:{gi}"
                    )
                    categories_seen.append(cat.upper())

                # Check: no duplicate categories (except VEGETABLE)
                from collections import Counter
                cat_counts = Counter(categories_seen)
                for cat, count in cat_counts.items():
                    if cat != 'VEGETABLE' and count > 1:
                        issues.append(
                            f'{meal_name}: duplicate category "{cat}" ({count}x)'
                        )

                # Check: no fat/sweetener/condiment items
                bad_cats = {'FAT', 'SWEETENER', 'CONDIMENT', 'SALAD'}
                for cat in categories_seen:
                    if cat in bad_cats:
                        issues.append(
                            f'{meal_name}: inappropriate category "{cat}" present'
                        )

                # Check: lunch/dinner has carb base and protein source
                if meal_name in ('lunch', 'dinner'):
                    carb_cats   = {'GRAIN', 'BREAD', 'LEGUME', 'MEAL', 'NOODLES', 'RICE'}
                    protein_cats = {'MEAT', 'LEGUME', 'DAIRY', 'PROTEIN', 'CURRY'}
                    has_carb    = any(c in carb_cats    for c in categories_seen)
                    has_protein = any(c in protein_cats for c in categories_seen)
                    if not has_carb:
                        issues.append(f'{meal_name}: missing carb base')
                    if not has_protein:
                        issues.append(f'{meal_name}: missing protein source')

            self.stdout.write(f"\n  Totals:")
            self.stdout.write(
                f"    Calories: {plan['total_calories']} / {plan['target_calories']} kcal  "
                f"(Accuracy: {plan['nutritional_accuracy']}%)"
            )
            self.stdout.write(
                f"    Protein: {plan['total_protein']}g | "
                f"Carbs: {plan['total_carbs']}g | "
                f"Fats: {plan['total_fats']}g"
            )

            if issues:
                self.stdout.write(self.style.WARNING(f"\n  [WARN] Issues found:"))
                for issue in issues:
                    self.stdout.write(self.style.WARNING(f"    - {issue}"))
            else:
                self.stdout.write(self.style.SUCCESS(
                    "\n  [OK] All checks passed - meal plan looks realistic!"
                ))

        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(self.style.SUCCESS('Done.'))
