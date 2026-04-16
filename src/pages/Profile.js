import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faCheckCircle, faSave, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || '',
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, address: { ...formData.address, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) { toast.success('Profile updated!'); setIsEditing(false); }
    else toast.error(result.message);
    setLoading(false);
  };

  const inputCls = "input-field";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/menu" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-4 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Menu
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 font-outfit tracking-tight uppercase">My Profile</h1>

        {/* User Status Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-primary font-bold text-2xl font-outfit shadow-sm relative">
              {user?.name?.charAt(0)?.toUpperCase()}
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
                 <FontAwesomeIcon icon={faCheckCircle} className="text-accent text-[12px]" />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 tracking-tight">{user?.name}</p>
              <p className="text-xs text-gray-400 font-medium mb-1.5">{user?.email}</p>
              <div className="flex gap-2">
                <span className={`badge-status ${user?.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>
                  {user?.role === 'admin' ? 'Admin' : 'Active Member'}
                </span>
                <span className="badge-status bg-gray-50 text-gray-500 border-gray-100">Lahore, PK</span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-outline text-xs px-5 py-2 hover:bg-gray-50 border-gray-100 h-9">
              <FontAwesomeIcon icon={faEdit} className="mr-2 opacity-60" /> Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-up shadow-sm">
            <h2 className="text-xs font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">Update Personal Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03xx-xxxxxxx" className={inputCls} />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Delivery Destination</p>
                <div className="space-y-3">
                  <input type="text" name="address.street" value={formData.address.street}
                    onChange={handleChange} placeholder="Street address / House # / Area" className={inputCls} />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="address.city" value={formData.address.city}
                      onChange={handleChange} placeholder="City (e.g. Lahore)" className={inputCls} />
                    <input type="text" name="address.state" value={formData.address.state}
                      onChange={handleChange} placeholder="Province (e.g. Punjab)" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="address.zipCode" value={formData.address.zipCode}
                      onChange={handleChange} placeholder="Postal code" className={inputCls} />
                    <input type="text" name="address.country" value={formData.address.country}
                      onChange={handleChange} placeholder="Country" className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 pt-4 border-t border-gray-50">
                <button type="submit" disabled={loading} className="btn-primary flex-1 h-11 disabled:opacity-60 shadow-lg shadow-primary/10">
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {loading ? 'Working...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}
                  className="px-8 h-11 text-xs font-bold uppercase tracking-widest text-neutral-400 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xs font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">Contact info</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mb-1.5">Official Email</p>
                  <p className="text-sm font-semibold text-neutral-900 truncate">{user?.email}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mb-1.5">Verified Phone</p>
                  <p className="text-sm font-semibold text-neutral-900">{user?.phone || '+92 — — —'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xs font-bold text-neutral-900 mb-6 uppercase tracking-widest border-b border-gray-50 pb-3">Primary Address</h2>
              {user?.address?.street ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-neutral-900 leading-relaxed">{user.address.street}</p>
                  <p className="text-xs text-gray-500">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest pt-2">{user.address.country}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No primary delivery address saved yet.</p>
              )}
            </div>

            <div className="md:col-span-2 bg-gray-900 rounded-xl p-6 text-white shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">SmartBite Membership</p>
                <p className="text-base font-bold font-outfit">Joined {new Date(user?.createdAt).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                <span className="text-xs font-bold text-accent">Account Verified</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
