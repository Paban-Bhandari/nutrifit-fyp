import { useState, useEffect, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { RefreshCw, Sparkles, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/dashboard/StatsCard';
import MealPlanCard from '../components/dashboard/MealPlanCard';
import { MacroPieChart, CalorieProgressBar } from '../components/dashboard/NutritionChart';
import { PageLoading, SectionLoading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/AlertMessage';
import Button from '../components/common/Button';
import { activityLevelLabel, goalLabel, dietaryLabel, diabetesLabel, formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();

  const [mealPlan, setMealPlan]         = useState(null);
  const [planLoading, setPlanLoading]   = useState(false);
  const [planError, setPlanError]       = useState('');
  const [generated, setGenerated]       = useState(false);

  // Redirect if not authenticated
  if (!authLoading && !user) return <Navigate to="/login" replace />;
  if (authLoading) return <PageLoading message="Loading your profile…" />;

  const generatePlan = useCallback(async () => {
    setPlanLoading(true);
    setPlanError('');
    try {
      const { data } = await api.get('/api/recommendations/daily-plan/');
      setMealPlan(data);
      setGenerated(true);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Failed to generate meal plan. Please try again.';
      setPlanError(msg);
    } finally {
      setPlanLoading(false);
    }
  }, []);

  // Auto-generate on first visit
  useEffect(() => {
    if (!generated && !planLoading) generatePlan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.first_name || user?.username || 'there';
  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Welcome Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {timeOfDay()}, <span className="gradient-text">{firstName}!</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Here's your personalized nutrition dashboard.
            </p>
          </div>
          {!generated && (
            <Button
              onClick={generatePlan}
              loading={planLoading}
              size="lg"
              id="generate-meal-plan-btn"
              className="shrink-0"
            >
              <RefreshCw size={16} className={planLoading ? 'animate-spin' : ''} />
              Generate Meal Plan
            </Button>
          )}
        </div>

        {/* ── Stats Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatsCard type="bmi"      profile={profile} mealPlan={mealPlan} />
          <StatsCard type="calories" profile={profile} mealPlan={mealPlan} />
          <StatsCard type="cluster"  profile={profile} mealPlan={mealPlan} />
        </div>

        {/* ── Profile Summary Strip ──────────────────────────────────────── */}
        {profile && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Your Profile</h2>
              <Link to="/profile" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                Edit <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <ProfileChip label="Activity"  value={activityLevelLabel(profile.activity_level)} />
              <ProfileChip label="Goal"      value={goalLabel(profile.goal)} />
              <ProfileChip label="Diet"      value={dietaryLabel(profile.dietary_preference)} />
              <ProfileChip label="Diabetes"  value={diabetesLabel(profile.diabetes_status)} />
              <ProfileChip label="Protein/d" value={`${parseFloat(profile.daily_protein || 0).toFixed(0)}g`} />
              {profile.daily_budget && (
                <ProfileChip label="Budget"  value={formatCurrency(profile.daily_budget)} />
              )}
            </div>
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {planError && (
          <ErrorMessage message={planError} onDismiss={() => setPlanError('')} />
        )}

        {/* ── Meal Plan ──────────────────────────────────────────────────── */}
        {planLoading && !mealPlan && (
          <SectionLoading message="Generating your personalized meal plan…" />
        )}

        {mealPlan && (
          <>
            {/* Accuracy Badge and Regenerate Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-emerald-500" />
                <h2 className="text-xl font-extrabold text-gray-900">Today's Meal Plan</h2>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  mealPlan.nutritional_accuracy >= 90
                    ? 'bg-emerald-100 text-emerald-700'
                    : mealPlan.nutritional_accuracy >= 70
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {Math.round(mealPlan.nutritional_accuracy)}% accuracy
                </span>
              </div>
              <Button
                onClick={generatePlan}
                loading={planLoading}
                size="sm"
                id="regenerate-meal-plan-btn"
                className="shrink-0"
              >
                <RefreshCw size={16} className={planLoading ? 'animate-spin' : ''} />
                Regenerate Plan
              </Button>
            </div>

            {/* Meal cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MealPlanCard mealType="breakfast" foods={mealPlan.breakfast} />
              <MealPlanCard mealType="lunch"     foods={mealPlan.lunch} />
              <MealPlanCard mealType="dinner"    foods={mealPlan.dinner} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalorieProgressBar mealPlan={mealPlan} profile={profile} />
              <MacroPieChart mealPlan={mealPlan} />
            </div>

            {/* Daily Totals Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4"> Daily Totals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <TotalChip label="Calories" value={`${Math.round(mealPlan.total_calories)} kcal`} color="text-amber-600" bg="bg-amber-50" />
                <TotalChip label="Protein"  value={`${parseFloat(mealPlan.total_protein).toFixed(1)}g`}  color="text-red-600"     bg="bg-red-50" />
                <TotalChip label="Carbs"    value={`${parseFloat(mealPlan.total_carbs).toFixed(1)}g`}    color="text-orange-600"  bg="bg-orange-50" />
                <TotalChip label="Fat"      value={`${parseFloat(mealPlan.total_fats).toFixed(1)}g`}     color="text-blue-600"    bg="bg-blue-50" />
              </div>
            </div>
          </>
        )}

        {/* ── Empty State ────────────────────────────────────────────────── */}
        {!planLoading && !mealPlan && !planError && (
          <div className="text-center py-20">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center">
              <UtensilsCrossed size={40} className="stroke-[1.5]" />
            </div>
          </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No meal plan yet</h3>
            <p className="text-gray-400 mb-6">Click "Generate Meal Plan" to get your personalized daily plan.</p>
            <Button onClick={generatePlan} loading={planLoading} id="empty-state-generate-btn">
              <Sparkles size={16} /> Generate My Plan
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

const ProfileChip = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-700 mt-0.5 truncate">{value}</p>
  </div>
);

const TotalChip = ({ label, value, color, bg }) => (
  <div className={`${bg} rounded-xl p-4 text-center`}>
    <p className={`text-xl font-extrabold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
  </div>
);

export default Dashboard;
