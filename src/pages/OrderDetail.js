import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI, reviewAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faClock, 
  faTruck, 
  faBox, 
  faStar,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const statusClass = (status) => ({
  'Pending':         'badge-pending',
  'Preparing':       'badge-preparing',
  'Out for Delivery':'badge-delivery',
  'Delivered':       'badge-success',
  'Cancelled':       'badge-danger',
}[status] || 'bg-gray-100 text-gray-500 border border-gray-200');

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [myReviews, setMyReviews] = useState([]);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data.order);
    } catch {
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const res = await reviewAPI.getMyReviews();
      setMyReviews(res.data.reviews || []);
    } catch { /* ignore */ }
  };

  useEffect(() => { if (order) fetchMyReviews(); }, [order]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.create({ orderId: order._id, rating: Number(review.rating), comment: review.comment });
      toast.success('Review submitted!');
      setShowReviewForm(false);
      setReview({ rating: 5, comment: '' });
      fetchMyReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  const steps = [
    { status: 'Pending', icon: faClock, label: 'Placed' },
    { status: 'Preparing', icon: faBox, label: 'Kitchen' },
    { status: 'Out for Delivery', icon: faTruck, label: 'Delivery' },
    { status: 'Delivered', icon: faCheckCircle, label: 'Done' }
  ];
  const curIdx = steps.findIndex(s => s.status === order.orderStatus);
  const myReview = myReviews.find(r => String(r.order?._id || r.order) === String(order._id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link to={user?.role === 'admin' ? "/admin/orders" : "/orders"} className="text-[11px] font-bold text-gray-400 hover:text-primary mb-4 inline-flex items-center gap-2 uppercase tracking-widest transition-colors group">
            <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> {user?.role === 'admin' ? "Back to Operations" : "Back to Orders"}
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 font-outfit tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className={`badge-status h-7 px-4 ${statusClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm">
          <h2 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-8 border-b border-gray-50 pb-3">Delivery Progress</h2>
          <div className="flex justify-between relative max-w-2xl mx-auto px-4">
            {/* Progress line */}
            <div className="absolute top-4 left-4 right-4 h-[2px] bg-gray-50 -z-0">
               <div className="h-full bg-primary transition-all duration-700 ease-in-out" 
                    style={{ width: `${curIdx === -1 ? 0 : (curIdx / 3) * 100}%` }} />
            </div>
            {steps.map((s, i) => {
              const active = i <= curIdx;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                    active ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-200'
                  }`}>
                    <FontAwesomeIcon icon={s.icon} className="text-xs" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${active ? 'text-neutral-900' : 'text-gray-300'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">Ordered Items</h3>
                <span className="text-[10px] font-bold text-gray-400">{order.orderItems.length} Product(s)</span>
              </div>
              <div className="divide-y divide-gray-50">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50/20 transition-colors">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Rs. {item.price} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-extrabold text-neutral-900 font-outfit">Rs. {(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Section */}
            {order.orderStatus === 'Delivered' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">Order Experience</h3>
                {myReview ? (
                  <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 relative group transition-all">
                    <div className="flex text-secondary gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className={`text-[10px] ${i < myReview.rating ? '' : 'opacity-20'}`} />
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-600 italic leading-relaxed">"{myReview.comment}"</p>
                    <div className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest">Your Feedack</div>
                  </div>
                ) : !showReviewForm ? (
                  <button onClick={() => setShowReviewForm(true)} className="btn-primary w-full h-11 shadow-lg shadow-primary/10">
                    Write a Review
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6 animate-fade-up">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rating Score</label>
                      <div className="flex gap-3">
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" onClick={() => setReview({...review, rating: n})}
                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border-2 ${
                              review.rating === n ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-white border-gray-50 text-gray-300 hover:border-gray-100'
                            }`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Your Feedback</label>
                      <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        required rows="3" className="input-field resize-none" placeholder="Explain your experience with the food..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="btn-primary flex-1 h-11">Submit Review</button>
                      <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 h-11 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-400 transition-colors">Discard</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6 sticky top-20">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
               <h3 className="text-[10px] font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">Delivery Information</h3>
               <div className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Recipient</label>
                    <p className="text-sm font-bold text-neutral-900">{order.shippingAddress.name}</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                       {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-2">Payment Mode</label>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                       {order.paymentMethod}
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 text-white shadow-xl">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Order Total</span>
                  <span className="text-[9px] font-bold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded border border-accent/20">PAID</span>
               </div>
               <div className="flex items-baseline gap-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Rs.</span>
                  <span className="text-3xl font-extrabold font-outfit leading-none">{order.totalPrice.toFixed(0)}</span>
               </div>
               <p className="text-[10px] text-gray-500 mt-4 leading-relaxed border-t border-white/5 pt-4">
                  Tax and delivery charges included in the final amount.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
