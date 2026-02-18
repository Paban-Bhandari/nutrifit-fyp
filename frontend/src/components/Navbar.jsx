import { useState } from 'react';
import { Menu, X, Home, Info, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                            NutriFit
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" icon={<Home size={18} />} text="Home" />
                        <NavLink to="/about" icon={<Info size={18} />} text="About" />
                        <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} text="My Dashboard" />

                        <div className="flex items-center space-x-4 ml-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
                            >
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-green-600 focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <MobileNavLink to="/" text="Home" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/about" text="About" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/dashboard" text="My Dashboard" onClick={() => setIsOpen(false)} />

                        <div className="pt-4 flex flex-col space-y-3">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center text-gray-600 hover:text-green-600 font-medium py-2 border border-gray-200 rounded-lg"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center bg-green-600 text-white font-medium py-2 rounded-lg shadow-md"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Helper Components
const NavLink = ({ to, icon, text }) => (
    <Link
        to={to}
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors group"
    >
        <span className="group-hover:scale-110 transition-transform">{icon}</span>
        {text}
    </Link>
);

const MobileNavLink = ({ to, text, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
    >
        {text}
    </Link>
);

export default Navbar;
