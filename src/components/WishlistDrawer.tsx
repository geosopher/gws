import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    formatNaira, 
    setView, 
    setActiveProduct 
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#E91E63] fill-[#E91E63]" />
              <h2 className="font-heading font-bold text-lg text-neutral-900">Your Wishlist ({wishlist.length})</h2>
            </div>
            <button 
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-pink-50 text-[#E91E63] rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-neutral-900">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">Tap the heart icon on any luxury item to save it for later.</p>
                <button 
                  onClick={() => { setIsWishlistOpen(false); setView('shop'); }}
                  className="mt-4 bg-[#6A1B9A] text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md hover:bg-[#581845] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product.id} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 relative group">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-xl shrink-0 cursor-pointer"
                    onClick={() => {
                      setActiveProduct(product);
                      setIsWishlistOpen(false);
                      setView('product-detail');
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#E91E63] font-bold uppercase">{product.brand}</span>
                      <h4 
                        className="font-heading font-semibold text-sm text-neutral-900 line-clamp-1 cursor-pointer hover:text-[#E91E63]"
                        onClick={() => {
                          setActiveProduct(product);
                          setIsWishlistOpen(false);
                          setView('product-detail');
                        }}
                      >
                        {product.name}
                      </h4>
                      <span className="font-heading font-bold text-sm text-neutral-900 mt-1 block">
                        {formatNaira(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => {
                          addToCart(product, product.sizes[0] || 'Standard', product.colors[0]?.name || 'Standard');
                          toggleWishlist(product);
                        }}
                        className="flex-1 bg-[#E91E63] text-white py-2 rounded-xl text-xs font-semibold hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};
