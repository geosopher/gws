import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Instagram, 
  Facebook, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setSelectedCategory, showToast, setIsAdminOpen, isAdminLoggedIn } = useStore();

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Thank you for subscribing to Global Wealth Newsletter!');
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Customer Benefits Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-16 border-b border-neutral-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-[#D4AF37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">100% Authentic Luxury</h4>
              <p className="text-xs text-neutral-400 mt-1">Handpicked Italian leather, silk, and bespoke tailoring.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-pink-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Fast, secure shipping across Nigeria & all states.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">Secure Bank Transfer</h4>
              <p className="text-xs text-neutral-400 mt-1">Direct corporate bank payment & WhatsApp confirmation.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm">Dedicated Customer Service</h4>
              <p className="text-xs text-neutral-400 mt-1">Support via phone & WhatsApp +2349031355416.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-neutral-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://i.ibb.co/BHsL2Bcy/wealth-logo.png" 
                alt="Global Wealth Store" 
                className="h-10 w-auto object-contain bg-white/10 p-1.5 rounded-xl"
              />
              <div>
                <span className="font-heading text-lg font-bold tracking-wider text-white">
                  GLOBAL WEALTH STORE
                </span>
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mt-0.5">
                  Luxury Fashion & Accessories
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed pr-6">
              The premier destination for high-end men's fashion, women's couture, kids royal wear, Italian leather shoes, bags, and luxury accessories in Nigeria.
            </p>
            
            <div className="space-y-2.5 pt-2 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>Block C, Flat 1-06 Modern Market, Mpape, Abuja FCT, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/2349031355416" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  +234 903 135 5416 (WhatsApp Support)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>support@globalwealthstore.ng</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-pink-500 hover:border-pink-500/50 transition-all"
                aria-label="Instagram @wealthconnection2"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-blue-400 hover:border-blue-400/50 transition-all"
                aria-label="Facebook Wealths Bags and Accessories"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"
                aria-label="TikTok @Global Wealth's Store"
              >
                <span className="text-xs font-bold">TK</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Home Page</button></li>
              <li><button onClick={() => { setSelectedCategory('all'); setView('shop'); }} className="hover:text-white transition-colors">All Collections</button></li>
              <li><button onClick={() => setView('dashboard')} className="hover:text-white transition-colors">Customer Dashboard</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-white transition-colors">Abuja Showroom & Contact</button></li>
              <li><button onClick={() => {
                if (isAdminLoggedIn) {
                  setView('admin');
                } else {
                  setIsAdminOpen(true);
                }
              }} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 pt-1 text-neutral-500 hover:text-neutral-300">
                <span>🔐 Admin Portal</span>
              </button></li>
              <li><a href="https://wa.me/2349031355416" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">WhatsApp Order Hotline</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Luxury Categories</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><button onClick={() => { setSelectedCategory('women'); setView('shop'); }} className="hover:text-white transition-colors">Women's Fashion</button></li>
              <li><button onClick={() => { setSelectedCategory('men'); setView('shop'); }} className="hover:text-white transition-colors">Men's Tailoring</button></li>
              <li><button onClick={() => { setSelectedCategory('shoes'); setView('shop'); }} className="hover:text-white transition-colors">Italian Shoes</button></li>
              <li><button onClick={() => { setSelectedCategory('bags'); setView('shop'); }} className="hover:text-white transition-colors">Bags & Luggage</button></li>
              <li><button onClick={() => { setSelectedCategory('accessories'); setView('shop'); }} className="hover:text-white transition-colors">Luxury Accessories</button></li>
              <li><button onClick={() => { setSelectedCategory('kids'); setView('shop'); }} className="hover:text-white transition-colors">Kids Royal Wear</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-neutral-400 mb-4">Subscribe to receive private sale invites, new arrival drops, and exclusive voucher codes.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                required
                placeholder="Enter your email address" 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button 
                type="submit"
                className="w-full bg-[#E91E63] text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#D81B60] transition-colors shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Global Wealth Store. All rights reserved. Registered in Nigeria.</p>
          <div className="flex items-center gap-6">
            <span>Social Handles: @wealthconnection2 | Wealths Bags and Accessories | @Global Wealth's Store</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
