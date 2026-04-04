import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';
import { roundNum, caloriePercent } from '../../utils/helpers';

// ── Macro Pie Chart ──────────────────────────────────────────────────────────

const MACRO_COLORS = {
  Protein: '#ef4444',
  Carbs: '#f59e0b',
  Fat: '#3b82f6',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-gray-500">{value}g</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ data }) => (
  <div className="flex items-center justify-center gap-5 mt-4">
    {data.map(({ name, color }) => (
      <div key={name} className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">{name}</span>
      </div>
    ))}
  </div>
);

export const MacroPieChart = ({ mealPlan, noCard = false }) => {
  const protein = roundNum(mealPlan?.total_protein || 0);
  const carbs = roundNum(mealPlan?.total_carbs || 0);
  const fat = roundNum(mealPlan?.total_fats || 0);

  const data = [
    { name: 'Protein', value: protein, color: MACRO_COLORS.Protein },
    { name: 'Carbs', value: carbs, color: MACRO_COLORS.Carbs },
    { name: 'Fat', value: fat, color: MACRO_COLORS.Fat },
  ];

  const total = protein + carbs + fat;

  const content = (
    <>
      <h3 className="font-bold text-gray-800 text-base mb-1">Macros Distribution</h3>
      <p className="text-xs text-gray-400 mb-4">Protein · Carbohydrates · Fat</p>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map(({ name, color }) => (
                <Cell key={name} fill={color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend data={data} />
    </>
  );

  if (noCard) return <div>{content}</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {content}
    </div>
  );
};

// ── Calorie Progress Bar ─────────────────────────────────────────────────────

export const CalorieProgressBar = ({ mealPlan, profile, onRegenerate, loading }) => {
  const actual = Math.round(mealPlan?.total_calories || 0);
  const target = profile?.daily_calories || 1;
  const pct = caloriePercent(actual, target);
  const accuracy = mealPlan?.nutritional_accuracy
    ? Math.round(mealPlan.nutritional_accuracy)
    : pct;

  const barColor =
    accuracy >= 90 ? '#10b981' :
      accuracy >= 70 ? '#f59e0b' : '#ef4444';

  const badgeColor =
    accuracy >= 90 ? 'bg-emerald-100 text-emerald-700' :
      accuracy >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800 text-base">Daily Calories</h3>
          <p className="text-xs text-gray-400">Today's plan vs target</p>
        </div>
        <Button
          onClick={onRegenerate}
          loading={loading}
          size="sm"
          variant="outline"
          id="regenerate-meal-plan-btn"
          className="shrink-0"
        >
          {!loading && <RefreshCw size={14} />}
          Regenerate
        </Button>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-bold text-gray-900">{actual.toLocaleString()}</span>
        <span className="text-gray-400 text-sm mb-1">/ {target.toLocaleString()} kcal</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>0 kcal</span>
        <span>{target.toLocaleString()} kcal target</span>
      </div>
    </div>
  );
};

export default MacroPieChart;
