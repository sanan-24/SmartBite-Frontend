import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faSignOutAlt, 
  faBurger, 
  faMotorcycle 
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isRider, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
              <FontAwesomeIcon icon={faBurger} className="text-white text-[15px]" />
            </div>
            <span className="text-xl font-extrabold text-neutral-900 font-outfit tracking-tight">
              Smart<span className="text-primary">Bite</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/"      className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">Home</Link>
            <Link to="/menu"  className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">Menu</Link>
            {isAuthenticated && !isRider && (
              <Link to="/orders" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">My Orders</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-[11px] font-bold text-primary bg-red-50 border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition-colors uppercase tracking-wider">
                Admin
              </Link>
            )}
            {isRider && (
              <Link to="/rider/dashboard" className="text-[11px] font-bold text-accent bg-green-50 border border-green-200 px-3 py-1 rounded-md flex items-center gap-1.5 hover:bg-green-100 transition-colors uppercase tracking-wider">
                <FontAwesomeIcon icon={faMotorcycle} /> Deliveries
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {isAuthenticated && !isRider && (
              <Link to="/cart" className="relative p-1.5 text-neutral-600 hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faShoppingCart} className="text-[18px]" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full ring-2 ring-white leading-none">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-1.5 text-neutral-700 hover:text-primary transition-colors">
                  <div className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faUser} className="text-[12px]" />
                  </div>
                  <span className="text-sm font-semibold hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-[16px]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="text-sm text-neutral-600 font-bold hover:text-primary transition-colors">Log in</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 h-9">Sign up</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
