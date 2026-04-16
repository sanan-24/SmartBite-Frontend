import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, riderAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faUser, faClock, faEye, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll();
      setOrders(res.data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const fetchRiders = async () => {
    try {
      const res = await riderAPI.getAll();
      setRiders(res.data.riders || []);
    } catch { console.error('Failed riders'); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  const handleAssignRider = async () => {
    if (!selectedRider) { toast.error('Select a rider'); return; }
    try {
      await orderAPI.assignRider(selectedOrder._id, selectedRider);
      toast.success('Rider assigned');
      setShowAssignModal(false);
      setSelectedRider('');
      setSelectedOrder(null);
      fetchOrders();
    } catch { toast.error('Failed to assign'); }
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const statusClass = (status) => ({
    'Pending': 'badge-pending',
    'Preparing': 'badge-preparing',
    'Out for Delivery': 'badge-delivery',
    'Delivered': 'badge-success',
    'Cancelled': 'badge-danger',
  }[status] || 'badge-pending');

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-6 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Active Deliveries</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time order management & dispatch</p>
        </header>

        <div className="table-wrapper shadow-sm border-gray-100">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="th">Order ID</th>
                <th className="th">Customer Info</th>
                <th className="th">Cart</th>
                <th className="th">Revenue</th>
                <th className="th">Phase Status</th>
                <th className="th">Delivery Agent</th>
                <th className="th text-right opacity-0">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="tr-hover group">
                  <td className="td text-primary font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="td">
                    <p className="text-xs font-extrabold text-neutral-900 uppercase tracking-tight">{order.user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">{order.shippingAddress?.phone}</p>
                  </td>
                  <td className="td">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{order.orderItems.length} Products</span>
                  </td>
                  <td className="td">
                    <p className="text-sm font-extrabold text-neutral-900 font-outfit">Rs. {order.totalPrice.toFixed(0)}</p>
                  </td>
                  <td className="td">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer appearance-none shadow-sm h-8 ${statusClass(order.orderStatus)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out/Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="td">
                    {order.assignedTo ? (
                      <div className="flex items-center gap-2 text-accent bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 w-fit">
                        <FontAwesomeIcon icon={faMotorcycle} className="text-[10px]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{order.assignedTo.name || 'Assigned'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openAssignModal(order)}
                        className="text-[10px] font-bold uppercase text-primary hover:underline flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faUser} className="text-[9px]" /> Assign Rider
                      </button>
                    )}
                  </td>
                  <td className="td text-right">
                    <Link to={`/admin/orders/${order._id}`} className="text-[10px] font-bold text-gray-400 group-hover:text-primary uppercase tracking-widest underline transition-colors">
                       View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Rider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
             <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-widest leading-none mb-1">Fleet Assignment</h2>
                  <p className="text-[9px] text-gray-400">Order #{selectedOrder?._id.slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={() => setShowAssignModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 transition-all border border-transparent hover:border-gray-100">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {riders.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                     <FontAwesomeIcon icon={faMotorcycle} className="text-gray-200 text-3xl mb-3" />
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No active riders in fleet.</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Available Riders</label>
                    <select
                      value={selectedRider}
                      onChange={(e) => setSelectedRider(e.target.value)}
                      className="input-field h-12 text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <option value="">Select a rider...</option>
                      {riders.map((r) => (
                        <option key={r._id} value={r._id}>{r.name} — {r.phone}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button onClick={handleAssignRider} disabled={!selectedRider} 
                    className="flex-1 btn-primary h-12 text-[11px] uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-primary/10">Dispatch Agent</button>
                  <button onClick={() => setShowAssignModal(false)} className="px-6 h-12 text-[11px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
