import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Home, Info, LayoutDashboard,
  UtensilsCrossed, LogOut, User, ChevronDown,
  Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const { user, profile, logout }  = useAuth();
  const navigate                   = useNavigate();
  const location                   = useLocation();

  const handleLogout = async () => {
    await logout();
    setDropdown(false);
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* ── Logo ─────────────────── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NutriFit</span>
          </Link>

          {/* ── Desktop Menu ─────────── */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/"       icon={<Home size={16}/>}            label="Home"      active={isActive('/')} />
            <NavLink to="/about"  icon={<Info size={16}/>}            label="About"     active={isActive('/about')} />
            <NavLink to="/foods"  icon={<UtensilsCrossed size={16}/>} label="Foods"     active={isActive('/foods')} />
            {user && (
              <NavLink to="/dashboard" icon={<LayoutDashboard size={16}/>} label="Dashboard" active={isActive('/dashboard')} />
            )}
          </div>

          {/* ── Auth section ─────────── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.first_name?.[0] || user.username?.[0] || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-none">
                      {user.first_name || user.username}
                    </p>
                    {profile && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {profile.bmi_category}
                      </p>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors px-3 py-2 rounded-xl hover:bg-emerald-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ─────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ───────────── */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <MobileNavLink to="/"         label="Home"           onClick={() => setIsOpen(false)} active={isActive('/')} />
            <MobileNavLink to="/about"    label="About"          onClick={() => setIsOpen(false)} active={isActive('/about')} />
            <MobileNavLink to="/foods"    label="Foods"          onClick={() => setIsOpen(false)} active={isActive('/foods')} />
            {user && (
              <MobileNavLink to="/dashboard" label="Dashboard"   onClick={() => setIsOpen(false)} active={isActive('/dashboard')} />
            )}

            <div className="pt-3 border-t border-gray-100 mt-3 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.first_name?.[0] || user.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{user.first_name || user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl shadow hover:bg-emerald-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
      active
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
    }`}
  >
    <span>{icon}</span>
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      active
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
