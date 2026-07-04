import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, Leaf, Droplets } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import { SectionLoading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/AlertMessage';
import { getGiColor, getGiLabel, categoryColor, categoryLabel, formatCurrency } from '../utils/helpers';

const CATEGORIES = ['', 'MEAL', 'GRAIN', 'LEGUME', 'VEGETABLE', 'FRUIT', 'MEAT', 'DAIRY', 'SNACK', 'BEVERAGE', 'DESSERT'];

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [vegetarian, setVegetarian] = useState('');
  const [diabetic, setDiabetic] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef(null);

  const fetchFoods = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.category) query.set('category', params.category);
      if (params.vegetarian) query.set('vegetarian', params.vegetarian);
      if (params.diabetic) query.set('diabetes_friendly', params.diabetic);
      if (params.maxPrice) query.set('max_price', params.maxPrice);

      const { data } = await api.get(`/api/foods/?${query}`);
      setFoods(data);
    } catch {
      setError('Failed to load foods. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats once
  useEffect(() => {
    api.get('/foods/stats/').then(({ data }) => setStats(data)).catch(() => { });
  }, []);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchFoods({ search, category, vegetarian, diabetic, maxPrice });
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, category, vegetarian, diabetic, maxPrice, fetchFoods]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setVegetarian('');
    setDiabetic('');
    setMaxPrice('');
  };

  const hasFilters = search || category || vegetarian || diabetic || maxPrice;

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2"> Nepali Food Database</h1>
          <p className="text-emerald-200 max-w-xl mx-auto">
            Browse authentic Nepali foods with complete nutritional information.
          </p>
          {stats && (
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <StatPill label={`${stats.vegetarian} Vegetarian`} color="bg-emerald-500/30" />
              <StatPill label={`${stats.non_vegetarian} Non-Veg`} color="bg-emerald-500/30" />
              <StatPill label={`${stats.diabetes_friendly} Diabetes-Friendly`} color="bg-emerald-500/30" />
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="food-search"
              type="text"
              placeholder="Search foods… (e.g., Dal Bhat, Momo, Kheer)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>
          <button
            id="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
              }`}
          >
            <Filter size={15} />
            Filters {hasFilters && <span className="w-2 h-2 bg-amber-400 rounded-full" />}
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-red-500 hover:border-red-200 bg-white transition-all"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Category</label>
              <select
                id="filter-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c ? categoryLabel(c) : 'All Categories'}</option>
                ))}
              </select>
            </div>

            {/* Vegetarian */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Diet Type</label>
              <select
                id="filter-vegetarian"
                value={vegetarian}
                onChange={(e) => setVegetarian(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">All</option>
                <option value="true">Vegetarian</option>
                <option value="false">Non-Vegetarian</option>
              </select>
            </div>

            {/* Diabetes-friendly */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Health</label>
              <select
                id="filter-diabetes"
                value={diabetic}
                onChange={(e) => setDiabetic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">All</option>
                <option value="true">Diabetes-Friendly</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Max Price (NPR)</label>
              <input
                id="filter-max-price"
                type="number"
                placeholder="e.g., 200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-5">
            Showing <strong className="text-gray-700">{foods.length}</strong> food items
            {hasFilters && ' (filtered)'}
          </p>
        )}

        {/* Error */}
        {error && <ErrorMessage message={error} className="mb-5" />}

        {/* Loading */}
        {loading && <SectionLoading message="Loading foods…" />}

        {/* Grid */}
        {!loading && foods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && foods.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No foods found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="text-emerald-600 font-semibold hover:underline text-sm">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

const FoodCard = ({ food }) => {
  const gi = food.gi_category || 'LOW';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Header strip */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">
            {food.food_name}
          </h3>
          <span className="text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 bg-gray-50 text-gray-600 border border-gray-100">
            {categoryLabel(food.category)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${getGiColor(gi)}`}>
            {getGiLabel(gi)} ({food.glycemic_index})
          </span>
          {food.is_vegetarian && (
            <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium">
              Veg
            </span>
          )}
          {food.is_diabetes_friendly && (
            <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 font-medium">
              Diabetic
            </span>
          )}
        </div>
      </div>

      {/* Nutrition grid */}
      <div className="px-4 py-3 grid grid-cols-4 gap-2 text-center">
        <NutriCell label="Cal" value={Math.round(parseFloat(food.calories))} unit="kcal" color="text-gray-900" />
        <NutriCell label="Protein" value={parseFloat(food.protein).toFixed(1)} unit="g" color="text-gray-900" />
        <NutriCell label="Carbs" value={parseFloat(food.carbohydrates).toFixed(1)} unit="g" color="text-gray-900" />
        <NutriCell label="Fat" value={parseFloat(food.fat).toFixed(1)} unit="g" color="text-gray-900" />
      </div>

      {/* Price */}
      <div className="px-4 pb-4">
        <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">Avg. price</span>
          <span className="text-sm font-bold text-gray-700">{formatCurrency(food.average_price)}</span>
        </div>
      </div>
    </div>
  );
};

const NutriCell = ({ label, value, unit, color }) => (
  <div>
    <p className={`text-base font-extrabold ${color}`}>{value}</p>
    <p className="text-xs text-gray-400 leading-tight">{unit}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

const StatPill = ({ label, color }) => (
  <span className={`text-xs text-white font-medium px-3 py-1.5 rounded-full ${color} border border-white/20`}>
    {label}
  </span>
);

export default Foods;
