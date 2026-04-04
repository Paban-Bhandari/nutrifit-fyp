import { roundNum } from '../../utils/helpers';

const mealConfig = {
  breakfast: {
    label: 'Breakfast',
    gradient: 'from-emerald-50/50 to-white',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-400',
  },
  lunch: {
    label: 'Lunch',
    gradient: 'from-emerald-50/50 to-white',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-400',
  },
  dinner: {
    label: 'Dinner',
    gradient: 'from-emerald-50/50 to-white',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-400',
  },
};

const MealPlanCard = ({ mealType, foods = [] }) => {
  const config = mealConfig[mealType] || mealConfig.breakfast;

  // Calculate meal subtotals
  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + parseFloat(food.calories || 0),
      protein: acc.protein + parseFloat(food.protein || 0),
      carbs: acc.carbs + parseFloat(food.carbohydrates || 0),
      fat: acc.fat + parseFloat(food.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className={`rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradient} overflow-hidden h-full flex flex-col`}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-bold text-gray-800 text-base">{config.label}</h3>
            <p className="text-xs text-gray-500">{foods.length} items</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${config.badge}`}>
          {Math.round(totals.calories)} kcal
        </div>
      </div>

      {/* Food Items */}
      <div className="px-5 pb-4 space-y-2 flex-grow">
        {foods.map((food, idx) => (
          <FoodRow key={food.id || idx} food={food} dot={config.dot} />
        ))}
      </div>

      {/* Macros Subtotal */}
      <div className="mx-5 mb-4 mt-auto px-4 py-3 bg-white/70 rounded-xl border border-white/80">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide text-center">Subtotals</p>
        <div className="grid grid-cols-3 gap-2">
          <MacroChip label="Protein" value={`${roundNum(totals.protein)}g`} color="text-red-600" />
          <MacroChip label="Carbs" value={`${roundNum(totals.carbs)}g`} color="text-amber-600" />
          <MacroChip label="Fat" value={`${roundNum(totals.fat)}g`} color="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

const FoodRow = ({ food, dot }) => {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{food.food_name}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <p className="text-sm font-bold text-gray-700">{Math.round(parseFloat(food.calories || 0))} kcal</p>
      </div>
    </div>
  );
};

const MacroChip = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-sm font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-400 font-medium">{label}</p>
  </div>
);

export default MealPlanCard;
