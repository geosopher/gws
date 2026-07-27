import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FAQS } from '../data/products';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Instagram, 
  Facebook, 
  Send, 
  ChevronDown, 
  Sparkles, 
  Building2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been sent to our Abuja support team!');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#6A1B9A] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Global Wealth Store Support
          </span>
          <h1 className="font-heading font-extrabold text-4xl text-neutral-900">Get in Touch With Us</h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Visit our Abuja showroom or connect with our luxury fashion advisors via WhatsApp and social media.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 text-center space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-pink-100 text-[#E91E63] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">Abuja Showroom</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Block C, Flat 1-06 Modern Market, Mpape, Abuja FCT, Nigeria
            </p>
          </div>

          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 text-center space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">WhatsApp Hotline</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              +234 903 135 5416<br />
              Available Monday - Saturday (9am - 7pm)
            </p>
            <a 
              href="https://wa.me/2349031355416"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-emerald-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 text-center space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 text-[#6A1B9A] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Instagram className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">Social Media Handles</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              IG: @wealthconnection2<br />
              FB: Wealths Bags and Accessories<br />
              TikTok: @Global Wealth's Store
            </p>
          </div>

        </div>

        {/* Contact Form & Google Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">Send a Message</span>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl mt-1">Speak with Our Style Advisors</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Princess Chioma"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="chioma@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234 903 135 5416"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Message / Inquiry</label>
                <textarea 
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Inquire about bespoke sizing, bridal fittings, or wholesale orders..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#E91E63] hover:bg-[#D81B60] text-white py-4 rounded-xl font-heading font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

          {/* Interactive Abuja Map Simulation */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative bg-neutral-100 flex flex-col items-center justify-center text-center p-8">
              <div className="absolute inset-0 opacity-80">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80" 
                  alt="Abuja Map Location"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent" />
              </div>

              <div className="relative z-10 text-white space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E91E63] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl">Global Wealth Store Showroom</h3>
                <p className="text-xs text-neutral-200 max-w-sm mx-auto">
                  Block C, Flat 1-06 Modern Market, Mpape, Abuja FCT, Nigeria
                </p>
                <a 
                  href="https://maps.google.com/?q=Mpape+Modern+Market+Abuja" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-white text-neutral-900 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:bg-neutral-100 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-[#E91E63] uppercase tracking-widest">Help & Support</span>
            <h2 className="font-heading font-bold text-3xl text-neutral-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-neutral-50 border border-neutral-200 rounded-2xl overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left font-heading font-semibold text-sm sm:text-base text-neutral-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${openFaq === index ? 'rotate-180 text-[#E91E63]' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
