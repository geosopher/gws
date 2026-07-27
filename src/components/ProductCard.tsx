import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist, setView, setActiveProduct, formatNaira } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    setActiveProduct(product);
    setView('product-detail');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-pink-500/30 transition-all duration-300 hover:shadow-xl flex flex-col"
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] bg-neutral-100 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <img 
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount && (
            <span className="bg-[#E91E63] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              -{product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#6A1B9A] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#D4AF37] text-neutral-950 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all z-10 ${
            inWishlist 
              ? 'bg-[#E91E63] text-white' 
              : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-[#E91E63]'
          }`}
          aria-label="Wishlist Toggle"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
              else {
                setActiveProduct(product);
                setView('product-detail');
              }
            }}
            className="flex-1 bg-white/95 backdrop-blur-md text-neutral-900 py-2.5 px-3 rounded-xl font-semibold text-xs shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, product.sizes[0] || 'Standard', product.colors[0]?.name || 'Standard');
            }}
            className="bg-[#E91E63] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#D81B60] transition-colors"
            aria-label="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="uppercase tracking-wider font-medium">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={handleCardClick}
            className="font-heading font-semibold text-neutral-900 text-sm line-clamp-2 hover:text-[#E91E63] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base text-neutral-900">
              {formatNaira(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatNaira(product.oldPrice)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        </div>
      </div>
    </motion.div>
  );
};
