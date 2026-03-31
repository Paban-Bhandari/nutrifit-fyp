import { Link } from 'react-router-dom';
import { Leaf, Github, Heart, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">NutriFit</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered personalized Nepali diet recommendation system. 
              Healthy, budget-friendly meal plans tailored just for you.
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Made with</span>
              <Heart size={12} className="text-red-400 fill-red-400" />
              <span>in Nepal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/',          label: 'Home' },
                { to: '/about',     label: 'About' },
                { to: '/foods',     label: 'Food Database' },
                { to: '/register',  label: 'Get Started' },
                { to: '/login',     label: 'Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['Django', 'React', 'PostgreSQL', 'K-Means', 'Tailwind CSS', 'Recharts'].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="pt-2">
              <a
                href="mailto:nutrifit@example.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Mail size={14} /> nutrifit@example.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} NutriFit. Final Year Project — BIT Program.
          </p>
          <p className="text-xs text-gray-500">
            Powered by K-Means Clustering & Cosine Similarity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
