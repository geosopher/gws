import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { SupabaseProvider } from './context/SupabaseProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminModal } from './components/AdminModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const AppContent: React.FC = () => {
  const { view } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-pink-100 selection:text-pink-900">
      <Navbar />
      
      <main className="flex-1">
        {view === 'home' && <HomePage />}
        {view === 'shop' && <ShopPage />}
        {view === 'product-detail' && <ProductDetailPage />}
        {view === 'checkout' && <CheckoutPage />}
        {view === 'success' && <OrderSuccessPage />}
        {view === 'dashboard' && <DashboardPage />}
        {view === 'admin' && <AdminDashboardPage />}
        {view === 'contact' && <ContactPage />}
        {view === 'not-found' && <NotFoundPage />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <AuthModal />
      <AdminModal />
      <ToastContainer />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <SupabaseProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </SupabaseProvider>
  );
}
