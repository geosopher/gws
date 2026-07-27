import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setView, setActiveProduct, setSelectedCategory, formatNaira } = useStore();
  const [query, setQuery] = useState('');

  const filteredProducts = query.trim() === '' 
    ? [] 
    : PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      );

  const popularSearches = ['Royal Abaya', 'Italian Wool Suit', 'Velvet Stilettos', 'Quilted Handbag', 'Swiss Watch', 'Agbada Set'];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md"
      />

      <div className="relative min-h-screen px-4 py-12 flex items-start justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pb-6 border-b border-neutral-200">
            <Search className="w-6 h-6 text-[#E91E63]" />
            <input 
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search men's tailoring, women's couture, shoes, bags..."
              className="w-full text-lg font-heading font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
          </div>

          {/* Popular searches when query is empty */}
          {query.trim() === '' && (
            <div className="py-8 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Popular Wealth Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, i) => (
                    <button 
                      key={i}
                      onClick={() => setQuery(term)}
                      className="bg-neutral-100 hover:bg-pink-50 hover:text-[#E91E63] text-neutral-700 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Quick Categories</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'women', label: "Women's Fashion" },
                    { id: 'men', label: "Men's Fashion" },
                    { id: 'shoes', label: "Luxury Shoes" },
                    { id: 'bags', label: "Bags & Luggage" },
                    { id: 'accessories', label: "Accessories" },
                    { id: 'kids', label: "Kids Royal Wear" },
                  ].map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setView('shop');
                        setIsSearchOpen(false);
                      }}
                      className="p-3 bg-neutral-50 hover:bg-neutral-900 hover:text-white rounded-xl text-xs font-semibold text-neutral-800 transition-all text-left flex items-center justify-between group"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim() !== '' && (
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Search Results ({filteredProducts.length})
              </h4>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500 text-sm">No luxury items found matching "{query}".</p>
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedCategory('all');
                      setView('shop');
                    }}
                    className="mt-4 text-[#E91E63] text-xs font-semibold hover:underline"
                  >
                    Browse all collections &rarr;
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => {
                        setActiveProduct(product);
                        setIsSearchOpen(false);
                        setView('product-detail');
                      }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50 hover:bg-pink-50/50 cursor-pointer transition-colors border border-neutral-100"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-14 h-16 object-cover rounded-xl shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] text-[#E91E63] font-bold uppercase">{product.brand}</span>
                        <h5 className="font-heading font-semibold text-sm text-neutral-900">{product.name}</h5>
                        <span className="font-heading font-bold text-xs text-neutral-700">{formatNaira(product.price)}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 mr-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
