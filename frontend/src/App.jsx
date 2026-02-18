import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />

        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Placeholder Components (to avoid errors until real pages are built)
const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-4">
      Welcome to NutriFit
    </h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Your personalized AI-powered nutrition assistant. tailored meal plans, smart tracking, and healthier living.
    </p>
  </div>
);

const About = () => <div className="text-center text-2xl font-semibold text-gray-700">About Us Page</div>;
const Dashboard = () => <div className="text-center text-2xl font-semibold text-gray-700">My Dashboard</div>;
const Login = () => <div className="text-center text-2xl font-semibold text-gray-700">Login Page</div>;
const Register = () => <div className="text-center text-2xl font-semibold text-gray-700">Register Page</div>;

export default App;
