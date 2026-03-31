import { Link } from 'react-router-dom';
import { useRef } from 'react';
import {
  Brain, UtensilsCrossed, Wallet, HeartPulse,
  ArrowRight, ChevronDown, Star,
  UserPlus, Cpu, CalendarCheck
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

// ── Feature Data ─────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    color: 'bg-purple-100 text-purple-600',
    title: 'AI-Powered Recommendations',
    desc: 'K-Means clustering groups you with similar users, while cosine similarity selects the most compatible foods for your profile.',
  },
  {
    icon: UtensilsCrossed,
    color: 'bg-emerald-100 text-emerald-600',
    title: '250+ Authentic Nepali Foods',
    desc: 'Dal Bhat, Momo, Sel Roti, Gundruk — our curated database captures the richness of Nepali cuisine with full nutrition data.',
  },
  {
    icon: Wallet,
    color: 'bg-amber-100 text-amber-600',
    title: 'Budget-Friendly Plans',
    desc: 'Enter your daily budget in NPR and get meal plans that respect your wallet without sacrificing nutrition.',
  },
  {
    icon: HeartPulse,
    color: 'bg-red-100 text-red-600',
    title: 'Diabetes Support',
    desc: 'Priority filtering for low glycemic index foods for pre-diabetic and diabetic users. Your health comes first.',
  },
];

// ── Steps Data ───────────────────────────────────────────────────────────────
const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    desc: 'Enter your age, weight, height, activity level, dietary preferences, and health conditions in our 5-step guided form.',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Analyzes Your Data',
    desc: 'Our K-Means model clusters you with similar users. Content-based filtering then picks foods that match your nutritional targets.',
    color: 'from-emerald-300 to-emerald-500',
  },
  {
    step: '03',
    icon: CalendarCheck,
    title: 'Get Your Daily Plan',
    desc: 'Receive a complete breakfast, lunch, and dinner plan with calorie counts, macros, GI ratings, and estimated prices.',
    color: 'from-emerald-500 to-emerald-700',
  },
];

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: '250+', label: 'Nepali Foods', sub: 'in our database' },
  { value: '94%',  label: 'Accuracy',     sub: 'avg nutritional match' },
  { value: '5',    label: 'User Clusters', sub: 'AI-grouped profiles' },
  { value: '3',    label: 'Meals / Day',  sub: 'personalised daily' },
];

// ═══════════════════════════════════════════════════════════════════════════════
const Home = () => {
  const { user } = useAuth();
  const featuresRef = useRef(null);

  const scrollToFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="gradient-hero min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-emerald-200 mb-8 animate-fade-in">
              <Star size={14} className="fill-emerald-300 text-emerald-300" />
              <span>Final Year Project · BIT Program · AI-Powered</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-up">
              Eat Smart,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">
                Live Better
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl animate-fade-in-up animation-delay-200">
              AI-powered personalized Nepali diet plans. Get healthy, budget-friendly meals
              tailored to your body, goals, and lifestyle — powered by K-Means clustering.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
              <Link
                to={user ? '/dashboard' : '/register'}
                id="hero-cta-primary"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-95"
              >
                {user ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
                <ArrowRight size={20} />
              </Link>
              <button
                onClick={scrollToFeatures}
                id="hero-learn-more"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown size={24} className="text-white/40" />
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, sub }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold gradient-text">{value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Why NutriFit?</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-4">
              Everything you need for{' '}
              <span className="gradient-text">healthy eating</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Built specifically for Nepali cuisine and dietary patterns with cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both', opacity: 0 }}
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to get your personalized Nepali meal plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100" />

            {steps.map(({ step, icon: Icon, title, desc, color }, i) => (
              <div key={step} className="relative text-center flex flex-col items-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon size={32} className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Step {step}</span>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="gradient-hero py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to eat smarter?
          </h2>
          <p className="text-emerald-200 text-lg mb-8">
            Join NutriFit today and get your first AI-powered Nepali meal plan in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              id="cta-banner-register"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              id="cta-banner-login"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
