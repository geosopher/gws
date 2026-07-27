import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, formatNaira, setView, setActiveProduct } = useStore();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-2"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images */}
        <div className="p-6 bg-neutral-50 flex flex-col gap-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-neutral-200">
            <img 
              src={product.images[activeImage] || product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${activeImage === i ? 'border-[#E91E63]' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#E91E63] uppercase tracking-wider">{product.brand}</span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{product.rating} ({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-heading font-bold text-xl text-neutral-900">{product.name}</h2>
            <p className="text-xs text-neutral-400 mt-1">SKU: {product.sku}</p>

            <div className="flex items-center gap-3 my-4">
              <span className="font-heading font-bold text-2xl text-neutral-900">{formatNaira(product.price)}</span>
              {product.oldPrice && (
                <span className="text-sm text-neutral-400 line-through">{formatNaira(product.oldPrice)}</span>
              )}
              {product.discount && (
                <span className="bg-pink-100 text-[#E91E63] text-xs font-bold px-2.5 py-1 rounded-md">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-6">{product.description}</p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-neutral-800 uppercase mb-2">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === size 
                          ? 'border-[#E91E63] bg-pink-50 text-[#E91E63]' 
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-neutral-800 uppercase mb-2">Select Color: <span className="font-normal text-neutral-600">{selectedColor}</span></label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button 
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${selectedColor === color.name ? 'scale-110 border-neutral-900 shadow-md' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  addToCart(product, selectedSize || product.sizes[0], selectedColor || product.colors[0]?.name, quantity);
                  onClose();
                }}
                className="flex-1 bg-[#E91E63] text-white py-3 rounded-xl font-heading font-bold text-xs shadow-lg hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button 
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${inWishlist ? 'bg-pink-50 border-[#E91E63] text-[#E91E63]' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'}`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#E91E63]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Authentic Luxury Guarantee</span>
              <a 
                href={`https://wa.me/2349031355416?text=Hello%20Global%20Wealth%20Store,%20I%20am%20inquiring%20about%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku})`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-600 font-semibold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
