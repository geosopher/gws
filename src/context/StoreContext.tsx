import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, ViewState } from '../types';
import { PRODUCTS } from '../data/products';
import { PUBLIC_FOLDER_PRODUCTS } from '../data/publicProducts';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  image?: string;
}

export interface BrandItem {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  isActive: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  startDate: string;
  expiryDate: string;
  productId?: string;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'stock' | 'contact' | 'customer';
  isRead: boolean;
}

export interface StoreSettings {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  freeShippingThreshold: number;
  abujaDeliveryFee: number;
  lagosDeliveryFee: number;
  otherDeliveryFee: number;
}



interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeProduct: Product | null;
  setActiveProduct: (product: Product | null) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  formatNaira: (amount: number) => string;
  
  // Admin extensions
  categories: CategoryItem[];
  addCategory: (cat: CategoryItem) => void;
  updateCategory: (cat: CategoryItem) => void;
  deleteCategory: (id: string) => void;

  brands: BrandItem[];
  addBrand: (brand: BrandItem) => void;
  updateBrand: (brand: BrandItem) => void;
  deleteBrand: (id: string) => void;

  coupons: CouponItem[];
  addCoupon: (coupon: CouponItem) => void;
  updateCoupon: (coupon: CouponItem) => void;
  deleteCoupon: (id: string) => void;

  contactMessages: ContactMessage[];
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  storeSettings: StoreSettings;
  updateStoreSettings: (settings: StoreSettings) => void;
  syncPublicProducts: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setViewState] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gws_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure public products are included if not already present
      const existingIds = new Set(parsed.map((p: Product) => p.id));
      const missingPublic = PUBLIC_FOLDER_PRODUCTS.filter(p => !existingIds.has(p.id));
      return [...missingPublic, ...parsed];
    }
    return [...PRODUCTS, ...PUBLIC_FOLDER_PRODUCTS];
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gws_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gws_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gws_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'GWS-94821',
        date: '2026-07-20',
        items: [
          { product: PRODUCTS[0], selectedSize: 'UK 10 (M)', selectedColor: 'Royal Purple', quantity: 1 }
        ],
        totalAmount: 185000,
        shippingFee: 3500,
        status: 'Delivered',
        shippingAddress: {
          fullName: 'Aisha Bello',
          email: 'aisha.b@example.com',
          phone: '+234 803 123 4567',
          address: 'Plot 12, Maitama District',
          city: 'Abuja',
          state: 'Abuja FCT'
        },
        paymentMethod: 'Bank Transfer',
        paymentReference: 'TRF-88392019'
      }
    ];
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('gws_categories');
    return saved ? JSON.parse(saved) : [
      { id: 'cat-1', name: 'Women', slug: 'women', isActive: true, displayOrder: 1 },
      { id: 'cat-2', name: 'Men', slug: 'men', isActive: true, displayOrder: 2 },
      { id: 'cat-3', name: 'Shoes', slug: 'shoes', isActive: true, displayOrder: 3 },
      { id: 'cat-4', name: 'Bags', slug: 'bags', isActive: true, displayOrder: 4 },
      { id: 'cat-5', name: 'Accessories', slug: 'accessories', isActive: true, displayOrder: 5 },
      { id: 'cat-6', name: 'Kids', slug: 'kids', isActive: true, displayOrder: 6 }
    ];
  });

  const [brands, setBrands] = useState<BrandItem[]>(() => {
    const saved = localStorage.getItem('gws_brands');
    return saved ? JSON.parse(saved) : [
      { id: 'brand-1', name: 'Global Wealth Couture', isActive: true, description: 'Exclusive bespoke haute couture.' },
      { id: 'brand-2', name: 'Lagos Leather Co.', isActive: true, description: 'Handcrafted genuine leather bags & shoes.' },
      { id: 'brand-3', name: 'Abuja Bespoke', isActive: true, description: 'Tailored executive suits & traditional wear.' }
    ];
  });

  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    const saved = localStorage.getItem('gws_coupons');
    return saved ? JSON.parse(saved) : [
      { id: 'coup-1', code: 'WEALTH10', discountType: 'percentage', value: 10, minPurchase: 50000, expiryDate: '2026-12-31', isActive: true }
    ];
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('gws_messages');
    return saved ? JSON.parse(saved) : [
      { id: 'msg-1', name: 'Ibrahim Danjuma', email: 'ibrahim@example.com', phone: '+234 802 345 6789', message: 'Hello, I would like to inquire about bulk bespoke tailoring for our executive team in Abuja.', date: '2026-07-24', isRead: false }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('gws_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', title: 'New Order Received', message: 'Order #GWS-94821 placed by Aisha Bello for ₦185,000.', time: '2 hours ago', type: 'order', isRead: false },
      { id: 'notif-2', title: 'Low Stock Alert', message: 'Royal Silk Kaftan stock is down to 3 units.', time: '5 hours ago', type: 'stock', isRead: false }
    ];
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('gws_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Global Wealth Store',
      phone: '+234 903 135 5416',
      whatsapp: '+234 903 135 5416',
      email: 'support@globalwealthstore.ng',
      address: 'Modern Market, Mpape, Abuja, Nigeria',
      currency: '₦',
      freeShippingThreshold: 150000,
      abujaDeliveryFee: 2500,
      lagosDeliveryFee: 4500,
      otherDeliveryFee: 6500
    };
  });

  const syncPublicProducts = () => {
    setProducts(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newItems = PUBLIC_FOLDER_PRODUCTS.filter(p => !existingIds.has(p.id));
      if (newItems.length === 0) {
        showToast('All public folder products are already synced in the admin catalog!', 'info');
        return prev;
      }
      showToast(`Successfully synced ${newItems.length} products from Public folders!`);
      return [...newItems, ...prev];
    });
  };

  useEffect(() => {
    localStorage.setItem('gws_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gws_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('gws_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('gws_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('gws_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gws_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const addCategory = (cat: CategoryItem) => {
    setCategories(prev => [cat, ...prev]);
    showToast(`Category "${cat.name}" added.`);
  };

  const updateCategory = (cat: CategoryItem) => {
    setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
    showToast(`Category "${cat.name}" updated.`);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted.', 'info');
  };

  const addBrand = (brand: BrandItem) => {
    setBrands(prev => [brand, ...prev]);
    showToast(`Brand "${brand.name}" added.`);
  };

  const updateBrand = (brand: BrandItem) => {
    setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
    showToast(`Brand "${brand.name}" updated.`);
  };

  const deleteBrand = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    showToast('Brand deleted.', 'info');
  };

  const addCoupon = (coupon: CouponItem) => {
    setCoupons(prev => [coupon, ...prev]);
    showToast(`Coupon "${coupon.code}" created.`);
  };

  const updateCoupon = (coupon: CouponItem) => {
    setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
    showToast(`Coupon "${coupon.code}" updated.`);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon deleted.', 'info');
  };

  const markMessageRead = (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const deleteMessage = (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    showToast('Message deleted.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared.', 'info');
  };

  const updateStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
    showToast('Store settings saved successfully!');
  };

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gws_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('gws_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('gws_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('gws_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('gws_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gws_user');
    }
  }, [user]);

  const setView = (newView: ViewState) => {
    setViewState(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (product: Product, size: string, color: string, qty = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
    showToast(`Added ${product.name} to your luxury cart`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added ${product.name} to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    showToast(`Order ${orderId} status updated to ${status}`);
  };

  const formatNaira = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG');
  };

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        selectedCategory,
        setSelectedCategory,
        activeProduct,
        setActiveProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthOpen,
        setIsAuthOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        user,
        setUser,
        orders,
        addOrder,
        updateOrderStatus,
        formatNaira,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        brands,
        addBrand,
        updateBrand,
        deleteBrand,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        contactMessages,
        markMessageRead,
        deleteMessage,
        notifications,
        markNotificationRead,
        clearNotifications,
        storeSettings,
        updateStoreSettings,
        syncPublicProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
