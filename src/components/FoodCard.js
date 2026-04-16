import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const FoodCard = ({ food }) => {
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(food);
    toast.success('Added to cart!');
  };

  const handleCardClick = () => navigate(`/food/${food._id}`);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer group hover:border-gray-200 transition-all duration-200"
      role="button"
      tabIndex={0}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={food.name || 'Food item'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-neutral-900 px-3 py-1 rounded-lg text-[10px] font-bold">Sold Out</span>
          </div>
        )}

      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2">
        <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors font-outfit uppercase tracking-tight">
          {food.name}
        </h3>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {food.description || 'Authentic Pakistani flavor prepared with fresh ingredients and traditional spices.'}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-extrabold text-neutral-900 font-outfit">
            Rs. {food.price}
          </span>
          {food.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="w-7 h-7 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90"
              title="Add to cart"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
