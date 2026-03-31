/**
 * NutriFit Helper Utilities
 */

// ─── BMI Helpers ────────────────────────────────────────────────────────────

export const getBmiColor = (category) => {
  const map = {
    Underweight: 'text-blue-600',
    Normal:      'text-emerald-600',
    Overweight:  'text-amber-500',
    Obese:       'text-red-500',
  };
  return map[category] || 'text-gray-600';
};

export const getBmiBadgeColor = (category) => {
  const map = {
    Underweight: 'bg-blue-100 text-blue-700 border-blue-200',
    Normal:      'bg-emerald-100 text-emerald-700 border-emerald-200',
    Overweight:  'bg-amber-100 text-amber-700 border-amber-200',
    Obese:       'bg-red-100 text-red-700 border-red-200',
  };
  return map[category] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// ─── GI Helpers ─────────────────────────────────────────────────────────────

export const getGiColor = (giCategory) => {
  const map = {
    LOW:    'gi-low',
    MEDIUM: 'gi-medium',
    HIGH:   'gi-high',
  };
  return map[giCategory] || 'gi-low';
};

export const getGiLabel = (giCategory) => {
  const map = {
    LOW:    'Low GI',
    MEDIUM: 'Med GI',
    HIGH:   'High GI',
  };
  return map[giCategory] || giCategory;
};

// ─── Activity Level Labels ───────────────────────────────────────────────────

export const activityLevelLabel = (level) => {
  const map = {
    SEDENTARY:          'Sedentary',
    LIGHTLY_ACTIVE:     'Lightly Active',
    MODERATELY_ACTIVE:  'Moderately Active',
    VERY_ACTIVE:        'Very Active',
    EXTREMELY_ACTIVE:   'Extremely Active',
  };
  return map[level] || level;
};

// ─── Goal Labels ─────────────────────────────────────────────────────────────

export const goalLabel = (goal) => {
  const map = {
    LOSE_WEIGHT:     'Lose Weight',
    MAINTAIN_WEIGHT: 'Maintain Weight',
    GAIN_WEIGHT:     'Gain Weight',
  };
  return map[goal] || goal;
};

// ─── Dietary Preference Labels ───────────────────────────────────────────────

export const dietaryLabel = (pref) => {
  const map = {
    VEGETARIAN:     'Vegetarian',
    NON_VEGETARIAN: 'Non-Vegetarian',
    MIXED:          'Mixed',
  };
  return map[pref] || pref;
};

// ─── Diabetes Status Labels ──────────────────────────────────────────────────

export const diabetesLabel = (status) => {
  const map = {
    NONE:        'None',
    PRE_DIABETIC:'Pre-Diabetic',
    TYPE_1:      'Type 1 Diabetes',
    TYPE_2:      'Type 2 Diabetes',
  };
  return map[status] || status;
};

// ─── Nutrition Helpers ───────────────────────────────────────────────────────

export const caloriePercent = (actual, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((actual / target) * 100), 100);
};

export const roundNum = (val, places = 1) =>
  Math.round((parseFloat(val) || 0) * Math.pow(10, places)) / Math.pow(10, places);

// ─── Food Category Styles ────────────────────────────────────────────────────

export const categoryColor = (cat) => {
  const map = {
    MEAL:      'bg-purple-100 text-purple-700',
    GRAIN:     'bg-amber-100 text-amber-700',
    LEGUME:    'bg-orange-100 text-orange-700',
    VEGETABLE: 'bg-emerald-100 text-emerald-700',
    FRUIT:     'bg-pink-100 text-pink-700',
    MEAT:      'bg-red-100 text-red-700',
    DAIRY:     'bg-blue-100 text-blue-700',
    SNACK:     'bg-indigo-100 text-indigo-700',
    BEVERAGE:  'bg-cyan-100 text-cyan-700',
    DESSERT:   'bg-rose-100 text-rose-700',
  };
  return map[cat] || 'bg-gray-100 text-gray-700';
};

export const categoryLabel = (cat) => {
  const map = {
    MEAL:      'Complete Meal',
    GRAIN:     'Grain',
    LEGUME:    'Legume',
    VEGETABLE: 'Vegetable',
    FRUIT:     'Fruit',
    MEAT:      'Meat',
    DAIRY:     'Dairy',
    SNACK:     'Snack',
    BEVERAGE:  'Beverage',
    DESSERT:   'Dessert',
  };
  return map[cat] || cat;
};

// ─── Format Helpers ──────────────────────────────────────────────────────────

export const formatCalories = (val) => `${Math.round(parseFloat(val) || 0)} kcal`;

export const formatCurrency = (val) =>
  `NPR ${parseFloat(val || 0).toLocaleString('en-NP', { maximumFractionDigits: 0 })}`;

export const getClusterLabel = (clusterName) => {
  if (!clusterName) return 'Standard';
  const name = clusterName.toLowerCase();
  if (name.includes('young') || name.includes('active')) return 'Young & Active';
  if (name.includes('senior') || name.includes('elderly')) return 'Senior';
  if (name.includes('sedentary')) return 'Sedentary';
  if (name.includes('weight management') || name.includes('overweight')) return 'Weight Mgmt';
  return clusterName;
};
