import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PageLoading } from './components/common/Loading';

// Lazy-loaded pages for code splitting
const Home      = lazy(() => import('./pages/Home'));
const About     = lazy(() => import('./pages/About'));
const Login     = lazy(() => import('./pages/Login'));
const Register  = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Foods     = lazy(() => import('./pages/Foods'));

// ── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoading message="Verifying session…" />;
  return user ? children : <Navigate to="/login" replace />;
};

// ── Public Route (redirect logged-in users away from login/register) ─────────
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoading />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ── App Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Suspense fallback={<PageLoading />}>
    <Routes>
      <Route path="/"         element={<Home />} />
      <Route path="/about"    element={<About />} />
      <Route path="/foods"    element={<Foods />} />

      <Route path="/login"    element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      {/* Catch-all → Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

// ── Root App ──────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
