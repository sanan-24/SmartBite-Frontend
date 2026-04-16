import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, userAPI, foodAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUtensils, 
  faShoppingBag, 
  faHandHoldingUsd, 
  faArrowRight,
  faFolderTree,
  faBoxOpen,
  faUsersGear,
  faMotorcycle,
  faBowlFood
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalFoods: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, foodsRes] = await Promise.all([
        orderAPI.getAll(),
        userAPI.getAll(),
        foodAPI.getAll()
      ]);

      const orders = ordersRes.data.orders;
      const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalUsers: usersRes.data.count,
        totalFoods: foodsRes.data.count,
        totalRevenue: revenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
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

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: faShoppingBag, color: 'text-primary', bg: 'bg-red-50' },
    { label: 'Active Users', value: stats.totalUsers, icon: faUsers, color: 'text-secondary', bg: 'bg-orange-50' },
    { label: 'Menu Items', value: stats.totalFoods, icon: faUtensils, color: 'text-accent', bg: 'bg-green-50' },
    { label: 'Revenue (PKR)', value: `${stats.totalRevenue.toFixed(0)}`, icon: faHandHoldingUsd, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const quickLinks = [
    { to: '/admin/foods',      label: 'Foods',      icon: faBowlFood,     color: 'text-primary' },
    { to: '/admin/categories', label: 'Categories', icon: faFolderTree,   color: 'text-secondary' },
    { to: '/admin/orders',     label: 'Orders',     icon: faBoxOpen,      color: 'text-accent' },
    { to: '/admin/users',      label: 'Users',      icon: faUsersGear,    color: 'text-blue-600' },
    { to: '/admin/riders',     label: 'Riders',     icon: faMotorcycle,  color: 'text-neutral-700' },
  ];

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
          <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">SmartBite Admin</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Management Overview & Statistics</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{card.label}</p>
                <p className="text-xl font-extrabold text-neutral-900 font-outfit leading-none">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                <FontAwesomeIcon icon={card.icon} className="text-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Recent Orders - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Recent Orders</h2>
              <Link to="/admin/orders" className="text-[11px] text-primary font-bold uppercase hover:underline flex items-center gap-2 tracking-widest">
                Full View <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
              </Link>
            </div>
            
            <div className="table-wrapper animate-fade-up shadow-sm">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="th">ID</th>
                    <th className="th">Customer</th>
                    <th className="th">Status</th>
                    <th className="th text-right">Amount</th>
                    <th className="th text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="tr-hover group">
                      <td className="td text-primary font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="td font-medium">{order.user?.name || 'Guest'}</td>
                      <td className="td">
                        <span className={`badge-status ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="td font-bold text-neutral-900 text-right">Rs. {order.totalPrice.toFixed(0)}</td>
                      <td className="td text-center">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="text-[11px] font-bold text-gray-400 group-hover:text-primary uppercase tracking-widest underline transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions - Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">Operational Hub</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50/50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all group text-center"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-100 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 ${link.color} group-hover:text-white`}>
                       <FontAwesomeIcon icon={link.icon} className="text-xl" />
                    </div>
                    <span className="text-[11px] font-extrabold text-gray-500 group-hover:text-neutral-900 transition-colors tracking-widest uppercase leading-none">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Server Health</p>
               <p className="text-sm font-bold font-outfit">Stable & Active</p>
               <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Uptime: 99.9%</span>
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
