import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/common/AlertMessage';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Layout from '../components/layout/Layout';

const Login = () => {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.username.trim(), form.password);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Invalid username or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100/30 px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Card Top Gradient */}
            <div className="gradient-hero px-8 pt-10 pb-8 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
              <p className="text-emerald-200 text-sm mt-1">Sign in to your NutriFit account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              {error && (
                <ErrorMessage message={error} onDismiss={() => setError('')} />
              )}

              <Input
                id="username"
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                icon={User}
                required
                autoComplete="username"
                autoFocus
              />

              {/* Password with toggle */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all hover:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                id="login-submit-btn"
              >
                Sign In <ArrowRight size={18} />
              </Button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                  Create one free
                </Link>
              </p>
            </form>
          </div>

          {/* Demo hint */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Need an account? Registration takes less than 2 minutes.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
