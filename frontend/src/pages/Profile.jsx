import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Save, User, ArrowLeft, Check, Leaf,
  UtensilsCrossed, Settings, Activity, Apple,
  ChevronRight, Info, Target, Wallet
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ErrorMessage, SuccessMessage } from '../components/common/AlertMessage';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'health',   label: 'Health & Activity', icon: Activity },
  { id: 'dietary',  label: 'Nutrition & Goals', icon: Apple },
];

const Profile = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState({
    age: '', gender: '',
    height: '', weight: '', activity_level: '', goal: '',
    dietary_preference: '', diabetes_status: '', daily_budget: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setForm({
        age: profile.age || '',
        gender: profile.gender || '',
        height: profile.height || '',
        weight: profile.weight || '',
        activity_level: profile.activity_level || '',
        goal: profile.goal || '',
        dietary_preference: profile.dietary_preference || '',
        diabetes_status: profile.diabetes_status || '',
        daily_budget: profile.daily_budget || '',
      });
    }
  }, [profile]);

  // Redirect if not authenticated
  if (!authLoading && !user) return <Navigate to="/login" replace />;
  if (authLoading || !profile) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    </Layout>
  );

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    if (apiError) setApiError('');
    if (success) setSuccess('');
  };

  const validate = () => {
    const errs = {};
    if (!form.age) errs.age = 'Age is required';
    else if (parseInt(form.age) < 10 || parseInt(form.age) > 120) errs.age = 'Age must be between 10–120';
    if (!form.gender) errs.gender = 'Gender is required';
    if (!form.height) errs.height = 'Height is required';
    else if (parseFloat(form.height) < 50 || parseFloat(form.height) > 300) errs.height = 'Height must be 50–300 cm';
    if (!form.weight) errs.weight = 'Weight is required';
    else if (parseFloat(form.weight) < 20 || parseFloat(form.weight) > 500) errs.weight = 'Weight must be 20–500 kg';
    if (!form.activity_level) errs.activity_level = 'Activity level is required';
    if (!form.goal) errs.goal = 'Goal is required';
    if (!form.dietary_preference) errs.dietary_preference = 'Dietary preference is required';
    if (!form.diabetes_status) errs.diabetes_status = 'Diabetes status is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setApiError('');
    setSuccess('');

    try {
      const payload = {
        age: parseInt(form.age),
        gender: form.gender,
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        activity_level: form.activity_level,
        goal: form.goal,
        dietary_preference: form.dietary_preference,
        diabetes_status: form.diabetes_status,
        ...(form.daily_budget ? { daily_budget: parseFloat(form.daily_budget) } : { daily_budget: null }),
      };

      await api.patch('/api/accounts/profile/', payload);
      await refreshProfile();
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const data = err?.response?.data;
      setApiError(typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50/50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all bg-white"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your health profile and account preferences</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
                className="bg-white border border-gray-100"
              >
                Discard
              </Button>
              <Button
                onClick={handleSubmit}
                loading={saving}
                size="lg"
                className="px-8 shadow-lg shadow-emerald-500/20"
              >
                <Save size={18} /> Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 overflow-hidden">
                <nav className="space-y-1">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === section.id
                          ? 'bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-inset ring-black/5'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === section.id ? 'bg-white text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        <section.icon size={16} />
                      </div>
                      {section.label}
                      {activeTab === section.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/10 hidden lg:block">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                  <Info size={20} />
                </div>
                <h4 className="font-bold mb-2">Why this matters?</h4>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Your meal plans are generated based on these parameters. Keeping them updated ensures the highest accuracy in nutritional recommendations.
                </p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {apiError && <ErrorMessage message={apiError} className="mb-6 rounded-2xl" onDismiss={() => setApiError('')} />}
              {success && <SuccessMessage message={success} className="mb-6 rounded-2xl" onDismiss={() => setSuccess('')} />}

              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="p-8 sm:p-10">

                  {/* Tab Contents */}
                  <div className="min-h-[400px]">
                    {activeTab === 'personal' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader title="General Profile" desc="These metrics define your basic biological profile." />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                          <Input id="age" type="number" label="Age" placeholder="e.g., 20" value={form.age} onChange={setField('age')} error={errors.age} required icon={Settings} />
                          <SelectField id="gender" label="Gender" value={form.gender} onChange={setField('gender')} error={errors.gender} required options={[
                            { value: '', label: 'Select gender' },
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' },
                            { value: 'OTHER', label: 'Other' },
                          ]} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'health' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionHeader title="Health & Activity" desc="Physical measurements help us calculate your daily calorie requirements (TDEE)." />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
                          <Input id="height" type="number" label="Height (cm)" placeholder="e.g., 170" value={form.height} onChange={setField('height')} error={errors.height} required icon={Target} />
                          <Input id="weight" type="number" label="Weight (kg)" placeholder="e.g., 65" value={form.weight} onChange={setField('weight')} error={errors.weight} required icon={Activity} />
                        </div>
                        <SelectField id="activity_level" label="Activity Level" value={form.activity_level} onChange={setField('activity_level')} error={errors.activity_level} required options={[
                          { value: '', label: 'Select activity level' },
                          { value: 'SEDENTARY', label: 'Sedentary (little/no exercise)' },
                          { value: 'LIGHTLY_ACTIVE', label: 'Lightly Active (1–3 days/week)' },
                          { value: 'MODERATELY_ACTIVE', label: 'Moderately Active (3–5 days/week)' },
                          { value: 'VERY_ACTIVE', label: 'Very Active (6–7 days/week)' },
                          { value: 'EXTREMELY_ACTIVE', label: 'Extremely Active (twice/day)' },
                        ]} />
                      </div>
                    )}

                    {activeTab === 'dietary' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        <div>
                          <SectionHeader title="Goals & Nutrition" desc="Tailor the AI selection engine to your specific needs and budget." />

                          <label className="text-sm font-bold text-gray-700 block mb-4 mt-8">Your Primary Goal</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <OptionCard
                              id="lose" label="Lose Weight" val="LOSE_WEIGHT"
                              current={form.goal} select={(v) => setForm(f => ({ ...f, goal: v }))}
                            />
                            <OptionCard
                              id="maintain" label="Maintain" val="MAINTAIN_WEIGHT"
                              current={form.goal} select={(v) => setForm(f => ({ ...f, goal: v }))}
                            />
                            <OptionCard
                              id="gain" label="Gain Weight" val="GAIN_WEIGHT"
                              current={form.goal} select={(v) => setForm(f => ({ ...f, goal: v }))}
                            />
                          </div>
                          {errors.goal && <p className="text-xs text-red-500 mt-2">{errors.goal}</p>}
                        </div>

                        <div>
                          <label className="text-sm font-bold text-gray-700 block mb-4">Dietary Preference</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <OptionCard
                              id="veg" label="Vegetarian" val="VEGETARIAN"
                              current={form.dietary_preference} select={(v) => setForm(f => ({ ...f, dietary_preference: v }))}
                            />
                            <OptionCard
                              id="nonveg" label="Non-Vegetarian" val="NON_VEGETARIAN"
                              current={form.dietary_preference} select={(v) => setForm(f => ({ ...f, dietary_preference: v }))}
                            />
                            <OptionCard
                              id="mixed" label="Mixed" val="MIXED"
                              current={form.dietary_preference} select={(v) => setForm(f => ({ ...f, dietary_preference: v }))}
                            />
                          </div>
                          {errors.dietary_preference && <p className="text-xs text-red-500 mt-2">{errors.dietary_preference}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                          <SelectField id="diabetes_status" label="Diabetes Status" value={form.diabetes_status} onChange={setField('diabetes_status')} required options={[
                            { value: 'NONE', label: 'None / Normal' },
                            { value: 'PRE_DIABETIC', label: 'Pre-Diabetic' },
                            { value: 'TYPE_1', label: 'Type 1 Diabetes' },
                            { value: 'TYPE_2', label: 'Type 2 Diabetes' },
                          ]} />
                          <Input id="daily_budget" type="number" label="Daily Food Budget (NPR)" placeholder="e.g., 500" value={form.daily_budget} onChange={setField('daily_budget')} helper="Optional — for budget filtering" icon={Wallet} />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Bottom Sticky Action (Mobile Only Placeholder / Desktop Subtle) */}
              <div className="mt-8 flex justify-center text-gray-400 text-xs gap-4">
                <p>© 2026 NutriFit — Privacy Policy</p>
                <p>•</p>
                <p>Terms of Service</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

const SectionHeader = ({ title, desc }) => (
  <div className="border-b border-gray-100 pb-6">
    <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-xl">{desc}</p>
  </div>
);

const SelectField = ({ id, label, value, onChange, options, error, required }) => (
  <div className="flex flex-col gap-2 w-full">
    <label htmlFor={id} className="text-sm font-bold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <select
        id={id} value={value} onChange={onChange}
        className={`w-full px-4 py-3 rounded-2xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none ${error ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
      >
        {options.map(({ value: v, label: l }) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
        <ChevronDown size={16} />
      </div>
    </div>
    {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
  </div>
);

const OptionCard = ({ label, val, current, select }) => {
  const active = current === val;

  return (
    <button
      type="button"
      onClick={() => select(val)}
      className={`relative text-left p-4 rounded-2xl border-2 transition-all group flex items-center gap-3.5 ${active
          ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10'
          : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50/50'
        }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${active ? 'border-emerald-500 bg-emerald-500' : 'border-gray-200 group-hover:border-emerald-300'
        }`}>
        {active && <Check size={12} className="text-white stroke-[3]" />}
      </div>
      <div>
        <p className={`font-bold text-sm leading-none ${active ? 'text-gray-900' : 'text-gray-700'}`}>{label}</p>
      </div>
    </button>
  );
};

const ChevronDown = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);

export default Profile;
