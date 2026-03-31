import Layout from '../components/layout/Layout';
import { Brain, Database, Code2, Target, Users, Cpu } from 'lucide-react';

const techStack = [
  { name: 'Django',       role: 'Backend Framework',  color: 'bg-emerald-100 text-emerald-700',   desc: 'REST API with session-based authentication, ORM, and admin panel.' },
  { name: 'React 19',     role: 'Frontend Framework',  color: 'bg-emerald-100 text-emerald-700',    desc: 'Modern React with hooks, context API, and React Router for SPAs.' },
  { name: 'PostgreSQL',   role: 'Database',            color: 'bg-emerald-100 text-emerald-700',desc: 'Robust relational database storing users, profiles, and food data.' },
  { name: 'K-Means',      role: 'Clustering Algorithm',color: 'bg-emerald-100 text-emerald-700',desc: 'Groups users by age, BMI, activity, and goal into 5 distinct clusters.' },
  { name: 'Cosine Sim.',  role: 'Recommendation',      color: 'bg-emerald-100 text-emerald-700',  desc: 'Content-based filtering that scores food compatibility per user.' },
  { name: 'Tailwind CSS', role: 'Styling',             color: 'bg-emerald-100 text-emerald-700',    desc: 'Utility-first CSS framework for rapid, responsive UI development.' },
  { name: 'Recharts',     role: 'Data Visualization',  color: 'bg-emerald-100 text-emerald-700',    desc: 'Responsive charts for macro distributions and calorie tracking.' },
  { name: 'scikit-learn', role: 'ML Library',          color: 'bg-emerald-100 text-emerald-700',desc: 'Python library powering the K-Means clustering and data preprocessing.' },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-emerald-200 text-sm mb-6">
            <Brain size={14} /> AI-Powered System
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">About NutriFit</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            A Final Year Project at the intersection of artificial intelligence, 
            nutrition science, and cultural authenticity.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Mission */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target size={20} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Our Mission</h2>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-8">
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              Nepal has a rich culinary tradition that's deeply intertwined with health, culture,
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
        </section>

        {/* How the AI Works */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Cpu size={20} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">How the AI Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users size={18} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Phase 1: K-Means Clustering</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                When you register, the system extracts your features — BMI, age, activity level, 
                daily calorie needs, and goals — and places you into one of 5 user clusters. 
                Each cluster represents a distinct health and lifestyle archetype 
                (e.g., Active Young Adult, Senior Sedentary, Weight Management).
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Brain size={18} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Phase 2: Content-Based Filtering</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Using cosine similarity, NutriFit scores every food item against your nutritional 
                profile and cluster characteristics. It selects the top-matching foods for 
                breakfast, lunch, and dinner — respecting vegetarian preferences, 
                diabetes status, GI thresholds, and budget limits.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Code2 size={20} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Technology Stack</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map(({ name, role, color, desc }) => (
              <div
                key={name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg mb-3 ${color}`}>
                  {role}
                </span>
                <h4 className="font-bold text-gray-800 mb-1">{name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">The Food Database</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              Our database contains <strong>250+ Nepali food items</strong> spanning 10 categories, 
              each with detailed nutritional data including calories, protein, carbohydrates, fat, 
              glycemic index, vegetarian status, diabetes friendliness, meal suitability, and average 
              price in NPR.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['Complete Meals', 'Grains', 'Legumes', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Snacks', 'Beverages', 'Desserts'].map((cat) => (
                <span key={cat} className="text-center text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-xl py-2 px-3">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Developer */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-extrabold mb-2">The Developer</h2>
          <p className="text-gray-300 mb-6">
            NutriFit was designed and built as a Final Year Project for the 
            Bachelor of Information Technology (BIT) program.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold">
              P
            </div>
            <div>
              <p className="font-bold text-lg">Paban Bhandari</p>
              <p className="text-emerald-300 text-sm">BIT Student · Full Stack Developer</p>
              <p className="text-gray-400 text-sm mt-1">Django · React · Machine Learning · PostgreSQL</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
