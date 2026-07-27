import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/2349031355416"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 group"
    >
      <div className="absolute -top-10 right-0 bg-neutral-900 text-white text-[11px] font-medium px-3 py-1 rounded-xl shadow-lg opacity-0 group-hover:opacity-150 transition-opacity whitespace-nowrap pointer-events-none">
        Chat on WhatsApp 💬
      </div>
      <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </a>
  );
};
