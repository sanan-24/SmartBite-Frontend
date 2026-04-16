import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillWave, faTruck, faShieldAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import PaymentForm from '../components/PaymentForm';

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: '', postalCode: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  
  const { cartItems, getTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data } = await paymentAPI.getApiKey();
        setStripePromise(loadStripe(data.stripeApiKey));
      } catch (error) {
        console.error("Failed to load Stripe API Key", error);
      }
    };
    fetchApiKey();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const createOrder = async (paymentInfo = {}) => {
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          food: item._id, name: item.name, quantity: item.quantity,
          price: item.price, image: item.image
        })),
        shippingAddress: {
          name: formData.name, phone: formData.phone,
          address: formData.address, city: formData.city, postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: getTotal(),
        paymentInfo: {
            id: paymentInfo.id || 'cod',
            status: paymentInfo.status || 'pending'
        }
      };
      
      const response = await orderAPI.create(orderData);
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/orders/${response.data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'Card') return; // Handled by PaymentForm
    
    setLoading(true);
    await createOrder();
    setLoading(false);
  };

  const onPaymentSuccess = async (paymentId) => {
    setLoading(true);
    await createOrder({ id: paymentId, status: 'succeeded' });
    setLoading(false);
  };

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/cart" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-4 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 font-outfit mb-8 tracking-tight uppercase">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">

              {/* Delivery Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-[10px] font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">
                  Delivery Details
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Recipient Name</label>
                      <input type="text" name="name" value={formData.name}
                        onChange={handleChange} required className="input-field" placeholder="e.g. Ahmed Ali" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone}
                        onChange={handleChange} required className="input-field" placeholder="03xx-xxxxxxx" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Exact Location</label>
                    <textarea name="address" rows="2" value={formData.address}
                      onChange={handleChange} required className="input-field resize-none"
                      placeholder="House #, Street, Block, Near Landmark..." />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>City</label>
                      <input type="text" name="city" value={formData.city}
                        onChange={handleChange} required className="input-field" placeholder="Lahore, Karachi..." />
                    </div>
                    <div>
                      <label className={labelCls}>Postal Area (optional)</label>
                      <input type="text" name="postalCode" value={formData.postalCode}
                        onChange={handleChange} className="input-field" placeholder="54000" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-[10px] font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">
                  Select Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: faMoneyBillWave },
                    { id: 'Card',             label: 'Debit / Credit',   icon: faCreditCard },
                    { id: 'Online',           label: 'EasyPaisa',        icon: faTruck },
                  ].map((m) => (
                    <button
                      key={m.id} type="button"
                      disabled={loading}
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group ${
                        formData.paymentMethod === m.id
                          ? 'border-primary bg-red-50/50 text-neutral-900'
                          : 'border-gray-50 bg-gray-50/30 text-gray-400 hover:border-gray-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={m.icon} className={`text-lg mb-2 ${formData.paymentMethod === m.id ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Stripe Form Integration */}
                {(formData.paymentMethod === 'Card' && stripePromise) ? (
                   <Elements stripe={stripePromise}>
                      <PaymentForm 
                        amount={getTotal()} 
                        onSuccess={onPaymentSuccess}
                        onCancel={() => setFormData({...formData, paymentMethod: 'Cash on Delivery'})}
                      />
                   </Elements>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.name || !formData.address || !formData.phone} 
                    className="btn-primary w-full h-12 disabled:opacity-60 shadow-lg shadow-primary/20"
                  >
                    {loading
                      ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : formData.paymentMethod === 'Cash on Delivery' ? 'Process Order (COD)' : 'Confirm Payment'
                    }
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6 sticky top-20">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-[10px] font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">
                Items in Cart
              </h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-50 bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-neutral-900 truncate uppercase tracking-tight">{item.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-neutral-900 flex-shrink-0">
                      Rs. {(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-5 space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span><span>Rs. {getTotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-accent uppercase tracking-widest">
                  <span>Shipping</span><span>FREE</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-neutral-900 uppercase">Grand Total</span>
                  <span className="text-2xl font-extrabold text-neutral-900 font-outfit">Rs. {getTotal().toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 bg-gray-900 rounded-xl p-4 text-white">
                <FontAwesomeIcon icon={faShieldAlt} className="text-primary mt-1" />
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                  Your transaction is secure. No sensitive and personal data is shared.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
