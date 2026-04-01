import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, ChevronRight, ChevronLeft,
  Check, Leaf, ArrowRight
} from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { ErrorMessage, SuccessMessage } from '../components/common/AlertMessage';
import {
  activityLevelLabel, goalLabel, dietaryLabel, diabetesLabel
} from '../utils/helpers';

// ── Form initial state ───────────────────────────────────────────────────────
const initialForm = {
  // Step 1 – Account
  username: '', email: '', password: '', password2: '',
  // Step 2 – Personal
  first_name: '', last_name: '', age: '', gender: '',
  // Step 3 – Health Metrics
  height: '', weight: '', activity_level: '', goal: 'MAINTAIN_WEIGHT',
  // Step 4 – Dietary
  dietary_preference: 'MIXED', diabetes_status: 'NONE', daily_budget: '',
};

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Personal' },
  { id: 3, label: 'Health' },
  { id: 4, label: 'Dietary' },
  { id: 5, label: 'Review' },
];

// ── Validation ───────────────────────────────────────────────────────────────
const validate = (step, form) => {
  const errs = {};
  if (step === 1) {
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Minimum 3 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!form.password2) errs.password2 = 'Please confirm your password';
    else if (form.password !== form.password2) errs.password2 = 'Passwords do not match';
  }
  if (step === 2) {
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!form.age) errs.age = 'Age is required';
    else if (parseInt(form.age) < 10 || parseInt(form.age) > 120) errs.age = 'Age must be between 10–120';
    if (!form.gender) errs.gender = 'Gender is required';
  }
  if (step === 3) {
    if (!form.height) errs.height = 'Height is required';
    else if (parseFloat(form.height) < 50 || parseFloat(form.height) > 300) errs.height = 'Height must be 50–300 cm';
    if (!form.weight) errs.weight = 'Weight is required';
    else if (parseFloat(form.weight) < 20 || parseFloat(form.weight) > 500) errs.weight = 'Weight must be 20–500 kg';
    if (!form.activity_level) errs.activity_level = 'Activity level is required';
  }
  if (step === 4) {
    if (!form.dietary_preference) errs.dietary_preference = 'Required';
  }
  return errs;
};

// ═══════════════════════════════════════════════════════════════════════════════
const Register = () => {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate              = useNavigate();

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => { const n = {...prev}; delete n[field]; return n; });
    if (apiError) setApiError('');
  };

  const next = () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const back = () => { setErrors({}); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        username:           form.username.trim(),
        email:              form.email.trim(),
        password:           form.password,
        password2:          form.password2,
        first_name:         form.first_name.trim(),
        last_name:          form.last_name.trim(),
        age:                parseInt(form.age),
        gender:             form.gender,
        height:             parseFloat(form.height),
        weight:             parseFloat(form.weight),
        activity_level:     form.activity_level,
        goal:               form.goal,
        dietary_preference: form.dietary_preference,
        diabetes_status:    form.diabetes_status,
        ...(form.daily_budget ? { daily_budget: parseFloat(form.daily_budget) } : {}),
      };
      await api.post('/api/accounts/register/', payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        const msgs = Object.values(data).flat().join(' ');
        setApiError(msgs || 'Registration failed. Please try again.');
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100/30 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check size={36} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Account Created!</h2>
            <p className="text-gray-500 mb-6">Redirecting you to the login page…</p>
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline text-sm">
              Click here if not redirected
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100/30 px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Leaf size={22} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1 text-sm">Tell us about yourself to get personalised meal plans</p>
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map(({ id, label }, i) => (
              <div key={id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > id  ? 'bg-emerald-500 text-white' :
                    step === id ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' :
                                 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > id ? <Check size={16} /> : id}
                  </div>
                  <span className="text-xs font-medium mt-1.5 hidden sm:block text-gray-500">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-all ${step > id ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            {apiError && <ErrorMessage message={apiError} className="mb-5" onDismiss={() => setApiError('')} />}

            {/* ── Step 1: Account ── */}
            {step === 1 && (
              <StepSection title="Account Details" subtitle="Set up your login credentials">
                <Input id="username" label="Username" placeholder="e.g., pabanbhandari" value={form.username} onChange={set('username')} icon={User} error={errors.username} required />
                <Input id="email" type="email" label="Email Address" placeholder="your@email.com" value={form.email} onChange={set('email')} icon={Mail} error={errors.email} required />
                <PasswordField id="password" label="Password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} show={showPwd} setShow={setShowPwd} error={errors.password} />
                <Input id="password2" type="password" label="Confirm Password" placeholder="Re-enter password" value={form.password2} onChange={set('password2')} icon={Lock} error={errors.password2} required />
              </StepSection>
            )}

            {/* ── Step 2: Personal ── */}
            {step === 2 && (
              <StepSection title="Personal Information" subtitle="Help us get to know you">
                <div className="grid grid-cols-2 gap-4">
                  <Input id="first_name" label="First Name" placeholder="e.g.,Paban" value={form.first_name} onChange={set('first_name')} error={errors.first_name} required />
                  <Input id="last_name" label="Last Name" placeholder="e.g., Bhandari" value={form.last_name} onChange={set('last_name')} error={errors.last_name} required />
                </div>
                <Input id="age" type="number" label="Age" placeholder="e.g., 20" value={form.age} onChange={set('age')} helper="Your age in years (10–120)" error={errors.age} required />
                <SelectField id="gender" label="Gender" value={form.gender} onChange={set('gender')} error={errors.gender} required options={[
                  { value: '', label: 'Select gender' },
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHER', label: 'Other' },
                ]} />
              </StepSection>
            )}

            {/* ── Step 3: Health ── */}
            {step === 3 && (
              <StepSection title="Health Metrics" subtitle="Used to calculate your nutritional needs">
                <div className="grid grid-cols-2 gap-4">
                  <Input id="height" type="number" label="Height (cm)" placeholder="e.g., 170" value={form.height} onChange={set('height')} error={errors.height} required />
                  <Input id="weight" type="number" label="Weight (kg)" placeholder="e.g., 65" value={form.weight} onChange={set('weight')} error={errors.weight} required />
                </div>
                <SelectField id="activity_level" label="Activity Level" value={form.activity_level} onChange={set('activity_level')} error={errors.activity_level} required options={[
                  { value: '', label: 'Select activity level' },
                  { value: 'SEDENTARY',         label: 'Sedentary (little/no exercise)' },
                  { value: 'LIGHTLY_ACTIVE',    label: 'Lightly Active (1–3 days/week)' },
                  { value: 'MODERATELY_ACTIVE', label: 'Moderately Active (3–5 days/week)' },
                  { value: 'VERY_ACTIVE',       label: 'Very Active (6–7 days/week)' },
                  { value: 'EXTREMELY_ACTIVE',  label: 'Extremely Active (twice/day)' },
                ]} />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Goal <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: 'LOSE_WEIGHT', l: ' Lose Weight' },
                      { v: 'MAINTAIN_WEIGHT', l: ' Maintain Weight' },
                      { v: 'GAIN_WEIGHT', l: ' Gain Weight' },
                    ].map(({ v, l }) => (
                      <label key={v} className={`cursor-pointer border rounded-xl px-3 py-3 text-center text-sm font-medium transition-all ${form.goal === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                        <input type="radio" name="goal" value={v} checked={form.goal === v} onChange={set('goal')} className="sr-only" />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
              </StepSection>
            )}

            {/* ── Step 4: Dietary ── */}
            {step === 4 && (
              <StepSection title="Dietary Preferences" subtitle="We'll tailor your meal plan accordingly">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Dietary Preference <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: 'VEGETARIAN', l: ' Vegetarian' },
                      { v: 'NON_VEGETARIAN', l: ' Non-Veg' },
                      { v: 'MIXED', l: ' Mixed' },
                    ].map(({ v, l }) => (
                      <label key={v} className={`cursor-pointer border rounded-xl px-3 py-3 text-center text-sm font-medium transition-all ${form.dietary_preference === v ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                        <input type="radio" name="dietary_preference" value={v} checked={form.dietary_preference === v} onChange={set('dietary_preference')} className="sr-only" />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <SelectField id="diabetes_status" label="Diabetes Status" value={form.diabetes_status} onChange={set('diabetes_status')} options={[
                  { value: 'NONE',        label: 'None (No diabetes)' },
                  { value: 'PRE_DIABETIC',label: 'Pre-Diabetic' },
                  { value: 'TYPE_1',      label: 'Type 1 Diabetes' },
                  { value: 'TYPE_2',      label: 'Type 2 Diabetes' },
                ]} />
                <Input id="daily_budget" type="number" label="Daily Food Budget (NPR)" placeholder="e.g., 500" value={form.daily_budget} onChange={set('daily_budget')} helper="Optional — leave blank to skip budget filtering" />
              </StepSection>
            )}

            {/* ── Step 5: Review ── */}
            {step === 5 && (
              <StepSection title="Review & Submit" subtitle="Double-check your information before creating your account">
                <div className="space-y-3">
                  <ReviewGroup label="Account">
                    <ReviewRow k="Username" v={form.username} />
                    <ReviewRow k="Email" v={form.email} />
                  </ReviewGroup>
                  <ReviewGroup label="Personal">
                    <ReviewRow k="Name" v={`${form.first_name} ${form.last_name}`} />
                    <ReviewRow k="Age" v={`${form.age} years`} />
                    <ReviewRow k="Gender" v={form.gender} />
                  </ReviewGroup>
                  <ReviewGroup label="Health">
                    <ReviewRow k="Height" v={`${form.height} cm`} />
                    <ReviewRow k="Weight" v={`${form.weight} kg`} />
                    <ReviewRow k="Activity" v={activityLevelLabel(form.activity_level)} />
                    <ReviewRow k="Goal" v={goalLabel(form.goal)} />
                  </ReviewGroup>
                  <ReviewGroup label="Dietary">
                    <ReviewRow k="Preference" v={dietaryLabel(form.dietary_preference)} />
                    <ReviewRow k="Diabetes" v={diabetesLabel(form.diabetes_status)} />
                    {form.daily_budget && <ReviewRow k="Budget" v={`NPR ${form.daily_budget}`} />}
                  </ReviewGroup>
                </div>
              </StepSection>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
              {step > 1 ? (
                <Button variant="ghost" onClick={back} className="gap-1">
                  <ChevronLeft size={16} /> Back
                </Button>
              ) : (
                <Link to="/login" className="text-sm text-gray-400 hover:text-emerald-600">
                  Already registered?
                </Link>
              )}

              {step < 5 ? (
                <Button onClick={next} id={`register-next-step-${step}`}>
                  Next <ChevronRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={loading} id="register-submit-btn">
                  Create Account <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Step {step} of {STEPS.length} — {STEPS[step - 1].label}
          </p>
        </div>
      </div>
    </Layout>
  );
};

// ── Helper sub-components ────────────────────────────────────────────────────

const StepSection = ({ title, subtitle, children }) => (
  <div className="space-y-5">
    <div className="mb-2">
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
    </div>
    {children}
  </div>
);

const PasswordField = ({ id, label, placeholder, value, onChange, show, setShow, error }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></div>
      <input
        id={id} type={show ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange}
        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
      />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ id, label, value, onChange, options, error, required }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id} value={value} onChange={onChange}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
    >
      {options.map(({ value: v, label: l }) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const ReviewGroup = ({ label, children }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</p>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const ReviewRow = ({ k, v }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{k}</span>
    <span className="font-medium text-gray-800 truncate ml-4">{v || '—'}</span>
  </div>
);

export default Register;
