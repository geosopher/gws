import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Phone, 
  Instagram, 
  Award,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { products, setView, setSelectedCategory, formatNaira } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const newArrivals = products.filter(p => p.isNew);
  const bestSellers = products.filter(p => p.isBestSeller);
  const editorsPicks = products.filter(p => p.isEditorPick);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Slider / Banner */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-45">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80" 
            alt="Global Wealth Luxury Fashion"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-[#D4AF37] text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Global Wealth Store &bull; Nigeria
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]">
              Redefining <span className="text-[#E91E63]">Luxury</span> Fashion & Elegance
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-light">
              Explore exquisite Italian tailoring, royal velvet abayas, designer handbags, and bespoke accessories crafted for high society across Nigeria and nationwide.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => { setSelectedCategory('all'); setView('shop'); }}
                className="bg-[#E91E63] hover:bg-[#D81B60] text-white font-heading font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-800 text-neutral-400 text-xs font-medium">
              <div>
                <span className="block text-white text-lg font-bold font-heading">₦100k+</span>
                <span>Free Nationwide Shipping</span>
              </div>
              <div>
                <span className="block text-white text-lg font-bold font-heading">100%</span>
                <span>Authentic Italian Leather</span>
              </div>
              <div>
                <span className="block text-white text-lg font-bold font-heading">Nigeria</span>
                <span>Express Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#6A1B9A] uppercase tracking-widest">Curated Categories</span>
          <h2 className="font-heading font-bold text-3xl text-neutral-900">Shop By Luxury Department</h2>
          <p className="text-xs text-neutral-500">Handcrafted masterpieces designed for men, women, kids, and elite lifestyle.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setView('shop'); }}
              className="group cursor-pointer bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#E91E63] transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center p-4"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-md border-2 border-white group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-heading font-semibold text-sm text-neutral-900 group-hover:text-[#E91E63] transition-colors">{cat.name}</h3>
              <span className="text-[10px] text-neutral-500 mt-1">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner with Countdown */}
      <section className="bg-gradient-to-r from-[#6A1B9A] to-[#4A148C] text-white py-16 my-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div className="space-y-2 text-center lg:text-left">
              <span className="bg-[#D4AF37] text-neutral-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                ⚡ Limited Time Flash Sale
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">Exclusive Price Drops on Designer Masterpieces</h2>
              <p className="text-neutral-300 text-xs sm:text-sm">Grab your favorite luxury items before stock runs out.</p>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3">
              <div className="bg-neutral-950/60 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/10">
                <span className="block font-heading font-bold text-2xl text-[#D4AF37]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-neutral-400">Hours</span>
              </div>
              <span className="text-xl font-bold text-white">:</span>
              <div className="bg-neutral-950/60 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/10">
                <span className="block font-heading font-bold text-2xl text-[#D4AF37]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-neutral-400">Mins</span>
              </div>
              <span className="text-xl font-bold text-white">:</span>
              <div className="bg-neutral-950/60 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/10">
                <span className="block font-heading font-bold text-2xl text-[#D4AF37]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[10px] uppercase text-neutral-400">Secs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-[#E91E63] uppercase tracking-widest">Just Dropped</span>
            <h2 className="font-heading font-bold text-3xl text-neutral-900">New Arrivals 2026</h2>
          </div>
          <button 
            onClick={() => { setSelectedCategory('all'); setView('shop'); }}
            className="flex items-center gap-2 text-xs font-bold text-[#6A1B9A] hover:text-[#E91E63] transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* Editor's Picks & Best Sellers */}
      <section className="bg-neutral-50 py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Elite Selections</span>
            <h2 className="font-heading font-bold text-3xl text-neutral-900">Editor's Picks & Best Sellers</h2>
            <p className="text-xs text-neutral-500">The most sought-after luxury fashion pieces worn by our elite clientele.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {editorsPicks.concat(bestSellers).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story & Abuja Showroom Banner */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-pink-50 text-[#E91E63] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" /> Global Wealth Store Heritage
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 leading-tight">
              Crafting Uncompromising Elegance in Abuja & Nigeria
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Headquartered at <strong>Block C, Flat 1-06 Modern Market, Mpape, Abuja FCT</strong>, Global Wealth Store has grown to become Nigeria's foremost luxury fashion destination. We bridge international high fashion with bespoke local elegance.
            </p>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Whether you are shopping for bespoke men's Italian wool suits, royal velvet abayas, Swarovski bridal gowns, or designer handbags, our commitment is absolute perfection.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="block font-heading font-bold text-2xl text-[#6A1B9A]">5,000+</span>
                <span className="text-xs text-neutral-500 mt-1 block">Satisfied VIP Clients Nationwide</span>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="block font-heading font-bold text-2xl text-[#D4AF37]">24h</span>
                <span className="text-xs text-neutral-500 mt-1 block">Express Abuja Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setView('contact')}
                className="bg-neutral-900 text-white font-heading font-semibold px-8 py-3.5 rounded-xl text-xs hover:bg-neutral-800 transition-colors shadow-md"
              >
                Visit Abuja Showroom & Contact
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80" 
                alt="Global Wealth Store Showroom"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-neutral-900">Verified Luxury Store</h4>
                  <p className="text-[11px] text-neutral-500">Mpape Modern Market, Abuja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="bg-neutral-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-xs font-bold text-[#E91E63] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Instagram className="w-4 h-4" /> Social Media & Community
          </span>
          <h2 className="font-heading font-bold text-3xl mt-2">Follow Our Style Chronicles</h2>
          <p className="text-neutral-400 text-xs mt-1">@wealthconnection2 &bull; Wealths Bags and Accessories &bull; @Global Wealth's Store</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {[
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80',
          ].map((img, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
              <img src={img} alt="Instagram Showcase" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

    </div>
  );
};
