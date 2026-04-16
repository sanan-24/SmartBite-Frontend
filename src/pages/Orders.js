import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faClock, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const statusClass = (status) => ({
  'Pending':         'badge-pending',
  'Preparing':       'badge-preparing',
  'Out for Delivery':'badge-delivery',
  'Delivered':       'badge-success',
  'Cancelled':       'badge-danger',
}[status] || 'bg-gray-100 text-gray-500 border border-gray-100');

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.orders);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-sm animate-fade-up">
        <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
           <FontAwesomeIcon icon={faBoxOpen} className="text-gray-200 text-2xl" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 mb-2 font-outfit uppercase tracking-tight">No orders yet</h2>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">Your order history is empty. Start your first order with SmartBite today!</p>
        <Link to="/menu" className="btn-primary w-full h-11">Explore Menu</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="section-padding">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 font-outfit tracking-tight">Order History</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-gray-200 transition-all">
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                    Order <span className="text-primary">#{order._id.slice(-8).toUpperCase()}</span>
                  </span>
                  <span className={`badge-status ${statusClass(order.orderStatus)}`}>
                    {statusClass(order.orderStatus) === 'badge-delivery' ? 'On Regular Way' : order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-1.5 tracking-wider">
                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-[11px] font-bold text-primary uppercase flex items-center gap-1.5 hover:underline tracking-widest"
                  >
                    Details <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                  </Link>
                </div>
              </div>

              {/* Items Horizontal Scroll */}
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-gray-50/50 rounded-lg border border-gray-100 p-2 min-w-[200px]">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-neutral-900 truncate uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.quantity}× Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount Paid</span>
                <span className="text-base font-extrabold text-neutral-900 font-outfit">Rs. {order.totalPrice.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
