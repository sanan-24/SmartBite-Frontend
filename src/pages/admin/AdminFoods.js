import React, { useState, useEffect } from 'react';
import { foodAPI, categoryAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image: '',
    category: '', preparationTime: 30, isAvailable: true
  });

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await foodAPI.getAll();
      setFoods(res.data.foods);
    } catch { toast.error('Failed to load foods'); }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.categories);
    } catch { toast.error('Failed to load categories'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await foodAPI.update(editingFood._id, formData);
        toast.success('Food updated');
      } else {
        await foodAPI.create(formData);
        toast.success('Food added');
      }
      fetchFoods();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name, description: food.description, price: food.price,
      image: food.image, category: food.category?._id || food.category,
      preparationTime: food.preparationTime, isAvailable: food.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item from menu?')) {
      try {
        await foodAPI.delete(id);
        toast.success('Deleted');
        fetchFoods();
      } catch { toast.error('Failed'); }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFood(null);
    setFormData({ name: '', description: '', price: '', image: '', category: '', preparationTime: 30, isAvailable: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-bold text-gray-400 hover:text-primary mb-6 transition-colors uppercase tracking-widest gap-2 group">
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 font-outfit uppercase tracking-tight">Food Inventory</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage SmartBite menu items</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary h-11 px-6 shadow-lg shadow-primary/10">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Dish
          </button>
        </header>

        <div className="table-wrapper shadow-sm border-gray-100">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="th">Dish Profile</th>
                <th className="th">Category</th>
                <th className="th">Price</th>
                <th className="th text-center">Status</th>
                <th className="th text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {foods.map((food) => (
                <tr key={food._id} className="tr-hover group">
                  <td className="td">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 flex-shrink-0">
                        <img src={food.image} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-neutral-900 text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{food.name}</span>
                    </div>
                  </td>
                  <td className="td">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{food.category?.name || 'Uncategorized'}</span>
                  </td>
                  <td className="td">
                    <p className="text-sm font-extrabold text-neutral-900 font-outfit">Rs. {food.price}</p>
                  </td>
                  <td className="td text-center">
                    <span className={`badge-status ${food.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {food.isAvailable ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="td text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(food)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-all" title="Edit Item">
                        <FontAwesomeIcon icon={faEdit} className="text-[11px]" />
                      </button>
                      <button onClick={() => handleDelete(food._id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Item">
                        <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest leading-none mb-1">
                    {editingFood ? 'Modify Dish' : 'New Dish Registration'}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-medium">Please fill all mandatory fields for SmartBite inventory.</p>
                </div>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 transition-all border border-transparent hover:border-gray-100">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Item Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="input-field" placeholder="e.g. Mutton Karahi" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cuisine Type</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="input-field font-bold uppercase text-[10px] tracking-widest">
                      <option value="">Select Cuisine</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description (Display text)</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows="2" className="input-field resize-none" placeholder="Explain ingredients and taste..." />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Price (PKR)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Prep Time (Min)</label>
                    <input type="number" value={formData.preparationTime} onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })} required className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Product Image Link</label>
                  <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required className="input-field" placeholder="https://unsplash..." />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} className="accent-primary w-4 h-4" id="av" />
                  <label htmlFor="av" className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest cursor-pointer">Live on SmartBite App</label>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-1 btn-primary h-12 shadow-lg shadow-primary/20">
                    {editingFood ? 'Save Update' : 'Register Dish'}
                  </button>
                  <button type="button" onClick={handleCloseModal} className="px-8 h-12 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">Discard</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFoods;
