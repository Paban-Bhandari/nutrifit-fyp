import { Activity, Flame, Users, TrendingDown, TrendingUp, Minus, Scale } from 'lucide-react';
import { getBmiBadgeColor } from '../../utils/helpers';

const StatsCard = ({ type, profile, mealPlan }) => {
  if (type === 'bmi') {
    const bmi = parseFloat(profile?.bmi || 0).toFixed(1);

    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Activity size={18} className="text-blue-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{bmi}</p>
          <p className="text-xs text-gray-500 mt-0.5">Body Mass Index</p>
        </div>
      </div>
    );
  }

  if (type === 'bmi_category') {
    const category = profile?.bmi_category || 'Unknown';

    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Scale size={18} className="text-blue-500" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 leading-tight">{category}</p>
          <p className="text-xs text-gray-500 mt-0.5">BMI Category</p>
        </div>
      </div>
    );
  }

  if (type === 'calories') {
    const target = profile?.daily_calories || 0;
    const actual = mealPlan ? Math.round(mealPlan.total_calories) : null;
    const goal = profile?.goal;

    const GoalIcon = goal === 'LOSE_WEIGHT' ? TrendingDown
      : goal === 'GAIN_WEIGHT' ? TrendingUp
        : Minus;

    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
          <Flame size={18} className="text-amber-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{target.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-0.5">Target kcal/day</p>
        </div>
      </div>
    );
  }

  if (type === 'cluster') {
    const clusterName = profile?.cluster_name || 'Standard';
    const dietary = profile?.dietary_preference || '';

    const dietColor = {
      VEGETARIAN: 'bg-emerald-100 text-emerald-700',
      NON_VEGETARIAN: 'bg-red-100 text-red-700',
      MIXED: 'bg-purple-100 text-purple-700',
    }[dietary] || 'bg-gray-100 text-gray-700';

    const dietLabel = {
      VEGETARIAN: 'Vegetarian',
      NON_VEGETARIAN: 'Non-Veg',
      MIXED: 'Mixed',
    }[dietary] || dietary;

    return (
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
          <Users size={18} className="text-purple-500" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 leading-tight">{clusterName || 'Standard'}</p>
          <p className="text-xs text-gray-500 mt-0.5">User Cluster</p>
        </div>
      </div>
    );
  }

  return null;
};

export default StatsCard;
