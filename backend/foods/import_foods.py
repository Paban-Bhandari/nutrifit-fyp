"""
Import Nepali foods from CSV or Excel file
Run from Django shell: python manage.py shell
Then: exec(open('foods/import_foods.py').read())
      import_foods('your_file.csv')
"""

import pandas as pd
from foods.models import Food

def import_foods(file_path):
    """Import foods from CSV or Excel file"""
    
    print(f"📂 Reading file: {file_path}\n")
    
    # Read file (works with both CSV and Excel)
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
    
    print(f"✓ Found {len(df)} foods to import\n")
    
    # Category mapping
    category_map = {
        'meal': 'MEAL',
        'grain': 'GRAIN',
        'legume': 'LEGUME',
        'vegetable': 'VEGETABLE',
        'fruit': 'FRUIT',
        'meat': 'MEAT',
        'dairy': 'DAIRY',
        'snack': 'SNACK',
        'beverage': 'BEVERAGE',
        'dessert': 'DESSERT',
    }
    
    success = 0
    errors = 0
    
    for index, row in df.iterrows():
        try:
            # Get category
            category_raw = str(row.get('Category', 'meal')).strip().lower()
            category = category_map.get(category_raw, 'MEAL')
            
            # Convert Yes/No to Boolean
            is_veg = str(row.get('Vegetarian', 'Yes')).strip().lower() in ['yes', 'true', '1']
            is_diabetes = str(row.get('Diabetes_Friendly', 'No')).strip().lower() in ['yes', 'true', '1']
            
            # Get meal type
            meal_type = str(row.get('Meal_Type', 'Lunch,Dinner')).strip()
            
            # Create or update food
            food, created = Food.objects.update_or_create(
                food_name=row['Food_Name'].strip(),
                defaults={
                    'category': category,
                    'calories': float(row['Calories_kcal']),
                    'protein': float(row['Protein_g']),
                    'carbohydrates': float(row['Carbohydrates_g']),
                    'fat': float(row['Fat_g']),
                    'glycemic_index': int(row['Glycemic_Index']),
                    'is_vegetarian': is_veg,
                    'is_diabetes_friendly': is_diabetes,
                    'meal_type': meal_type,
                    'average_price': float(row['Average_Price_NPR']),
                }
            )
            
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