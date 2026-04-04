import { useState, useEffect, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { RefreshCw, Sparkles, ChevronRight, UtensilsCrossed, Calendar, Lightbulb } from 'lucide-react';
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

  const [mealPlan, setMealPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState('');
  const [generated, setGenerated] = useState(false);

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
    if (!generated) generatePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.first_name || user?.username || 'there';
  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const tips = [
    "Hydration is key! Drink at least 8 glasses of water today.",
    "Dal contains great protein. Pair with rice for a complete profile!",
    "Skip the extra sugar in your Chiya to reduce empty calories.",
    "Eating slowly helps your brain realize when you are full.",
    "Include a rainbow of vegetables in your Tarkari for diverse nutrients."
  ];
  const tipOfTheDay = tips[new Date().getDate() % tips.length];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Welcome Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          {/* Left: Welcome */}
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left shrink-0">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {timeOfDay()}, <span className="gradient-text">{firstName}!</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Here's your personalized nutrition dashboard.
            </p>
          </div>

          {/* Center: Contextual controls */}
          <div className="flex-1 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm text-sm font-semibold text-gray-700">
              <Calendar size={18} className="text-emerald-500" />
              {currentDate}
            </div>

            {!generated && !planLoading && (
              <Button
                onClick={generatePlan}
                loading={planLoading}
                size="md"
                id="generate-meal-plan-btn"
                className="shrink-0"
              >
                {!planLoading && <RefreshCw size={16} />}
                Generate
              </Button>
            )}
          </div>

          {/* Right: Tip of the day */}
          <div className="hidden xl:flex max-w-sm border border-emerald-100 bg-emerald-50/50 rounded-2xl px-5 py-3 items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Lightbulb size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider mb-0.5">Tip of the Day</p>
              <p className="text-sm font-medium text-emerald-900 leading-tight">{tipOfTheDay}</p>
            </div>
          </div>

        </div>

        {/* ── Top Section: Stats & Profile ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* ── Profile Summary (Left) ──────────────────────────────────────── */}
          {profile && (
            <div className="xl:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Your Profile</h2>
                <Link to="/profile" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                  Edit <ChevronRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 flex-1 content-start">
                <ProfileChip label="Age" value={`${profile.age} yrs`} />
                <ProfileChip label="Gender" value={profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase()} />
                <ProfileChip label="Height" value={`${parseFloat(profile.height).toString()} cm`} />
                <ProfileChip label="Weight" value={`${parseFloat(profile.weight).toString()} kg`} />
                <ProfileChip label="Activity" value={activityLevelLabel(profile.activity_level)} />
                <ProfileChip label="Goal" value={goalLabel(profile.goal)} />
                <ProfileChip label="Diet" value={dietaryLabel(profile.dietary_preference)} />
                <ProfileChip label="Diabetes" value={diabetesLabel(profile.diabetes_status)} />
              </div>
            </div>
          )}

          {/* ── Stats Cards (Right) ────────────────────────────────────────────────── */}
          <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Your Health Metrics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 content-start">
              <StatsCard type="bmi" profile={profile} mealPlan={mealPlan} />
              <StatsCard type="bmi_category" profile={profile} mealPlan={mealPlan} />
              <StatsCard type="cluster" profile={profile} mealPlan={mealPlan} />
              <StatsCard type="calories" profile={profile} mealPlan={mealPlan} />
            </div>
          </div>
        </div>

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
                <h2 className="text-xl font-extrabold text-gray-900">Today's Meal Plan</h2>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${mealPlan.nutritional_accuracy >= 90
                  ? 'bg-emerald-100 text-emerald-700'
                  : mealPlan.nutritional_accuracy >= 70
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {Math.round(mealPlan.nutritional_accuracy)}% accuracy
                </span>
              </div>
            </div>

            {/* Calorie Progress Bar */}
            <CalorieProgressBar
              mealPlan={mealPlan}
              profile={profile}
              onRegenerate={generatePlan}
              loading={planLoading}
            />

            {/* Meal cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MealPlanCard mealType="breakfast" foods={mealPlan.breakfast} />
              <MealPlanCard mealType="lunch" foods={mealPlan.lunch} />
              <MealPlanCard mealType="dinner" foods={mealPlan.dinner} />
            </div>

            {/* Combined Nutrition Insights: Macro Distribution (Left) & Daily Totals (Right) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Macro Distribution */}
                <MacroPieChart mealPlan={mealPlan} noCard={true} />

                {/* Daily Totals Summary */}
                <div className="h-full flex flex-col">
                  <h3 className="font-bold text-gray-800 text-base mb-1">Daily Totals</h3>
                  <p className="text-xs text-gray-400 mb-6">Aggregate nutritional summary</p>
                  
                  <div className="grid grid-cols-2 gap-4 flex-grow">
                    <TotalChip label="Calories" value={`${Math.round(mealPlan.total_calories)} kcal`} color="text-amber-600" bg="bg-amber-50" />
                    <TotalChip label="Protein" value={`${parseFloat(mealPlan.total_protein).toFixed(1)}g`} color="text-red-600" bg="bg-red-50" />
                    <TotalChip label="Carbs" value={`${parseFloat(mealPlan.total_carbs).toFixed(1)}g`} color="text-orange-600" bg="bg-orange-50" />
                    <TotalChip label="Fat" value={`${parseFloat(mealPlan.total_fats).toFixed(1)}g`} color="text-blue-600" bg="bg-blue-50" />
                  </div>
                </div>
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
              {!planLoading && <Sparkles size={16} />} Generate My Plan
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

const ProfileChip = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p className="text-base font-semibold text-gray-700 mt-0.5 truncate">{value}</p>
  </div>
);

const TotalChip = ({ label, value, color, bg }) => (
  <div className={`${bg} rounded-xl p-4 text-center`}>
    <p className={`text-xl font-extrabold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
  </div>
);

export default Dashboard;
