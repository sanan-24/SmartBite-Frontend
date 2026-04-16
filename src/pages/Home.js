import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI, categoryAPI } from '../utils/api';
import FoodCard from '../components/FoodCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils, 
  faShippingFast, 
  faCreditCard, 
  faStar,
  faArrowRight, 
  faFire, 
  faSearch,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredFoods,  setFeaturedFoods]  = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [pizzaFoods,     setPizzaFoods]     = useState([]);
  const [burgerFoods,    setBurgerFoods]    = useState([]);
  const [shawarmaFoods,  setShawarmaFoods]  = useState([]);
  const [friesFoods,     setFriesFoods]     = useState([]);
  const [otherFoods,     setOtherFoods]     = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [foodsRes, catsRes] = await Promise.all([foodAPI.getAll(), categoryAPI.getAll()]);
      const all = foodsRes.data.foods;

      setFeaturedFoods(all.slice(0, 6));
      setCategories(catsRes.data.categories);

      const match = (f, kw) => f.category?.name?.toLowerCase().includes(kw);
      setPizzaFoods(   all.filter(f => match(f, 'pizza')).slice(0, 6));
      setBurgerFoods(  all.filter(f => match(f, 'burger')).slice(0, 6));
      setShawarmaFoods(all.filter(f => match(f, 'shawarma')).slice(0, 6));
      setFriesFoods(   all.filter(f => match(f, 'fries')).slice(0, 6));
      setOtherFoods(   all.filter(f =>
        !match(f,'pizza') && !match(f,'burger') && !match(f,'shawarma') && !match(f,'fries')
      ).slice(0, 6));
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Small reusable food section ── */
  const FoodSection = ({ title, icon, foods, categoryName, alt }) => (
    <section className={alt ? 'bg-white py-8 border-t border-gray-100' : 'bg-gray-50 py-8 border-t border-gray-100'}>
      <div className="section-padding">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-neutral-900 font-outfit">
            {title}
          </h2>
          {foods.length > 0 && (
            <Link to={`/menu?search=${categoryName}`} className="text-[11px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5 hover:underline">
              View all <FontAwesomeIcon icon={faArrowRight} size="xs" />
            </Link>
          )}
        </div>
        {foods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map(food => <FoodCard key={food._id} food={food} />)}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-xs text-center">No {title.toLowerCase()} available right now</p>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div>

      {/* ─────────────────────────────────────
          HERO — SmartBitebranding
      ───────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Copy */}
            <div className="space-y-5 animate-fade-up">
              <span className="text-[10px] font-bold text-primary bg-red-50 border border-red-100 px-3 py-1 rounded-md inline-block uppercase tracking-widest">
                🚚 Free delivery on first 3 orders
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 leading-[1.15] font-outfit">
                Lahore's Finest <br />
                <span className="text-primary">Fast Food.</span>
              </h1>

              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                Experience the ultimate crunch and flavor of our gourmet Burgers, loaded Pizzas, and crispy Shawarmas. 
                Order from <span className="font-bold text-neutral-700">SmartBite</span> and enjoy hot, fresh meals in 30 minutes.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/menu" className="btn-primary px-8 h-11">
                  Order Now
                </Link>
                <Link to="/menu" className="btn-outline px-8 h-11 hover:bg-gray-50">
                  Browse Menu
                </Link>
              </div>

              {/* Quick Trust badges */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faShippingFast} size="sm" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-900 leading-none">FASTER</p>
                    <p className="text-[9px] text-gray-400">30 Mins Delivery</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faClock} size="sm" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-900 leading-none">HOT</p>
                    <p className="text-[9px] text-gray-400">Stays fresh</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faCreditCard} size="sm" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-900 leading-none">SECURE</p>
                    <p className="text-[9px] text-gray-400">Easy Payment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block relative animate-scale-in">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80"
                alt="Gourmet Fast Food"
                className="w-full h-[420px] object-cover rounded-2xl border border-gray-100 shadow-xl relative z-10"
              />
              {/* Review highlight */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur border border-gray-100 rounded-xl px-4 py-3 shadow-lg z-20 animate-fade-up">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-secondary text-[10px]">
                    {[...Array(5)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} />)}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-700">4.9/5</span>
                </div>
                <p className="text-[11px] font-medium text-gray-500 italic">"Best burgers in town!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────
          SIGNATURE DISHES
      ───────────────────────────────────── */}
      <section className="bg-gray-50 py-10 border-t border-gray-100">
        <div className="section-padding">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Recommended for you</p>
              <h2 className="text-base font-bold text-neutral-900 font-outfit">Signature Dishes</h2>
            </div>
            <Link to="/menu" className="btn-outline px-4 py-1.5 h-8 text-[11px]">
              Full menu
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredFoods.map(food => <FoodCard key={food._id} food={food} />)}
          </div>
        </div>
      </section>

      {/* Specialty Sections */}
      {pizzaFoods.length    > 0 && <FoodSection title="Classic Pizza"    icon={faUtensils} foods={pizzaFoods}    categoryName="pizza"    alt={true} />}
      {burgerFoods.length   > 0 && <FoodSection title="Juicy Burgers"   icon={faUtensils} foods={burgerFoods}   categoryName="burger"   alt={false} />}
      {shawarmaFoods.length > 0 && <FoodSection title="Spicy Shawarma" icon={faFire}     foods={shawarmaFoods} categoryName="shawarma" alt={true}  />}
      
      {/* ─────────────────────────────────────
          BOTTOM CTA
      ───────────────────────────────────── */}
      <section className="bg-primary/95 py-12 text-white text-center mt-10">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-outfit mb-3">Order Your Favorite Dish Today</h2>
          <p className="text-red-100 text-sm mb-8 leading-relaxed">
            Freshly prepared food from Pakistan's best kitchens. 
            Fast delivery, secure payments, and unbeatable taste.
          </p>
          <div className="flex justify-center">
            <Link to="/menu" className="bg-white text-primary px-10 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-50 transition-all active:scale-95">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
