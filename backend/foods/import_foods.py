import pandas as pd
from foods.models import Food


def clear_all_foods():
    """Delete all food records. Use before import for a full replace."""
    count = Food.objects.count()
    Food.objects.all().delete()
    print(f"🗑 Cleared {count} existing food(s) from database.\n")


def import_foods(file_path, replace_existing=False):
    """
    Import foods from CSV or Excel file.

    Args:
        file_path: Path to CSV/Excel (e.g. 'Nepali_Food_Data.csv.csv')
        replace_existing: If True, deletes all existing foods before importing.
    """
    if replace_existing:
        clear_all_foods()

    print(f"📂 Reading file: {file_path}\n")

    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    print(f"✓ Found {len(df)} foods to import\n")

    # Map CSV category names to Food model choices
    category_map = {
        'main course': 'MEAL',
        'bread': 'GRAIN',
        'grain': 'GRAIN',
        'lentil/dal': 'LEGUME',
        'curry': 'MEAL',
        'vegetable': 'VEGETABLE',
        'grilled': 'MEAT',
        'protein': 'MEAL',
        'side dish': 'MEAL',
        'condiment': 'SNACK',
        'salad': 'VEGETABLE',
        'dairy': 'DAIRY',
        'fat': 'SNACK',
        'beverage': 'BEVERAGE',
        'snack': 'SNACK',
        'noodles': 'MEAL',
        'soup': 'MEAL',
        'dessert': 'DESSERT',
        'breakfast': 'MEAL',
        'fruit': 'FRUIT',
    }

    # Map CSV gi_category to model (Low/Medium/High/None)
    gi_map = {'low': 'LOW', 'medium': 'MEDIUM', 'high': 'HIGH', 'none': ''}

    success = 0
    errors = 0

    for index, row in df.iterrows():
        try:
            # Column names from new CSV
            food_name = str(row['name']).strip()
            category_raw = str(row.get('category', 'meal')).strip().lower()
            category = category_map.get(category_raw, 'MEAL')

            calories = float(row['calories'])
            protein = float(row['protein'])
            carbohydrates = float(row['carbohydrates'])
            fat = float(row['fats'])  # CSV uses 'fats'
            glycemic_index = int(row['glycemic_index'])
            price = float(row['price'])

            gi_raw = str(row.get('gi_category', '')).strip().lower()
            gi_category = gi_map.get(gi_raw, '')
            if not gi_category and glycemic_index <= 55:
                gi_category = 'LOW'
            elif not gi_category and 56 <= glycemic_index <= 69:
                gi_category = 'MEDIUM'
            elif not gi_category and glycemic_index >= 70:
                gi_category = 'HIGH'

            is_veg = str(row.get('is_vegetarian', 'TRUE')).strip().upper() == 'TRUE'
            meal_type = str(row.get('meal_type', 'lunch/dinner')).strip()
            # Diabetes friendly: Low GI foods
            is_diabetes_friendly = gi_category == 'LOW'

            food, created = Food.objects.update_or_create(
                food_name=food_name,
                defaults={
                    'category': category,
                    'calories': calories,
                    'protein': protein,
                    'carbohydrates': carbohydrates,
                    'fat': fat,
                    'glycemic_index': glycemic_index,
                    'gi_category': gi_category or 'LOW',  # model needs a choice; save() will override from GI
                    'is_vegetarian': is_veg,
                    'is_diabetes_friendly': is_diabetes_friendly,
                    'meal_type': meal_type,
                    'average_price': price,
                }
            )
            # Re-save so model's save() sets gi_category from glycemic_index (handles 0 → blank or LOW)
            food.save()

            if created:
                print(f"✓ Created: {food.food_name} (GI: {food.glycemic_index}, {food.gi_category})")
            else:
                print(f"↻ Updated: {food.food_name}")

            success += 1

        except Exception as e:
            errors += 1
            print(f"✗ Error at row {index + 2}: {str(e)}")

    print(f"\n{'='*50}")
    print(f"✅ Import Complete!")
    print(f"   Successfully imported: {success}")
    print(f"   Errors: {errors}")
    print(f"   Total in database: {Food.objects.count()}")
    print(f"{'='*50}")
