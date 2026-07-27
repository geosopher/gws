import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Phone, ArrowRight, Package, MapPin, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export const OrderSuccessPage: React.FC = () => {
  const { orders, setView, formatNaira } = useStore();
  const latestOrder = orders[0];

  return (
    <div className="min-h-screen bg-neutral-50 py-16 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 sm:p-12 text-center space-y-6 relative overflow-hidden border border-neutral-200"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Global Wealth Store &bull; Nigeria</span>
          <h1 className="font-heading font-extrabold text-3xl text-neutral-900 mt-2">Order Confirmed Successfully!</h1>
          <p className="text-xs text-neutral-500 mt-1">Thank you for your purchase. Your order is being processed by our team.</p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left space-y-1">
          <p className="font-bold">📌 Action Required for Bank Transfer:</p>
          <p className="text-emerald-700">Please send your payment receipt / transfer screenshot via WhatsApp to <strong>+234 903 135 5416</strong> with your Order ID ({latestOrder?.id}) for instant confirmation and dispatch!</p>
        </div>

        {latestOrder && (
          <div className="bg-neutral-50 p-6 rounded-2xl text-left space-y-4 border border-neutral-100">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200 text-xs">
              <div>
                <span className="text-neutral-400 block">Order ID:</span>
                <strong className="text-[#6A1B9A] font-bold text-sm">{latestOrder.id}</strong>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 block">Payment Method:</span>
                <strong className="text-neutral-900">{latestOrder.paymentMethod}</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping Address:</span>
                <span className="font-medium text-neutral-900">{latestOrder.shippingAddress.address}, {latestOrder.shippingAddress.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid:</span>
                <span className="font-heading font-bold text-neutral-900">{formatNaira(latestOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={() => setView('dashboard')}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-[#D4AF37]" /> View in Customer Dashboard
          </button>

          <a 
            href={`https://wa.me/2349031355416?text=Hello%20Global%20Wealth%20Store,%20I%20am%20following%20up%20on%20my%20order%20reference:%20${latestOrder?.id}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Track via WhatsApp (+234 903 135 5416)
          </a>
        </div>

        <div>
          <button 
            onClick={() => setView('home')}
            className="text-xs text-neutral-500 hover:text-[#E91E63] font-medium transition-colors"
          >
            &larr; Return to Homepage
          </button>
        </div>

      </motion.div>
    </div>
  );
};
