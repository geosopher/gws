import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminModal: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, setIsAdminLoggedIn, setView, showToast } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAdminOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'global1234') {
      setIsAdminLoggedIn(true);
      setIsAdminOpen(false);
      setView('admin');
      showToast('Welcome to Global Wealth Store Admin Portal');
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid admin credentials. Use username: Admin, password: global1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAdminOpen(false)}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-neutral-900 text-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden z-10 border border-neutral-800"
      >
        <button 
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-2xl mx-auto flex items-center justify-center text-[#D4AF37] mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="font-heading text-xl font-bold tracking-wider text-white">
            ADMIN PORTAL
          </span>
          <span className="block text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mt-1">
            Global Wealth Store &bull; Secure Access
          </span>
          <h3 className="font-heading font-bold text-xl text-white mt-4">
            Restricted Management Area
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Enter administrator credentials to upload and manage products
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">Admin Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1.5">Admin Password</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3 w-4 h-4 text-neutral-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#D4AF37] text-neutral-950 py-3 rounded-xl font-heading font-bold text-sm shadow-lg hover:bg-[#c29b2f] transition-colors mt-2"
          >
            Access Admin Dashboard
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-500">
          🔒 Secure authentication for authorized staff only.
        </div>
      </motion.div>
    </div>
  );
};
