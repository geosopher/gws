import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-neutral-900/95 text-white border-pink-500/30'
                : toast.type === 'error'
                ? 'bg-red-950/95 text-red-100 border-red-500/30'
                : 'bg-neutral-900/95 text-white border-purple-500/30'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-pink-500 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
