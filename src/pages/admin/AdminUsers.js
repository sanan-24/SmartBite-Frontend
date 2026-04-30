import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faShieldAlt, faTimes, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ isAdmin: false });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data.users || res.data);
    } catch { toast.error('Failed to load users'); }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    // setFormData({ isAdmin: !!user.isAdmin || user.role === 'admin' });
    setFormData({
      role: user.role || 'user'
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await userAPI.update(editingUser._id, formData);
      toast.success('Permissions updated');
      setEditingUser(null);
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer account permanently?')) return;
    try {
      await userAPI.delete(id);
      toast.success('Deleted');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-6 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">User Management</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Audit customer accounts & assign administrative roles</p>
        </header>

        <div className="table-wrapper shadow-sm border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="th">Account Identity</th>
                <th className="th">Email Details</th>
                <th className="th">Permission Level</th>
                <th className="th text-right opacity-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u._id} className="tr-hover group">
                  <td className="td py-4">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faUserCircle} className="text-gray-200 text-2xl group-hover:text-primary transition-colors" />
                      <span className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight">{u.name}</span>
                    </div>
                  </td>
                  <td className="td text-[11px] font-medium text-gray-500">{u.email}</td>
                  <td className="td">
                    <span
                      className={`badge-status h-6 ${u.role === 'admin' || u.isAdmin
                        ? 'badge-danger'
                        : u.role === 'rider'
                          ? 'badge-warning'
                          : 'badge-success'
                        }`}
                    >
                      {u.role === 'admin' || u.isAdmin
                        ? 'Administrator'
                        : u.role === 'rider'
                          ? 'Rider'
                          : 'Customer'}
                    </span>
                  </td>
                  <td className="td text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(u)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-all" title="Edit Role"><FontAwesomeIcon icon={faEdit} className="text-[11px]" /></button>
                      <button onClick={() => handleDelete(u._id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete User"><FontAwesomeIcon icon={faTrash} className="text-[11px]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-widest leading-none mb-1">Authorization Audit</h2>
                  <p className="text-[9px] text-gray-400">User: {editingUser.name}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 transition-all border border-transparent hover:border-gray-100">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100 relative group">
                  <input
                    id="isAdmin"
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="accent-primary w-5 h-5 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="isAdmin" className="text-xs font-bold text-neutral-900 uppercase tracking-tight block">Grant Administrator Rights</label>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">This allows full access to SmartBite inventory, orders, and financial data.</p>
                  </div>
                  <FontAwesomeIcon icon={faShieldAlt} className="absolute top-4 right-4 text-primary opacity-10 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-1 btn-primary h-12 text-[11px] uppercase tracking-widest shadow-lg shadow-primary/10">Authorize Status</button>
                  <button type="button" onClick={() => setEditingUser(null)} className="px-5 h-12 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
