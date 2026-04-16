import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faMinus, 
  faPlus, 
  faShippingFast, 
  faShoppingCart,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) navigate('/login');
    else navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm animate-fade-up">
          <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FontAwesomeIcon icon={faShoppingCart} className="text-primary text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2 font-outfit uppercase tracking-tight">Your cart is empty</h2>
          <p className="text-xs text-gray-400 mb-8 leading-relaxed">Looks like you haven't added anything to your cart yet. Why not explore our signature dishes?</p>
          <Link to="/menu" className="btn-primary w-full h-11">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-padding">
        <div className="mb-8">
          <Link to="/menu" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-4 transition-colors uppercase tracking-widest gap-2 group">
            <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 font-outfit tracking-tight uppercase">Shopping Cart</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest leading-none">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 hover:bg-gray-50/30 transition-colors">
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-50 bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-neutral-900 truncate uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Rs. {item.price}</p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3 border border-gray-100 rounded-lg p-1 bg-white">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-400 hover:text-primary transition-all text-[10px]"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="text-xs font-bold w-4 text-center text-neutral-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-400 hover:text-primary transition-all text-[10px]"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                    <p className="text-sm font-bold text-neutral-900">Rs. {(item.price * item.quantity).toFixed(0)}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="px-4 py-2 border border-dashed border-gray-200 rounded-lg text-[10px] text-gray-400 hover:text-red-400 hover:border-red-100 font-bold uppercase tracking-widest transition-all"
            >
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20 shadow-sm">
            <h2 className="text-xs font-bold text-neutral-900 mb-5 uppercase tracking-widest border-b border-gray-50 pb-3">Checkout Details</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Subtotal</span>
                <span className="font-bold text-neutral-900">Rs. {getTotal().toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Delivery</span>
                <span className="text-accent font-bold">FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-900 uppercase">Grand Total</span>
                <span className="text-xl font-extrabold text-neutral-900 font-outfit leading-none">Rs. {getTotal().toFixed(0)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full h-11 mb-3 shadow-lg shadow-primary/10">
              Complete Order
            </button>
            <Link to="/menu" className="block text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
              Add more items
            </Link>

            <div className="mt-6 flex items-start gap-2.5 text-[10px] text-gray-400 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <FontAwesomeIcon icon={faShippingFast} className="text-primary mt-0.5" size="lg" />
              <p className="leading-relaxed">Usually delivered within <span className="text-neutral-900 font-bold">25–35 minutes</span> across Lahore.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
