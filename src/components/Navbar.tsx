import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Truck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { 
    view, 
    setView, 
    setSelectedCategory, 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsSearchOpen,
    setIsAuthOpen,
    user
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const handleNavClick = (category: string) => {
    setSelectedCategory(category);
    setView('shop');
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Announcement Bar */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-medium tracking-wide">Complimentary Nationwide Shipping on Orders Over ₦100,000</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-pink-500" /> Nigeria Express Delivery
            </span>
            <a href="https://wa.me/2349031355416" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Support: +234 903 135 5416
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-pink-600 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div 
            onClick={() => setView('home')} 
            className="cursor-pointer text-center lg:text-left flex items-center gap-3"
          >
            <img 
              src="https://i.ibb.co/BHsL2Bcy/wealth-logo.png" 
              alt="Global Wealth Store" 
              className="h-11 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-[#6A1B9A]">
                GLOBAL WEALTH
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold -mt-1">
                Store &bull; Nigeria
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => { setView('home'); }} 
              className={`text-sm font-medium tracking-wide transition-colors pb-1 border-b-2 ${
                view === 'home' ? 'border-[#E91E63] text-[#E91E63]' : 'border-transparent text-neutral-700 hover:text-[#E91E63]'
              }`}
            >
              Home
            </button>
            
            <div className="relative group">
              <button 
                onClick={() => setView('shop')}
                onMouseEnter={() => setMegaMenuOpen(true)}
                className="flex items-center gap-1 text-sm font-medium tracking-wide text-neutral-700 hover:text-[#E91E63] py-2 transition-colors"
              >
                Collections <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:rotate-180 transition-transform" />
              </button>
            </div>

            <button 
              onClick={() => handleNavClick('women')} 
              className="text-sm font-medium tracking-wide text-neutral-700 hover:text-[#E91E63] transition-colors"
            >
              Women
            </button>

            <button 
              onClick={() => handleNavClick('men')} 
              className="text-sm font-medium tracking-wide text-neutral-700 hover:text-[#E91E63] transition-colors"
            >
              Men
            </button>

            <button 
              onClick={() => handleNavClick('shoes')} 
              className="text-sm font-medium tracking-wide text-neutral-700 hover:text-[#E91E63] transition-colors"
            >
              Shoes
            </button>

            <button 
              onClick={() => handleNavClick('bags')} 
              className="text-sm font-medium tracking-wide text-neutral-700 hover:text-[#E91E63] transition-colors"
            >
              Bags
            </button>

            <button 
              onClick={() => handleNavClick('accessories')} 
              className="text-sm font-medium tracking-wide text-neutral-700 hover:text-[#E91E63] transition-colors"
            >
              Accessories
            </button>

            <button 
              onClick={() => setView('contact')} 
              className={`text-sm font-medium tracking-wide transition-colors ${
                view === 'contact' ? 'text-[#E91E63]' : 'text-neutral-700 hover:text-[#E91E63]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-700 hover:text-[#E91E63] transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-neutral-700 hover:text-[#E91E63] transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#E91E63] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-700 hover:text-[#E91E63] transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#6A1B9A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => {
                if (user) {
                  setView('dashboard');
                } else {
                  setIsAuthOpen(true);
                }
              }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-neutral-200 hover:border-[#E91E63] transition-colors text-xs font-semibold text-neutral-800 whitespace-nowrap"
            >
              <User className="w-4 h-4 text-[#E91E63] shrink-0" />
              <span className="whitespace-nowrap">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onMouseLeave={() => setMegaMenuOpen(false)}
            className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-xl py-8 px-8 z-50"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8">
              <div>
                <h4 className="font-heading font-semibold text-[#6A1B9A] mb-3 text-sm tracking-wide uppercase">Women's Wealth</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><button onClick={() => handleNavClick('women')} className="hover:text-[#E91E63] transition-colors">Royal Abayas & Kaftans</button></li>
                  <li><button onClick={() => handleNavClick('women')} className="hover:text-[#E91E63] transition-colors">Bridal & Evening Gowns</button></li>
                  <li><button onClick={() => handleNavClick('women')} className="hover:text-[#E91E63] transition-colors">Designer Dresses</button></li>
                  <li><button onClick={() => handleNavClick('women')} className="hover:text-[#E91E63] transition-colors">Silk Blouses & Skirts</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-[#6A1B9A] mb-3 text-sm tracking-wide uppercase">Men's Tailoring</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><button onClick={() => handleNavClick('men')} className="hover:text-[#E91E63] transition-colors">Italian Wool Suits</button></li>
                  <li><button onClick={() => handleNavClick('men')} className="hover:text-[#E91E63] transition-colors">Bespoke Agbada Sets</button></li>
                  <li><button onClick={() => handleNavClick('men')} className="hover:text-[#E91E63] transition-colors">Executive Shirts</button></li>
                  <li><button onClick={() => handleNavClick('men')} className="hover:text-[#E91E63] transition-colors">Traditional Kaftans</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-[#6A1B9A] mb-3 text-sm tracking-wide uppercase">Shoes & Bags</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><button onClick={() => handleNavClick('shoes')} className="hover:text-[#E91E63] transition-colors">Italian Oxford Shoes</button></li>
                  <li><button onClick={() => handleNavClick('shoes')} className="hover:text-[#E91E63] transition-colors">Velvet Stilettos & Heels</button></li>
                  <li><button onClick={() => handleNavClick('bags')} className="hover:text-[#E91E63] transition-colors">Quilted Chain Handbags</button></li>
                  <li><button onClick={() => handleNavClick('bags')} className="hover:text-[#E91E63] transition-colors">Leather Weekender Duffles</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-[#6A1B9A] mb-3 text-sm tracking-wide uppercase">Accessories</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><button onClick={() => handleNavClick('accessories')} className="hover:text-[#E91E63] transition-colors">Luxury Swiss Watches</button></li>
                  <li><button onClick={() => handleNavClick('accessories')} className="hover:text-[#E91E63] transition-colors">Silk Ties & Cufflinks</button></li>
                  <li><button onClick={() => handleNavClick('accessories')} className="hover:text-[#E91E63] transition-colors">Designer Sunglasses</button></li>
                  <li><button onClick={() => handleNavClick('kids')} className="hover:text-[#E91E63] transition-colors">Kids Royal Wear</button></li>
                </ul>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-bold uppercase">Exclusive</span>
                  <h5 className="font-heading font-bold text-neutral-900 mt-2 text-sm">Abuja Showroom</h5>
                  <p className="text-xs text-neutral-600 mt-1">Book your fitting at Modern Market, Mpape, Abuja.</p>
                </div>
                <button 
                  onClick={() => { setView('contact'); setMegaMenuOpen(false); }}
                  className="mt-3 w-full bg-[#E91E63] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#D81B60] transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Dropdown Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            {/* Floating Dropdown Card */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 lg:hidden overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <img src="https://i.ibb.co/BHsL2Bcy/wealth-logo.png" alt="Global Wealth Store" className="h-7 w-auto object-contain" />
                  <span className="font-heading font-bold text-base text-[#6A1B9A]">Navigation Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-full bg-neutral-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-4 flex flex-col gap-2">
                <button 
                  onClick={() => { setView('home'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="text-left font-semibold text-sm text-neutral-900 py-3 px-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>🏠 Home</span>
                  <span className="text-xs text-neutral-400">&rarr;</span>
                </button>

                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => handleNavClick(cat.id)}
                    className="flex items-center gap-3 text-left py-2.5 px-3 rounded-xl hover:bg-neutral-50 border-b border-neutral-100 transition-colors group"
                  >
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="flex-1">
                      <span className="block font-heading font-bold text-sm text-neutral-900 group-hover:text-[#E91E63]">{cat.name}</span>
                      <span className="text-[10px] text-neutral-500">{cat.count}</span>
                    </div>
                    <span className="text-xs text-neutral-400">&rarr;</span>
                  </button>
                ))}

                <button 
                  onClick={() => { setSelectedCategory('all'); setView('shop'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="text-left font-bold text-sm text-[#E91E63] py-3 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 flex items-center justify-between mt-1"
                >
                  <span>✨ All Collections & Flash Sale</span>
                  <span>&rarr;</span>
                </button>
                <button 
                  onClick={() => { setView('contact'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="text-left font-semibold text-sm text-neutral-800 py-3 px-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between"
                >
                  <span>📍 Contact & Abuja Showroom</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-col gap-2.5">
                <button 
                  onClick={() => {
                    if (user) {
                      setView('dashboard');
                    } else {
                      setIsAuthOpen(true);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#6A1B9A] text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>{user ? 'My Customer Dashboard' : 'Sign In / Register'}</span>
                </button>
                <a 
                  href="https://wa.me/2349031355416" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Support (+234 903 135 5416)</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
