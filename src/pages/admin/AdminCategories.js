import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.categories);
    } catch { toast.error('Failed to load categories'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
        toast.success('Updated');
      } else {
        await categoryAPI.create(formData);
        toast.success('Added');
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await categoryAPI.delete(id);
        toast.success('Deleted');
        fetchCategories();
      } catch { toast.error('Failed'); }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="section-padding max-w-4xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-6 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Cuisines / Categories</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Organize SmartBite menu structure</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary h-11 px-6 shadow-lg shadow-primary/10">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Category
          </button>
        </header>

        <div className="table-wrapper shadow-sm border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="th">Category Listing</th>
                <th className="th text-right opacity-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat._id} className="tr-hover group">
                  <td className="td py-4">
                     <span className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight group-hover:text-primary transition-colors">{cat.name}</span>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Active SmartBite Filter</p>
                  </td>
                  <td className="td text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(cat)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-all"><FontAwesomeIcon icon={faEdit} className="text-[11px]" /></button>
                      <button onClick={() => handleDelete(cat._id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FontAwesomeIcon icon={faTrash} className="text-[11px]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-widest">{editingCategory ? 'Modify Category' : 'Register Category'}</h2>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 transition-all border border-transparent hover:border-gray-100">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Category Display Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} required className="input-field" placeholder="e.g. Traditional, Karahi, Burgers" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-1 btn-primary h-12 shadow-lg shadow-primary/20 text-[11px] uppercase tracking-widest">{editingCategory ? 'Update Info' : 'Add to Menu'}</button>
                  <button type="button" onClick={handleCloseModal} className="px-6 h-12 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
