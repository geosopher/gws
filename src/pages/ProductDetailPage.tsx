import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Phone, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const { products, activeProduct, addToCart, toggleWishlist, isInWishlist, formatNaira, setView, showToast } = useStore();

  const product = activeProduct || products[0];
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const inWishlist = product ? isInWishlist(product.id) : false;
  const relatedProducts = product ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <button onClick={() => setView('home')} className="hover:text-neutral-900">Home</button>
          <span>/</span>
          <button onClick={() => setView('shop')} className="hover:text-neutral-900 capitalize">{product.category}</button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold truncate">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: Gallery */}
          <div className="space-y-4 sticky top-28">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-lg relative">
              <img 
                src={product.images[activeImage] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-[#E91E63] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  -{product.discount}% OFF
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${activeImage === i ? 'border-[#E91E63] shadow-md scale-105' : 'border-neutral-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#E91E63] uppercase tracking-wider">{product.brand}</span>
                <button 
                  onClick={handleShare}
                  className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100 flex items-center gap-1 text-xs"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900">{product.name}</h1>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewsCount} customer reviews)</span>
                </div>
                <span className="text-neutral-300">|</span>
                <span className="text-xs text-neutral-500 font-medium">SKU: <strong className="text-neutral-800">{product.sku}</strong></span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-neutral-200">
              <span className="font-heading font-extrabold text-3xl text-neutral-900">{formatNaira(product.price)}</span>
              {product.oldPrice && (
                <span className="text-base text-neutral-400 line-through">{formatNaira(product.oldPrice)}</span>
              )}
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
              </span>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase mb-2">Select Size / Fit</label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === size 
                          ? 'border-[#E91E63] bg-pink-50 text-[#E91E63] shadow-sm' 
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
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
              <div>
                <label className="block text-xs font-semibold text-neutral-800 uppercase mb-2">
                  Select Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button 
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color.name ? 'scale-110 border-neutral-900 shadow-md ring-2 ring-pink-500/30' : 'border-neutral-300'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 uppercase mb-2">Quantity</label>
              <div className="flex items-center border border-neutral-200 rounded-xl w-32 bg-neutral-50 overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-200"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-bold text-neutral-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                  className="flex-1 bg-[#E91E63] hover:bg-[#D81B60] text-white py-4 rounded-xl font-heading font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart — {formatNaira(product.price * quantity)}
                </button>

                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-xl border-2 transition-colors ${inWishlist ? 'bg-pink-50 border-[#E91E63] text-[#E91E63]' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'}`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-[#E91E63]' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <a 
                href={`https://wa.me/2349031355416?text=Hello%20Global%20Wealth%20Store,%20I%20want%20to%20order:%0A-%20Product:%20${encodeURIComponent(product.name)}%0A-%20SKU:%20${product.sku}%0A-%20Size:%20${encodeURIComponent(selectedSize)}%0A-%20Color:%20${encodeURIComponent(selectedColor)}%0A-%20Quantity:%20${quantity}%0A-%20Price:%20${formatNaira(product.price * quantity)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-heading font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" /> Instant WhatsApp Order (+234 903 135 5416)
              </a>
            </div>

            {/* Details & Specs */}
            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <h3 className="font-heading font-semibold text-sm text-neutral-900 uppercase">Product Details & Craftsmanship</h3>
              <ul className="space-y-2 text-xs text-neutral-600 list-disc pl-4">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-600">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <Truck className="w-5 h-5 mx-auto text-[#E91E63] mb-1" />
                <span>Nigeria Express</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#6A1B9A] mb-1" />
                <span>100% Guaranteed Authentic</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <RefreshCw className="w-5 h-5 mx-auto text-[#D4AF37] mb-1" />
                <span>7-Day Return & Exchange</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-neutral-200">
            <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
