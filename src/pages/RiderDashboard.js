import React, { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, faPhone, faClock, faCheckCircle, faMotorcycle, 
  faRoute, faBox, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import riderHero from '../assets/rider-hero.png';

const RiderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, delivered: 0, inDelivery: 0 });

  useEffect(() => { fetchRiderOrders(); }, []);

  const fetchRiderOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getRiderOrders();
      const riderOrders = res.data.orders;
      setOrders(riderOrders);
      setStats({
        total:      riderOrders.length,
        delivered:  riderOrders.filter(o => o.orderStatus === 'Delivered').length,
        inDelivery: riderOrders.filter(o => o.orderStatus === 'Out for Delivery').length,
      });
    } catch { toast.error('Connection lost'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateDeliveryStatus(orderId, newStatus);
      toast.success(newStatus);
      fetchRiderOrders();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Synchronizing Fleet</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-up">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fleet ID: #R-10294</span>
              </div>
              <h1 className="text-3xl font-black text-neutral-900 font-outfit uppercase tracking-tighter italic">
                Delivery <span className="text-primary">Ops</span>
              </h1>
           </div>
           <div className="flex gap-2">
              <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faMotorcycle} className="text-xs" />
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">Vehicle Status</p>
                    <p className="text-[11px] font-bold text-neutral-900">Active Duty</p>
                 </div>
              </div>
           </div>
        </header>

        {/* Hero Card */}
        <div className="rider-hero animate-fade-up">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center lg:text-left flex-1">
              <span className="glass-tag mb-4 inline-block">Professional Partner</span>
              <h2 className="text-4xl md:text-5xl font-black mb-4 font-outfit tracking-tight">
                Deliver <span className="gradient-text-primary italic">Fast</span><br />
                Earn <span className="gradient-text-primary italic">Better</span>
              </h2>
              <p className="text-sm text-gray-400 max-w-sm mb-8 leading-relaxed font-medium">
                Optimized route tracking and real-time order management for the SmartBite delivery fleet.
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="rider-stat-box">
                  <span className="text-xl font-black font-outfit italic">{stats.total}</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Trips</span>
                </div>
                <div className="rider-stat-box border-primary/20 bg-primary/10">
                  <span className="text-xl font-black font-outfit italic text-primary">{stats.inDelivery}</span>
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Active</span>
                </div>
                <div className="rider-stat-box">
                  <span className="text-xl font-black font-outfit italic text-accent">{stats.delivered}</span>
                  <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Done</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <img 
                src={riderHero} 
                alt="Fleet" 
                className="w-full max-w-[380px] object-contain drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)] bike-bounce" 
              />
            </div>
          </div>
        </div>

        {/* Orders Flow */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest">Live Assignments</h3>
             <button onClick={fetchRiderOrders} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Refresh Flow</button>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
               <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                  <FontAwesomeIcon icon={faRoute} className="text-xl" />
               </div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awaiting New Orders...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order, idx) => (
                <div key={order._id} className="rider-card group animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <FontAwesomeIcon icon={faBox} className="text-xs" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-neutral-900 uppercase">#{order._id.slice(-6)}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <span className={`badge-status ${
                      order.orderStatus === 'Delivered' ? 'badge-success' : 
                      order.orderStatus === 'Out for Delivery' ? 'badge-delivery' : 'badge-pending'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary mt-1 text-[10px]" />
                      <div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Destination</p>
                        <p className="text-[11px] font-bold text-neutral-800 leading-tight">{order.shippingAddress?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faPhone} className="text-blue-500 mt-1 text-[10px]" />
                      <div>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Recipient</p>
                        <p className="text-[11px] font-bold text-neutral-800 leading-tight">{order.user?.name || 'Customer'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div>
                       <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Collect</p>
                       <p className="text-lg font-black font-outfit italic">Rs. {order.totalPrice}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       {order.orderStatus === 'Pending' && (
                         <button onClick={() => handleStatusUpdate(order._id, 'Preparing')} className="px-4 py-2 bg-neutral-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-black transition-all">Accept</button>
                       )}
                       {order.orderStatus === 'Preparing' && (
                         <button onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')} className="btn-primary py-2 px-4 !shadow-none">Pickup</button>
                       )}
                       {order.orderStatus === 'Out for Delivery' && (
                         <button onClick={() => handleStatusUpdate(order._id, 'Delivered')} className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2">
                           <FontAwesomeIcon icon={faCheckCircle} /> Finish
                         </button>
                       )}
                       {order.orderStatus === 'Delivered' && (
                         <span className="text-[10px] font-black text-accent uppercase italic">Delivered</span>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RiderDashboard;
