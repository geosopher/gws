import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, ArrowRight, Truck, CheckCircle2, Lock, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, formatNaira, addOrder, setView, showToast, user, storeSettings } = useStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses[0]?.address || '',
    city: 'Abuja',
    state: 'Abuja FCT',
    notes: ''
  });

  const [deliveryMode, setDeliveryMode] = useState<'home-delivery' | 'store-pickup'>('home-delivery');
  const [selectedState, setSelectedState] = useState('Abuja FCT');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'WhatsApp Order'>('Bank Transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping fee calculation by state or free for store pickup
  const getShippingFee = (state: string) => {
    if (deliveryMode === 'store-pickup') return 0;
    if (state === 'Abuja FCT') return storeSettings.abujaDeliveryFee ?? 2500;
    if (state === 'Lagos State') return storeSettings.lagosDeliveryFee ?? 4500;
    return storeSettings.otherDeliveryFee ?? 6500;
  };

  const freeThreshold = storeSettings.freeShippingThreshold ?? 150000;
  const shippingFee = deliveryMode === 'store-pickup' ? 0 : (cartTotal >= freeThreshold ? 0 : getShippingFee(selectedState));
  const totalAmount = cartTotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = {
        id: 'GWS-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toISOString().split('T')[0],
        items: [...cart],
        totalAmount,
        shippingFee,
        status: 'Confirmed' as const,
        shippingAddress: {
          ...formData,
          state: selectedState
        },
        paymentMethod,
        paymentReference: paymentReference || 'TRF-' + Math.floor(10000000 + Math.random() * 90000000)
      };

      addOrder(newOrder);
      setIsSubmitting(false);
      showToast('Order placed successfully! Thank you for choosing Global Wealth Store.');
      setView('success');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-24 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full space-y-4">
          <h2 className="font-heading font-bold text-xl text-neutral-900">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-500">Please add luxury items to your cart before proceeding to checkout.</p>
          <button 
            onClick={() => setView('shop')}
            className="w-full bg-[#E91E63] text-white py-3 rounded-xl font-semibold text-xs shadow-md"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#E91E63] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Secure Checkout
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-neutral-900">Complete Your Luxury Order</h1>
          <p className="text-xs text-neutral-500">Global Wealth Store &bull; Abuja FCT, Nigeria</p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base text-neutral-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-pink-100 text-[#E91E63] flex items-center justify-center text-xs">1</span>
                Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Princess Chioma Adebayo"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="chioma@example.com"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">WhatsApp Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 903 135 5416"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                />
              </div>
            </div>

            {/* Shipping / Delivery Option */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base text-neutral-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#6A1B9A] text-white flex items-center justify-center text-xs">2</span>
                Delivery Method & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setDeliveryMode('home-delivery')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${deliveryMode === 'home-delivery' ? 'border-[#6A1B9A] bg-purple-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <Truck className={`w-5 h-5 mt-0.5 ${deliveryMode === 'home-delivery' ? 'text-[#6A1B9A]' : 'text-neutral-500'}`} />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-neutral-900">Home Delivery</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Delivered to your address (Fee based on location).</p>
                  </div>
                </div>

                <div 
                  onClick={() => setDeliveryMode('store-pickup')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${deliveryMode === 'store-pickup' ? 'border-emerald-600 bg-emerald-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <Building2 className={`w-5 h-5 mt-0.5 ${deliveryMode === 'store-pickup' ? 'text-emerald-600' : 'text-neutral-500'}`} />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-neutral-900">Physical Store Pickup</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Visit our Mpape Abuja showroom &bull; <strong className="text-emerald-600">Free (₦0)</strong></p>
                  </div>
                </div>
              </div>

              {deliveryMode === 'home-delivery' && (
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Street Address</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Block C, Flat 1-06 Modern Market, Mpape"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">City / Town</label>
                      <input 
                        type="text" 
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Abuja"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">State in Nigeria</label>
                      <select 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                      >
                        <option value="Abuja FCT">Abuja FCT (₦2,500)</option>
                        <option value="Lagos State">Lagos State (₦4,500)</option>
                        <option value="Rivers State">Rivers State (₦6,500)</option>
                        <option value="Kano State">Kano State (₦6,500)</option>
                        <option value="Oyo State">Oyo State (₦6,500)</option>
                        <option value="Other State">Other Nigerian State (₦6,500)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {deliveryMode === 'store-pickup' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-bold">Showroom Pickup Selected (Free)</p>
                  <p className="mt-0.5 text-emerald-700">Location: Block C, Flat 1-06 Modern Market, Mpape, Abuja FCT. No delivery fee incurred.</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Delivery / Pickup Notes (Optional)</label>
                <textarea 
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base text-neutral-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center text-xs font-bold">3</span>
                Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${paymentMethod === 'Bank Transfer' ? 'border-[#E91E63] bg-pink-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <Building2 className={`w-5 h-5 mt-0.5 ${paymentMethod === 'Bank Transfer' ? 'text-[#E91E63]' : 'text-neutral-500'}`} />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-neutral-900">Direct Bank Transfer</h4>
                    <p className="text-xs text-neutral-500 mt-1">Transfer directly to our official corporate bank account.</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('WhatsApp Order')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${paymentMethod === 'WhatsApp Order' ? 'border-emerald-600 bg-emerald-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <Truck className={`w-5 h-5 mt-0.5 ${paymentMethod === 'WhatsApp Order' ? 'text-emerald-600' : 'text-neutral-500'}`} />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-neutral-900">WhatsApp Support Order</h4>
                    <p className="text-xs text-neutral-500 mt-1">Send payment receipt directly to +2349031355416.</p>
                  </div>
                </div>
              </div>

              {paymentMethod === 'Bank Transfer' && (
                <div className="p-5 bg-neutral-900 text-white rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs text-[#D4AF37] font-semibold uppercase">
                    <span>Official Corporate Account</span>
                    <span>Global Wealth Store</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-400 block">Bank Name:</span>
                      <strong className="text-white">Guaranty Trust Bank (GTB)</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Account Number:</span>
                      <strong className="text-[#D4AF37] text-sm">0123456789</strong>
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-800 rounded-xl border border-neutral-700 text-xs text-emerald-400 font-medium">
                    📌 Note: Please send your payment receipt via WhatsApp (+234 903 135 5416) for instant order confirmation and dispatch!
                  </div>
                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Enter Transfer Reference Number or Receipt ID</label>
                    <input 
                      type="text" 
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. TRF-99283019"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-heading font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
              Order Summary ({cart.length} items)
            </h3>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img src={item.product.images[0]} alt="" className="w-14 h-16 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold text-xs text-neutral-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity} &bull; Size: {item.selectedSize}</p>
                  </div>
                  <span className="font-heading font-bold text-xs text-neutral-900">{formatNaira(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatNaira(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee ({selectedState})</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatNaira(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-heading font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="text-[#6A1B9A] text-base">{formatNaira(totalAmount)}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white py-4 rounded-xl font-heading font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Place Secure Order ({formatNaira(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted Checkout & Guaranteed Delivery</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
