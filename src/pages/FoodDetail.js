import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { foodAPI, reviewAPI } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMinus, 
  faPlus, 
  faClock, 
  faCheckCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const FoodDetail = () => {
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFood();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getByFood(id);
      setReviews(res.data.reviews || []);
    } catch { /* ignore */ }
  };

  const fetchFood = async () => {
    try {
      const res = await foodAPI.getById(id);
      setFood(res.data.food);
    } catch {
      toast.error('Failed to load details');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please login first');
      navigate('/login');
      return;
    }
    addToCart(food, quantity);
    toast.success('Added to cart!');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!food) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation */}
        <Link to="/menu" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-6 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50 lg:flex items-stretch">
          
          {/* Image Sidebar */}
          <div className="lg:w-[45%] relative bg-gray-50 border-r border-gray-50 overflow-hidden">
            <img
              src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'}
              alt={food.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            {!food.isAvailable && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white text-neutral-900 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">Available soon</span>
              </div>
            )}
            <div className="absolute top-6 left-6">
               <span className="bg-white/95 text-neutral-900 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border border-gray-100 shadow-xl shadow-black/5 flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-secondary text-[9px]" /> {food.rating || 4.5}
               </span>
            </div>
          </div>

          {/* Info Details */}
          <div className="lg:w-[55%] p-8 lg:p-14 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.25em]">{food.category?.name || 'SmartBite Original'}</span>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 font-outfit mt-3 tracking-tight leading-tight uppercase">
                  {food.name}
                </h1>
              </div>
              
              <div className="flex items-center gap-8 py-5 border-y border-gray-50 group">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Wait</p>
                    <p className="text-xs font-bold text-neutral-900">{food.preparationTime || 25} Mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                   <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-xs font-bold text-neutral-900">Hygenic Prep</p>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                {food.description || 'Crafted with premium ingredients and our signature secret sauces. Every bite is designed to deliver a burst of flavor and a satisfying crunch.'}
              </p>
            </div>

            {food.isAvailable && (
              <div className="space-y-6 pt-10">
                <div className="flex items-center justify-between gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm">
                    <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90 text-[11px]">
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold text-neutral-900 font-outfit">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-primary transition-all active:scale-90 text-[11px]">
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1.5 leading-none">Price per deal</p>
                    <p className="text-2xl font-extrabold text-neutral-900 font-outfit leading-none italic">Rs. {(food.price * quantity).toFixed(0)}</p>
                  </div>
                </div>

                <button onClick={handleAddToCart} className="btn-primary w-full py-5 text-[11px] font-extrabold tracking-widest uppercase shadow-2xl shadow-primary/20 active:scale-95 transition-all">
                   Deliver Now — Rs. {(food.price * quantity).toFixed(0)}
                </button>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FoodDetail;
