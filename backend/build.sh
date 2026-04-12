#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate

# Seed the database with food data for Render Free Tier (since shell is disabled)
python manage.py shell -c "from foods.import_foods import import_foods; import_foods('Nepali_Food_Data.csv.csv', replace_existing=False)"
