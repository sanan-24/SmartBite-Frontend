import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faTwitter, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="text-xl font-extrabold text-neutral-900 font-outfit tracking-tight">
              Smart<span className="text-primary">Bite</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Bringing you the finest Pakistani cuisine from local favorites straight to your doorstep. Hot, fresh, and on time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faFacebook} size="sm" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faInstagram} size="sm" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                <FontAwesomeIcon icon={faTwitter} size="sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/menu" className="hover:text-primary transition-colors">Our Menu</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Your Cart</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Account Settings</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Order History</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Delivery Areas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest mb-4">Contact Us</h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-0.5 text-primary" />
                <span>Z Town, Multan, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-primary" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                <span>smartbite86@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-400 font-medium">
            © {new Date().getFullYear()} SmartBite (Pvt) Ltd. All rights reserved.
          </p>
          <div className="flex gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
             {/* Payment icons could go here */}
             <span className="text-[9px] font-bold text-gray-400 tracking-tighter uppercase px-1.5 py-0.5 border border-gray-200 rounded">VISA</span>
             <span className="text-[9px] font-bold text-gray-400 tracking-tighter uppercase px-1.5 py-0.5 border border-gray-200 rounded">JazzCash</span>
             <span className="text-[9px] font-bold text-gray-400 tracking-tighter uppercase px-1.5 py-0.5 border border-gray-200 rounded">EasyPaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
