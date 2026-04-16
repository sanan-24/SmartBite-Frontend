import React, { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faClock, faCheck, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

const RiderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, inDelivery: 0 });

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
        pending:    riderOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing').length
      });
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateDeliveryStatus(orderId, newStatus);
      toast.success(`Task ${newStatus}`);
      fetchRiderOrders();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const getStatusClass = (status) => ({
    'Pending': 'badge-pending',
    'Preparing': 'badge-preparing',
    'Out for Delivery': 'badge-delivery',
    'Delivered': 'badge-success',
    'Cancelled': 'badge-danger',
  }[status] || 'badge-pending');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <header className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Rider Console</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time task management for SmartBite fleet</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Logs', value: stats.total, color: 'text-neutral-900', bg: 'bg-white' },
            { label: 'Idle/Wait',  value: stats.pending, color: 'text-orange-500', bg: 'bg-white' },
            { label: 'Active Trip', value: stats.inDelivery, color: 'text-primary', bg: 'bg-white' },
            { label: 'Completed',  value: stats.delivered, color: 'text-accent', bg: 'bg-white' },
          ].map((card) => (
            <div key={card.label} className={`${card.bg} rounded-xl border border-gray-100 p-6 shadow-sm`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 leading-none">{card.label}</p>
              <p className={`text-2xl font-extrabold font-outfit ${card.color} leading-none italic`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
           <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-50">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Active Task Flow</h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orders.length} Deliveries Found</span>
           </div>
           
           {orders.length === 0 ? (
             <div className="py-20 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
               <FontAwesomeIcon icon={faMotorcycle} className="text-gray-200 text-3xl mb-4" />
               <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">No orders assigned to you yet.</p>
             </div>
           ) : (
             <div className="space-y-6">
               {orders.map((order) => (
                 <div key={order._id} className="bg-gray-50/50 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-all group">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/50">
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</span>
                          <span className={`badge-status ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <FontAwesomeIcon icon={faClock} /> Recieved {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                       <div className="space-y-3">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Destination</p>
                          <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center border border-red-100 flex-shrink-0">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                             </div>
                             <span className="text-xs font-bold text-neutral-900 leading-relaxed">{order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
                          </div>
                       </div>
                       <div className="space-y-3">
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Recipient Contact</p>
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 flex-shrink-0">
                                <FontAwesomeIcon icon={faPhone} className="text-xs" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-neutral-900 leading-none">{order.user?.name || 'Customer'}</p>
                                <p className="text-[11px] font-medium text-gray-500 mt-1.5">{order.shippingAddress?.phone || order.user?.phone}</p>
                             </div>
                           </div>
                       </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-5 pt-4 border-t border-white/50">
                       <div className="flex items-baseline gap-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Cash to Collect:</span>
                          <span className="text-lg font-extrabold text-neutral-900 font-outfit uppercase">Rs. {order.totalPrice.toFixed(0)}</span>
                       </div>
                       <div className="flex gap-2">
                          {order.orderStatus === 'Pending' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'Preparing')}
                              className="h-9 px-4 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg border border-orange-100 hover:bg-orange-100 uppercase tracking-widest transition-all">Kitchen</button>
                          )}
                          {(order.orderStatus === 'Preparing' || order.orderStatus === 'Pending') && (
                            <button onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')}
                              className="h-9 px-4 bg-red-50 text-primary text-[10px] font-bold rounded-lg border border-red-100 hover:bg-red-100 uppercase tracking-widest transition-all">Pickup Done</button>
                          )}
                          {order.orderStatus === 'Out for Delivery' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                              className="h-9 px-6 bg-green-50 text-accent text-[10px] font-bold rounded-lg border border-green-100 hover:bg-green-100 uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm">
                                <FontAwesomeIcon icon={faCheck} /> Mark as Delivered
                            </button>
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
