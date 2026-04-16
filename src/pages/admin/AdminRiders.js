import React, { useState, useEffect } from 'react';
import { riderAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faMotorcycle, faEnvelope, faPhone, faUser, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => { fetchRiders(); }, []);

  const fetchRiders = async () => {
    try {
      const res = await riderAPI.getAll();
      setRiders(res.data.riders || res.data);
    } catch { toast.error('Failed to load riders'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await riderAPI.create(formData);
      toast.success('Rider created');
      setFormData({ name: '', email: '', phone: '', password: '' });
      setShowForm(false);
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create rider');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rider registration?')) return;
    try {
      await riderAPI.delete(id);
      toast.success('Deleted');
      fetchRiders();
    } catch { toast.error('Failed to delete'); }
  };

  const inputCls = "input-field";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-6 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Delivery Fleet</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage SmartBite Rider Accounts</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary h-11 px-6 shadow-lg shadow-primary/10">
             <FontAwesomeIcon icon={showForm ? faTimes : faPlus} className="mr-2" />
             {showForm ? 'Discard Registration' : 'Register New Rider'}
          </button>
        </header>

        {showForm && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 mb-10 shadow-sm animate-fade-up">
            <h2 className="text-[10px] font-bold text-neutral-900 uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-3">Fleet Induction Form</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Rider Full Name</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ahmed Ali" className={inputCls + " pl-10"} required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Phone Number</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="03xx-xxxxxxx" className={inputCls + " pl-10"} required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Email (Portal Login)</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="rider@smartbite.pk" className={inputCls + " pl-10"} required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Secure Password</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className={inputCls} required />
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-50">
                <button type="submit" className="btn-primary flex-1 h-12 shadow-lg shadow-primary/20 text-[11px] uppercase tracking-widest">Generate Credentials</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-8 h-12 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="table-wrapper shadow-sm border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="th">Rider Identity</th>
                <th className="th">Contact</th>
                <th className="th">Portal Access</th>
                <th className="th text-right opacity-0">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {riders.map((r) => (
                <tr key={r._id} className="tr-hover group">
                  <td className="td py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-red-50 text-primary flex items-center justify-center border border-red-100 group-hover:bg-primary group-hover:text-white transition-all">
                          <FontAwesomeIcon icon={faMotorcycle} className="text-xs" />
                       </div>
                       <span className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight group-hover:text-primary transition-colors">{r.name}</span>
                    </div>
                  </td>
                  <td className="td">
                    <p className="text-xs font-bold text-neutral-700">{r.phone}</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">Verified Contact</p>
                  </td>
                  <td className="td">
                    <p className="text-xs font-medium text-gray-500">{r.email}</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">Corporate ID</p>
                  </td>
                  <td className="td text-right">
                    <button onClick={() => handleDelete(r._id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Remove Rider"><FontAwesomeIcon icon={faTrash} className="text-[11px]" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRiders;
