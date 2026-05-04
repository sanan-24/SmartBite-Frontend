import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faArrowLeft,
  faFileDownload,
  faPrint,
  faFilter,
  faCalendarCheck,
  faShoppingBag,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminReports = () => {
  const [range, setRange] = useState('monthly');
  const [statement, setStatement] = useState({
    orders: [],
    totalRevenue: 0,
    count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatement();
  }, [range]);

  const fetchStatement = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getStatement(range);
      setStatement(data);
    } catch (error) {
      toast.error('Failed to load statement');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && statement.orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-10 print:px-10">
      <style>
        {`
          @page {
            size: auto;
            margin: 0mm;
          }
          @media print {
            body {
              padding: 20mm;
            }
          }
        `}
      </style>
      <div className="max-w-5xl mx-auto">
        
        {/* Actions - Hidden on Print */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
          <div>
            <Link to="/admin" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors mb-4">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Business Statement</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
              {['weekly', 'monthly', 'yearly'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    range === r 
                    ? 'bg-neutral-900 text-white shadow-lg shadow-neutral-900/10' 
                    : 'text-gray-400 hover:text-neutral-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handlePrint} 
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-100 text-neutral-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
            >
              <FontAwesomeIcon icon={faPrint} /> Print
            </button>
          </div>
        </div>

        {/* Print-Only Header (Simple A4 Style) */}
        <div className="hidden print:block mb-10 text-center border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold uppercase">SmartBite Sales Report</h1>
          <p className="text-sm mt-1 uppercase tracking-widest font-bold">
            {range === 'weekly' ? 'Weekly' : range === 'monthly' ? 'Monthly' : 'Yearly'} Statement
          </p>
          <p className="text-[10px] mt-1">Generated on: {new Date().toLocaleString()}</p>
        </div>

        {/* Statement Document */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-neutral-200/50 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          
          {/* Statement Header - Hidden on Print */}
          <div className="bg-neutral-900 p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden print:hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-black">S</div>
                <h2 className="text-xl font-black font-outfit uppercase tracking-tighter">SmartBite <span className="text-primary">Admin</span></h2>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Statement For</p>
              <h3 className="text-lg font-bold font-outfit uppercase tracking-tight">
                {range === 'weekly' ? 'Weekly Sales Report' : range === 'monthly' ? 'Monthly Sales Report' : 'Yearly Sales Report'}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium mt-1">Generated on {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
            </div>

            <div className="flex flex-col md:items-end gap-4 relative z-10">
              <div className="text-right">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-3xl font-black font-outfit text-white leading-none">Rs. {statement.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="flex items-center gap-6 mt-2">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Orders</p>
                  <p className="text-sm font-bold">{statement.count}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-bold text-green-400 uppercase tracking-widest">Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statement Table */}
          <div className="p-0 print:p-4">
            <table className="w-full border-collapse print:border print:border-black">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 print:bg-white print:border-black">
                  <th className="py-5 px-8 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black print:px-4 print:border-r print:border-black">Date</th>
                  <th className="py-5 px-8 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black print:px-4 print:border-r print:border-black">Description</th>
                  <th className="py-5 px-8 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black print:px-4 print:border-r print:border-black">Customer</th>
                  <th className="py-5 px-8 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest print:text-black print:px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 print:divide-black">
                {statement.orders.length > 0 ? (
                  statement.orders.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group print:border-b print:border-black">
                      <td className="py-6 px-8 print:py-2 print:px-4 print:border-r print:border-black">
                        <p className="text-[11px] font-bold text-neutral-900 font-outfit print:text-[10px]">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-1 print:hidden">
                          {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="py-6 px-8 print:py-2 print:px-4 print:border-r print:border-black">
                        <p className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-tight print:text-[10px]">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 print:text-[8px] print:text-black">
                          {order.orderItems.length} Items • {order.paymentMethod}
                        </p>
                      </td>
                      <td className="py-6 px-8 print:py-2 print:px-4 print:border-r print:border-black">
                        <p className="text-[11px] font-bold text-neutral-900 print:text-[10px]">{order.user?.name || 'Guest'}</p>
                      </td>
                      <td className="py-6 px-8 text-right print:py-2 print:px-4">
                        <p className="text-sm font-black font-outfit text-neutral-900 print:text-[10px]">Rs. {order.totalPrice.toFixed(0)}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-32 text-center print:py-10">
                      <p className="text-[11px] font-bold uppercase tracking-widest">No transactions found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Statement Footer - Hidden on Print */}
          <div className="bg-gray-50/50 p-10 border-t border-gray-100 print:hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-xs">
                <h4 className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest mb-2">Terms & Notes</h4>
                <p className="text-[10px] leading-relaxed text-gray-400">
                  This is a computer-generated statement and does not require a physical signature. Any discrepancies should be reported to the finance department within 48 hours.
                </p>
              </div>
              
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Subtotal Orders</span>
                  <span className="text-neutral-900">{statement.count}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Tax/VAT (0%)</span>
                  <span className="text-neutral-900">Rs. 0</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-900">Closing Balance</span>
                  <span className="text-xl font-black font-outfit text-primary">Rs. {statement.totalRevenue.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Print Only Summary */}
          <div className="hidden print:block mt-6 px-4">
            <div className="flex justify-end gap-10 border-t border-black pt-4">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase">Total Orders</p>
                <p className="text-lg font-bold">{statement.count}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase">Net Revenue</p>
                <p className="text-lg font-bold">Rs. {statement.totalRevenue.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-[8px] mt-10 text-center border-t border-gray-200 pt-2">© SmartBite Management - Computer Generated Report</p>
          </div>

        </div>
        
        {/* Helper Note - Hidden on Print */}
        <div className="mt-8 text-center print:hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-[8px]" />
            Use the filters above to toggle between different time periods
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
