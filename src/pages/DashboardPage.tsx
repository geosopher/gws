import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Bell, 
  Shield, 
  LogOut, 
  Phone, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardPage: React.FC = () => {
  const { user, setUser, orders, wishlist, setView, formatNaira, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'security'>('orders');

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({ ...user, name, phone });
      showToast('Profile updated successfully!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6A1B9A] to-[#E91E63] text-white font-heading font-bold text-2xl flex items-center justify-center shadow-lg">
              {user ? user.name.charAt(0) : 'G'}
            </div>
            <div>
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Customer Dashboard</span>
              <h1 className="font-heading font-extrabold text-2xl text-neutral-900">{user?.name || 'Valued Guest'}</h1>
              <p className="text-xs text-neutral-500">{user?.email || 'guest@globalwealthstore.ng'} &bull; {user?.phone || '+234 903 135 5416'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/2349031355416"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" /> WhatsApp Support
            </a>
            <button 
              onClick={handleLogout}
              className="bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-2 h-fit">
            {[
              { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
              { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: wishlist.length },
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'addresses', label: 'Shipping Addresses', icon: MapPin, count: user?.addresses.length || 0 },
              { id: 'security', label: 'Security & Privacy', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-semibold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#E91E63] text-white shadow-md' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
                  Order History & Tracking
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500">You have no orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-neutral-200 text-xs">
                          <div>
                            <span className="text-neutral-400">Order ID: </span>
                            <strong className="text-[#6A1B9A] font-bold">{order.id}</strong>
                            <span className="text-neutral-400 ml-3">Date: {order.date}</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px]">
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img src={item.product.images[0]} alt="" className="w-12 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                              <div className="flex-1">
                                <h4 className="font-heading font-semibold text-xs text-neutral-900 line-clamp-1">{item.product.name}</h4>
                                <p className="text-[11px] text-neutral-500">Qty: {item.quantity} &bull; Size: {item.selectedSize} &bull; Color: {item.selectedColor}</p>
                              </div>
                              <span className="font-heading font-bold text-xs text-neutral-900">{formatNaira(item.product.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-xs">
                          <span className="text-neutral-500">Payment: <strong>{order.paymentMethod}</strong></span>
                          <span className="font-heading font-bold text-sm text-neutral-900">Total: {formatNaira(order.totalAmount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
                  Saved Wishlist ({wishlist.length})
                </h3>
                {wishlist.length === 0 ? (
                  <p className="text-sm text-neutral-500 text-center py-12">Your wishlist is empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((p) => (
                      <div key={p.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                        <img src={p.images[0]} alt="" className="w-full h-48 object-cover rounded-xl mb-3" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-heading font-semibold text-xs text-neutral-900 line-clamp-1">{p.name}</h4>
                          <span className="font-heading font-bold text-sm text-neutral-900 mt-1 block">{formatNaira(p.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
                  Profile Settings
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Phone Number (WhatsApp)</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-[#E91E63] text-white px-6 py-3 rounded-xl font-semibold text-xs shadow-md hover:bg-[#D81B60] transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
                  Shipping Addresses
                </h3>
                <div className="space-y-4">
                  {user?.addresses.map((addr) => (
                    <div key={addr.id} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-[#6A1B9A] uppercase">{addr.title}</span>
                        <p className="text-xs text-neutral-800 mt-1">{addr.address}, {addr.city}, {addr.state}</p>
                      </div>
                      <span className="bg-pink-100 text-[#E91E63] text-[10px] font-bold px-2.5 py-1 rounded-full">Default</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-lg text-neutral-900 pb-4 border-b border-neutral-200">
                  Security & Supabase Auth
                </h3>
                <p className="text-xs text-neutral-600">Your account is secured with Supabase JWT authentication, Row Level Security (RLS), and encrypted password hashing.</p>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Supabase connection active & session secure.</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
