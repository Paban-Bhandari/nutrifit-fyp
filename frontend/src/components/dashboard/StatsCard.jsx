import { Activity, Flame, Users, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { getBmiBadgeColor } from '../../utils/helpers';

const StatsCard = ({ type, profile, mealPlan }) => {
  if (type === 'bmi') {
    const bmi       = parseFloat(profile?.bmi || 0).toFixed(1);
    const category  = profile?.bmi_category || 'Unknown';
    const badgeColor = getBmiBadgeColor(category);

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Activity size={20} className="text-blue-500" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}>
            {category}
          </span>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{bmi}</p>
          <p className="text-sm text-gray-500 mt-0.5">Body Mass Index</p>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          {parseFloat(profile?.height || 0).toFixed(0)} cm · {parseFloat(profile?.weight || 0).toFixed(1)} kg
        </div>
      </div>
    );
  }

  if (type === 'calories') {
    const target  = profile?.daily_calories || 0;
    const actual  = mealPlan ? Math.round(mealPlan.total_calories) : null;
    const goal    = profile?.goal;

    const GoalIcon = goal === 'LOSE_WEIGHT' ? TrendingDown
                   : goal === 'GAIN_WEIGHT' ? TrendingUp
                   : Minus;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Flame size={20} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <GoalIcon size={12} />
            <span>{goal?.replace('_', ' ') || 'Goal'}</span>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{target.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-0.5">Target kcal/day</p>
        </div>
        {actual !== null && (
          <div className="text-xs text-emerald-600 font-medium">
            Today's plan: {actual.toLocaleString()} kcal
          </div>
        )}
      </div>
    );
  }

  if (type === 'cluster') {
    const clusterName = profile?.cluster_name || 'Standard';
    const dietary     = profile?.dietary_preference || '';

    const dietColor = {
      VEGETARIAN:     'bg-emerald-100 text-emerald-700',
      NON_VEGETARIAN: 'bg-red-100 text-red-700',
      MIXED:          'bg-purple-100 text-purple-700',
    }[dietary] || 'bg-gray-100 text-gray-700';

    const dietLabel = {
      VEGETARIAN:     'Vegetarian',
      NON_VEGETARIAN: 'Non-Veg',
      MIXED:          'Mixed',
    }[dietary] || dietary;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-purple-500" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dietColor}`}>
            {dietLabel}
          </span>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 leading-tight">{clusterName || 'Standard'}</p>
          <p className="text-sm text-gray-500 mt-0.5">User Cluster</p>
        </div>
        <div className="text-xs text-gray-400">
          AI-grouped by activity, age & goals
        </div>
      </div>
    );
  }

  return null;
};

export default StatsCard;
