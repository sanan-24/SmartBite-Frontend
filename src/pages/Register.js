import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBurger, faUser, faEnvelope, faPhone, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone });
    if (result.success) { toast.success('Welcome to the SmartBite family!'); navigate('/'); }
    else toast.error(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      
      {/* Left Side: Visual/Design - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-neutral-900 overflow-hidden">
         {/* Background Image with Overlay */}
         <img 
           src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" 
           alt="Fresh Italian Pizza"
           className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s]"
         />
         <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-transparent to-primary/20"></div>
         
         {/* branding overlay */}
         <div className="relative z-10 w-full flex flex-col justify-between p-16">
            <Link to="/" className="inline-flex items-center gap-2.5 group max-w-fit">
              <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                <FontAwesomeIcon icon={faBurger} className="text-white text-lg" />
              </div>
              <span className="text-2xl font-extrabold font-outfit text-white tracking-tight">
                Smart<span className="text-primary">Bite</span>
              </span>
            </Link>

            <div className="max-w-md">
               <h2 className="text-5xl font-extrabold text-white leading-tight font-outfit mb-4">
                 Join Pakistan's <span className="text-primary italic">purest</span> food community.
               </h2>
               <p className="text-neutral-300 text-lg leading-relaxed">
                 Create an account today and unlock exclusive daily deals from Lahore's top-rated eateries.
               </p>
               <div className="flex gap-8 mt-12">
                  <div className="text-white">
                     <p className="text-2xl font-bold font-outfit leading-none">Free</p>
                     <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Delivery Reward</p>
                  </div>
                  <div className="text-white">
                     <p className="text-2xl font-bold font-outfit leading-none">10k+</p>
                     <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">Happy Users</p>
                  </div>
               </div>
            </div>

            <p className="text-neutral-500 text-xs uppercase tracking-widest">© 2026 SmartBite Pakistan — Freshness Redefined</p>
         </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20 bg-white relative">
        
        {/* Mobile Header / Back Button */}
        <div className="absolute top-8 left-8 lg:left-20">
           <Link to="/" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <FontAwesomeIcon icon={faArrowLeft} /> Back
           </Link>
        </div>

        <div className="w-full max-w-sm">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-neutral-900 font-outfit tracking-tight mb-2">Create Account</h1>
            <p className="text-[13px] text-gray-400 font-medium">Join us for the finest dining experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field pl-12 h-11" placeholder="Ahmed Ali" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field pl-12 h-11" placeholder="0321..." />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="relative group">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field pl-12 h-11" placeholder="name@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field pl-12 h-11" placeholder="••••••" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Confirm</label>
                  <div className="relative group">
                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field pl-12 h-11" placeholder="••••••" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <p className="text-[10px] text-gray-500 leading-relaxed">
                 By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
               </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : 'Join Community'
              }
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-50 text-center lg:text-left">
            <p className="text-[13px] text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-neutral-900 font-extrabold hover:text-primary transition-colors ml-1 uppercase text-xs tracking-widest underline underline-offset-4">Log In</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
