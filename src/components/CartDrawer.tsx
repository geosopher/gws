import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotal, 
    setView, 
    formatNaira, 
    showToast 
  } = useStore();

  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const freeShippingThreshold = 100000;
  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - cartTotal, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.toUpperCase() === 'WEALTH10') {
      setDiscountApplied(true);
      showToast('Promo Coupon "WEALTH10" applied successfully! 10% discount added.');
    } else {
      showToast('Invalid coupon code. Try "WEALTH10"', 'error');
    }
  };

  const finalTotal = discountApplied ? cartTotal * 0.9 : cartTotal;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
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
              <ShoppingBag className="w-5 h-5 text-[#E91E63]" />
              <h2 className="font-heading font-bold text-lg text-neutral-900">Your Luxury Cart</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-neutral-50 px-6 py-3.5 border-b border-neutral-200">
            <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1.5">
              <span>{remainingForFreeShipping === 0 ? '🎉 You qualify for Free Nationwide Shipping!' : `Add ${formatNaira(remainingForFreeShipping)} more for Free Shipping`}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E91E63] h-full transition-all duration-500 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-pink-50 text-[#E91E63] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-neutral-900">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">Discover our exclusive collection of men's tailoring, women's couture, and luxury accessories.</p>
                <button 
                  onClick={() => { setIsCartOpen(false); setView('shop'); }}
                  className="mt-4 bg-[#6A1B9A] text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md hover:bg-[#581845] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 relative group">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#E91E63] font-bold uppercase">{item.product.brand}</span>
                      <h4 className="font-heading font-semibold text-sm text-neutral-900 line-clamp-1">{item.product.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>
                        <span>Color: <strong className="text-neutral-800">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden">
                        <button 
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-heading font-bold text-sm text-neutral-900">
                        {formatNaira(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(index)}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-white space-y-4">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Coupon code (e.g. WEALTH10)" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 uppercase placeholder-neutral-400 focus:outline-none focus:border-pink-500"
                />
                <button 
                  type="submit"
                  className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Apply
                </button>
              </form>

              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatNaira(cartTotal)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-pink-600 font-medium">
                    <span>Special Discount (10%)</span>
                    <span>-{formatNaira(cartTotal * 0.1)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-600">
                    {remainingForFreeShipping === 0 ? 'FREE' : formatNaira(3500)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-heading font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="text-[#6A1B9A]">{formatNaira(finalTotal + (remainingForFreeShipping === 0 ? 0 : 3500))}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setView('checkout');
                  }}
                  className="w-full bg-[#E91E63] text-white py-3.5 rounded-xl font-heading font-bold text-sm shadow-lg hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure Bank Transfer & WhatsApp Verification</span>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
