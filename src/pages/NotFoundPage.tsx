import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const NotFoundPage: React.FC = () => {
  const { setView, setIsSearchOpen } = useStore();

  return (
    <div className="min-h-screen bg-neutral-50 py-24 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-12 text-center space-y-6 border border-neutral-200"
      >
        <span className="font-heading font-extrabold text-7xl text-[#6A1B9A]">404</span>
        <h1 className="font-heading font-bold text-2xl text-neutral-900">Page Not Found</h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          The luxury fashion page you are looking for might have been moved, removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => setView('home')}
            className="w-full bg-[#E91E63] text-white py-3.5 rounded-xl font-semibold text-xs shadow-lg hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </button>
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-neutral-100 text-neutral-800 py-3.5 rounded-xl font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Search Global Wealth Store
          </button>
        </div>
      </motion.div>
    </div>
  );
};
