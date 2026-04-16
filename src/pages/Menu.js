import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { foodAPI, categoryAPI } from '../utils/api';
import FoodCard from '../components/FoodCard';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH, faUtensils } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCategories();
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.categories);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const res = await foodAPI.getAll(params);
      setFoods(res.data.foods);
    } catch {
      toast.error('Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Daily Menu</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">Handmade flavors delivered across Lahore</p>
        </header>

        {/* Search and Filters Strip */}
        <div className="flex flex-col md:flex-row gap-3 mb-10 items-center">
          <div className="flex-1 relative w-full">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            <input
              type="text"
              placeholder="Search for Karahi, Biryani, Burgers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11 h-12 shadow-sm border-gray-100"
            />
          </div>

          <div className="w-full md:w-64 relative">
             <FontAwesomeIcon icon={faSlidersH} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
             <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-11 h-12 font-bold text-xs uppercase tracking-widest cursor-pointer appearance-none shadow-sm border-gray-100"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Item Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : foods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-up">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto p-10">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <FontAwesomeIcon icon={faUtensils} className="text-gray-200 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2 font-outfit uppercase tracking-tight">No Results Found</h3>
            <p className="text-xs text-gray-400 mb-8 leading-relaxed">We couldn't find any dishes matching your search. Try adjusting your filters or search keywords.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('')}}
              className="btn-outline h-11 px-8 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 mx-auto"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
