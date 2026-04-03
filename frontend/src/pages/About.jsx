import Layout from '../components/layout/Layout';
import { Brain, Database, Code2, Target, Users, Cpu, UtensilsCrossed, ShieldCheck, Coins } from 'lucide-react';

const techStack = [
  { name: 'Django',       role: 'Backend Framework',    color: 'bg-emerald-100 text-emerald-700', desc: 'REST API with session-based authentication, ORM, and admin panel.' },
  { name: 'React 19',     role: 'Frontend Framework',   color: 'bg-sky-100 text-sky-700',         desc: 'Modern React with hooks, context API, and React Router for SPAs.' },
  { name: 'PostgreSQL',   role: 'Database',             color: 'bg-blue-100 text-blue-700',       desc: 'Robust relational database storing users, profiles, and food data.' },
  { name: 'K-Means',      role: 'Clustering',           color: 'bg-purple-100 text-purple-700',   desc: 'Groups users by age, BMI, activity, and goal into 5 distinct clusters.' },
  { name: 'Cosine Sim.',  role: 'Recommendation',       color: 'bg-pink-100 text-pink-700',       desc: 'Content-based filtering that scores food compatibility per user.' },
  { name: 'Tailwind CSS', role: 'Styling',              color: 'bg-cyan-100 text-cyan-700',       desc: 'Utility-first CSS framework for rapid, responsive UI development.' },
  { name: 'Recharts',     role: 'Data Visualization',   color: 'bg-amber-100 text-amber-700',     desc: 'Responsive charts for macro distributions and calorie tracking.' },
  { name: 'scikit-learn', role: 'ML Library',           color: 'bg-orange-100 text-orange-700',   desc: 'Python library powering the K-Means clustering and data preprocessing.' },
];

const categories = ['Complete Meals', 'Grains', 'Legumes', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Snacks', 'Beverages', 'Desserts'];

const About = () => {
  return (
    <Layout>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="gradient-hero py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-emerald-200 text-sm mb-8 shadow-lg backdrop-blur-sm">
            <Brain size={14} /> AI-Powered Nutrition System
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
            About NutriFit
          </h1>
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            An innovative platform at the intersection of artificial intelligence,
            nutrition science, and cultural authenticity — built for Nepal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">

        {/* ── Mission ─────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: text */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                <Target size={22} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-5">
              Nepal has a rich culinary tradition deeply intertwined with health, culture,
              and community. Yet most digital nutrition tools are designed around Western diets,
              ignoring the nutritional wealth of Nepali staples like Dal Bhat, Gundruk, Dhido,
              and Sel Roti.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-emerald-700">NutriFit</strong> bridges this gap — providing
              AI-driven meal recommendations built specifically for Nepali foods,
              taking into account individual health goals, budget constraints, dietary preferences,
              and medical conditions like diabetes.
            </p>
          </div>

          {/* Right: highlight stats - all white */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: UtensilsCrossed, label: '250+ Foods',     sub: 'Authentic Nepali food items in our database' },
              { icon: Brain,           label: 'AI Powered',     sub: 'K-Means + cosine similarity engine' },
              { icon: ShieldCheck,     label: 'Diabetes Aware', sub: 'GI-based priority filtering for health needs' },
              { icon: Coins,           label: 'Budget Smart',   sub: 'NPR-based budget-friendly meal planning' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 text-lg">{label}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-snug">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How the AI Works ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
              <Cpu size={22} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">How the AI Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                  <Users size={20} className="text-purple-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">K-Means Clustering</h3>
              </div>
              <p className="text-gray-500 leading-relaxed">
                When you register, the system extracts your features — BMI, age, activity level,
                daily calorie needs, and goals — and places you into one of 5 user clusters.
                Each cluster represents a distinct health and lifestyle archetype
                (e.g., Active Young Adult, Senior Sedentary, Weight Management).
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                  <Brain size={20} className="text-blue-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Content-Based Filtering</h3>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Using cosine similarity, NutriFit scores every food item against your nutritional
                profile and cluster characteristics. It selects the top-matching foods for
                breakfast, lunch, and dinner — respecting vegetarian preferences,
                diabetes status, GI thresholds, and budget limits.
              </p>
            </div>
          </div>
        </section>

        {/* ── Technology Stack ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
              <Code2 size={22} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Technology Stack</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack.map(({ name, role, color, desc }) => (
              <div
                key={name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg mb-4 ${color}`}>
                  {role}
                </span>
                <h4 className="font-bold text-gray-800 mb-2">{name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Food Database ─────────────────────────────────────────────────  */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <Database size={22} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">The Food Database</h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Our database contains <strong className="text-gray-900">250+ Nepali food items</strong> spanning 10 categories,
              each with detailed nutritional data including calories, protein, carbohydrates, fat,
              glycemic index, vegetarian status, diabetes friendliness, meal suitability, and
              average price in NPR.
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">10 Food Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default About;
