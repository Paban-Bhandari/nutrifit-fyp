import { Link } from 'react-router-dom';
import { useRef } from 'react';
import {
  Brain, UtensilsCrossed, Wallet, HeartPulse,
  ArrowRight, ChevronDown,
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


// ═══════════════════════════════════════════════════════════════════════════════
const Home = () => {
  const { user } = useAuth();
  const featuresRef = useRef(null);

  const scrollToFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-emerald-50 min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-300/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-yellow-200/40 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full flex flex-col lg:flex-row lg:items-start items-center justify-between gap-12">
          {/* Left Text Content */}
          <div className="max-w-2xl text-center lg:text-left">
            {/* Welcome Text */}
            <p className="text-emerald-700 font-black tracking-widest uppercase mb-4 animate-fade-in-up flex items-center justify-center lg:justify-start gap-2">
              <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
              Welcome to NutriFit
            </p>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up">
              Eat Smart,{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                Live Better
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
              AI-powered personalized Nepali diet plans. Get healthy, budget-friendly meals
              tailored to your body, goals, and lifestyle — powered by K-Means clustering.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up animation-delay-300">
              <Link
                to={user ? '/dashboard' : '/register'}
                id="hero-cta-primary"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-600/30 transition-all active:scale-95 w-full sm:w-auto"
              >
                {user ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
                <ArrowRight size={20} />
              </Link>
              <button
                onClick={scrollToFeatures}
                id="hero-learn-more"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-emerald-100 text-emerald-800 font-semibold shadow-sm hover:bg-emerald-50 hover:border-emerald-200 transition-colors w-full sm:w-auto"
              >
                Learn More
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Right Visual Element (Abstract UI Mockup) */}
          <div className="hidden lg:block relative w-full max-w-lg mb-12 lg:mb-0 animate-fade-in-up animation-delay-400">
            <div className="relative w-full aspect-[3.75/3] rounded-[3rem] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl shadow-2xl overflow-hidden border-8 border-white p-6 border-opacity-70 z-10 glass">

              <div className="w-full h-full flex flex-col gap-4 opacity-90">
                {/* Mock Header */}
                <div className="w-full h-20 bg-white rounded-2xl shadow-sm animate-pulse-slow p-4 flex gap-4 items-center border border-emerald-50">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-emerald-100 rounded-full w-3/4"></div>
                    <div className="h-2 bg-emerald-50 rounded-full w-1/2"></div>
                  </div>
                </div>
                {/* Mock Chart/Stats */}
                <div className="flex gap-4 h-24">
                  <div className="flex-1 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-md p-4 flex flex-col justify-end">
                    <div className="h-2 w-1/2 bg-white/40 rounded-full mb-2"></div>
                    <div className="h-3 w-3/4 bg-white/80 rounded-full"></div>
                  </div>
                  <div className="w-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl shadow-md"></div>
                </div>
                {/* Mock List */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm animate-pulse-slow border border-emerald-50 p-5 space-y-3">
                  <div className="h-2 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                  <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-8 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float z-20 border border-emerald-50">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black text-lg">250+</div>
              <div>
                <div className="text-sm font-bold text-gray-800 leading-tight">Nepali<br />Foods</div>
              </div>
            </div>

            <div className="absolute -bottom-8 right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float animation-delay-500 z-20 border border-emerald-50">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center font-black text-sm">NPR</div>
              <div>
                <div className="text-sm font-bold text-gray-800 leading-tight">Budget<br />Friendly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float z-20">
          <ChevronDown size={28} className="text-emerald-900/30" />
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
