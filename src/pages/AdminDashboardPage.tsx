import React, { useState } from 'react';
import { useStore, BrandItem, CategoryItem, CouponItem } from '../context/StoreContext';
import { Product, Order } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Award, 
  Box, 
  ShoppingBag, 
  Users, 
  Tag, 
  LayoutTemplate, 
  Image as ImageIcon, 
  MessageSquare, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Check, 
  X, 
  Eye, 
  Phone, 
  MapPin, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    setIsAdminLoggedIn, 
    setView, 
    showToast, 
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
    syncPublicProducts
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'brands'
    | 'inventory'
    | 'orders'
    | 'customers'
    | 'coupons'
    | 'homepage'
    | 'media'
    | 'contact'
    | 'reports'
    | 'settings'
    | 'notifications'
  >('dashboard');

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Extended product form states
  const [imagesInput, setImagesInput] = useState('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80');
  const [colorsInput, setColorsInput] = useState('Gold:#D4AF37, Black:#111111');
  const [sizesInput, setSizesInput] = useState('');

  // Brand Modal States
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [brandFormName, setBrandFormName] = useState('');
  const [brandFormDesc, setBrandFormDesc] = useState('');
  const [brandFormWebsite, setBrandFormWebsite] = useState('');

  // Category Modal States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catFormName, setCatFormName] = useState('');

  // Coupon Modal States
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [couponFormCode, setCouponFormCode] = useState('');
  const [couponFormValue, setCouponFormValue] = useState('');
  const [couponFormMin, setCouponFormMin] = useState('20000');
  const [couponFormStart, setCouponFormStart] = useState('2026-07-25');
  const [couponFormExpiry, setCouponFormExpiry] = useState('2026-12-31');
  const [couponFormProductId, setCouponFormProductId] = useState('all');

  // Form state for new / edited product
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'women' | 'men' | 'kids' | 'shoes' | 'bags' | 'accessories'>('women');
  const [gender, setGender] = useState<'women' | 'men' | 'unisex' | 'kids'>('women');
  const [brand, setBrand] = useState('Global Wealth Couture');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('15');
  const [sku, setSku] = useState('');
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setCategory('women');
    setGender('women');
    setBrand('Global Wealth Couture');
    setPrice('');
    setOldPrice('');
    setImagesInput('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80');
    setColorsInput('Gold:#D4AF37, Black:#111111');
    setSizesInput('');
    setDescription('');
    setStock('15');
    setSku('GWS-' + Math.floor(1000 + Math.random() * 9000));
    setIsFlashSale(false);
    setIsNewArrival(true);
    setEditingProduct(null);
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setGender(p.gender);
    setBrand(p.brand);
    setPrice(p.price.toString());
    setOldPrice(p.oldPrice ? p.oldPrice.toString() : '');
    setImagesInput(p.images ? p.images.join(', ') : '');
    setColorsInput(p.colors ? p.colors.map(c => `${c.name}:${c.hex}`).join(', ') : 'Gold:#D4AF37');
    setSizesInput(p.sizes ? p.sizes.join(', ') : '');
    setDescription(p.description);
    setStock(p.stock.toString());
    setSku(p.sku);
    setIsFlashSale(!!p.isFlashSale);
    setIsNewArrival(!!p.isNew);
    setIsAddingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedImages = imagesInput 
      ? imagesInput.split(',').map(s => s.trim()).filter(Boolean) 
      : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'];

    const parsedColors = colorsInput 
      ? colorsInput.split(',').map(item => {
          const parts = item.split(':').map(s => s.trim());
          return { name: parts[0] || 'Standard', hex: parts[1] || '#111111' };
        })
      : [{ name: 'Default', hex: '#111111' }];

    let parsedSizes = sizesInput 
      ? sizesInput.split(',').map(s => s.trim()).filter(Boolean) 
      : [];

    if (parsedSizes.length === 0) {
      if (name.toLowerCase().includes('dress') || category === 'women') {
        parsedSizes = ['UK 6 / XS', 'UK 8 / S', 'UK 10 / M', 'UK 12 / L', 'UK 14 / XL'];
      } else {
        parsedSizes = ['S', 'M', 'L', 'XL'];
      }
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : 'gws-' + Math.random().toString(36).substring(2, 9),
      name,
      category,
      gender,
      brand,
      price: parseFloat(price) || 0,
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      images: parsedImages,
      description,
      details: ['Premium quality luxury item', 'Handcrafted details', 'Exclusive release'],
      sizes: parsedSizes,
      colors: parsedColors,
      stock: parseInt(stock) || 10,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      isNew: isNewArrival,
      isFlashSale: isFlashSale,
      sku: sku || ('GWS-' + Math.floor(1000 + Math.random() * 9000))
    };

    if (editingProduct) {
      updateProduct(productData);
      showToast(`Product "${name}" updated successfully!`);
    } else {
      addProduct(productData);
      showToast(`Product "${name}" uploaded successfully!`);
    }

    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  // Brand Management Handlers
  const handleOpenAddBrand = () => {
    setEditingBrand(null);
    setBrandFormName('');
    setBrandFormDesc('');
    setBrandFormWebsite('');
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (b: BrandItem) => {
    setEditingBrand(b);
    setBrandFormName(b.name);
    setBrandFormDesc(b.description || '');
    setBrandFormWebsite(b.website || '');
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandFormName.trim()) return;
    const brandData = {
      id: editingBrand ? editingBrand.id : 'brand-' + Date.now(),
      name: brandFormName,
      description: brandFormDesc || 'Luxury designer brand',
      website: brandFormWebsite,
      isActive: true
    };
    if (editingBrand) {
      updateBrand(brandData);
      showToast(`Brand "${brandFormName}" updated.`);
    } else {
      addBrand(brandData);
    }
    setIsBrandModalOpen(false);
  };

  // Category Management Handlers
  const handleOpenAddCat = () => {
    setEditingCat(null);
    setCatFormName('');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (c: CategoryItem) => {
    setEditingCat(c);
    setCatFormName(c.name);
    setIsCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;
    const catData = {
      id: editingCat ? editingCat.id : 'cat-' + Date.now(),
      name: catFormName,
      slug: catFormName.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
      displayOrder: editingCat ? editingCat.displayOrder : categories.length + 1
    };
    if (editingCat) {
      updateCategory(catData);
      showToast(`Category "${catFormName}" updated.`);
    } else {
      addCategory(catData);
    }
    setIsCatModalOpen(false);
  };

  // Coupon Management Handlers
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponFormCode('');
    setCouponFormValue('');
    setCouponFormMin('20000');
    setCouponFormStart('2026-07-25');
    setCouponFormExpiry('2026-12-31');
    setCouponFormProductId('all');
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (cp: CouponItem) => {
    setEditingCoupon(cp);
    setCouponFormCode(cp.code);
    setCouponFormValue(cp.value.toString());
    setCouponFormMin(cp.minPurchase.toString());
    setCouponFormStart(cp.startDate || '2026-07-25');
    setCouponFormExpiry(cp.expiryDate || '2026-12-31');
    setCouponFormProductId(cp.productId || 'all');
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponFormCode.trim() || !couponFormValue) return;
    const couponData: CouponItem = {
      id: editingCoupon ? editingCoupon.id : 'coup-' + Date.now(),
      code: couponFormCode.toUpperCase(),
      discountType: 'percentage',
      value: parseFloat(couponFormValue) || 10,
      minPurchase: parseFloat(couponFormMin) || 0,
      startDate: couponFormStart,
      expiryDate: couponFormExpiry,
      productId: couponFormProductId,
      isActive: true
    };
    if (editingCoupon) {
      updateCoupon(couponData);
    } else {
      addCoupon(couponData);
    }
    setIsCouponModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast(`Product "${name}" deleted.`);
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setView('home');
    showToast('Logged out of Admin Portal.', 'info');
  };

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 flex flex-col md:flex-row">
      
      {/* Sidebar - Organized as requested */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-6 shrink-0 space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block">Global Wealth</span>
            <h2 className="font-heading font-extrabold text-sm text-neutral-900">Admin Panel</h2>
          </div>
        </div>

        <nav className="space-y-6 text-xs font-medium">
          <div>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold px-3 block mb-2">Catalog</span>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Package className="w-4 h-4" /> Products ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Layers className="w-4 h-4" /> Categories
            </button>
            <button 
              onClick={() => setActiveTab('brands')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'brands' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Award className="w-4 h-4" /> Brands
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'inventory' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Box className="w-4 h-4" /> Inventory
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold px-3 block mb-2">Sales</span>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'customers' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Users className="w-4 h-4" /> Customers
            </button>
            <button 
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'coupons' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Tag className="w-4 h-4" /> Coupons
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold px-3 block mb-2">Content</span>
            <button 
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'homepage' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <LayoutTemplate className="w-4 h-4" /> Homepage Manager
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'media' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <ImageIcon className="w-4 h-4" /> Media Library
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${activeTab === 'contact' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <MessageSquare className="w-4 h-4" /> Contact Messages ({contactMessages.filter(m => !m.isRead).length})
            </button>
          </div>

          <div>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'reports' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <FileText className="w-4 h-4" /> Reports
            </button>
          </div>

          <div>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>

          <div>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === 'notifications' ? 'bg-[#D4AF37] text-white font-bold shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Bell className="w-4 h-4" /> Notifications ({notifications.filter(n => !n.isRead).length})
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header with Global Search */}
        <header className="bg-white border-b border-neutral-200 py-4 px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Global search products, SKU, orders, customers..." 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenAdd}
              className="bg-[#D4AF37] hover:bg-[#c29b2f] text-white font-heading font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Upload Product
            </button>
            <button 
              onClick={handleLogout}
              className="bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-neutral-200"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">Executive Overview</span>
                <h1 className="font-heading font-extrabold text-2xl text-neutral-900 mt-1">Dashboard & Analytics</h1>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Total Revenue</p>
                    <h3 className="text-xl font-heading font-extrabold text-emerald-600 mt-1">{formatNaira(totalRevenue)}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Total Orders</p>
                    <h3 className="text-2xl font-heading font-extrabold text-neutral-900 mt-1">{orders.length}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Pending Orders</p>
                    <h3 className="text-2xl font-heading font-extrabold text-amber-600 mt-1">{pendingOrdersCount}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">Total Products</p>
                    <h3 className="text-2xl font-heading font-extrabold text-neutral-900 mt-1">{products.length}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl text-[#D4AF37]">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-500">Low Stock Items</span>
                    <h4 className="text-lg font-bold text-amber-600 mt-0.5">{lowStockCount} Products</h4>
                  </div>
                  <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">⚠️</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-500">Out of Stock Items</span>
                    <h4 className="text-lg font-bold text-red-600 mt-0.5">{outOfStockCount} Products</h4>
                  </div>
                  <span className="p-2.5 bg-red-50 text-red-600 rounded-xl">❌</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-500">Delivered Orders</span>
                    <h4 className="text-lg font-bold text-emerald-600 mt-0.5">{deliveredOrdersCount} Orders</h4>
                  </div>
                  <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">✅</span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8">
                <h3 className="font-heading font-bold text-lg text-neutral-900 mb-6">Recent Customer Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-neutral-500">No orders recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-neutral-50">
                            <td className="py-3 font-mono font-bold">{o.id}</td>
                            <td className="py-3">{o.shippingAddress.fullName}</td>
                            <td className="py-3 font-bold text-[#D4AF37]">{formatNaira(o.totalAmount)}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => { setSelectedOrder(o); setActiveTab('orders'); }}
                                className="text-xs text-neutral-700 hover:text-[#D4AF37] font-semibold"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Product Catalog Management</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Manage luxury items, pricing, inventory stock and tags</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={syncPublicProducts}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-neutral-200"
                  >
                    <RefreshCw className="w-4 h-4 text-[#D4AF37]" /> Sync Public Folder Products
                  </button>
                  <button 
                    onClick={handleOpenAdd}
                    className="bg-[#D4AF37] hover:bg-[#c29b2f] text-white font-heading font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add New Product
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg shrink-0 border border-neutral-200" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-heading font-bold text-neutral-900 line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-neutral-500">{p.brand}</span>
                          </div>
                        </td>
                        <td className="py-4 uppercase tracking-wider text-neutral-700 font-medium">{p.category}</td>
                        <td className="py-4 text-neutral-500 font-mono">{p.sku}</td>
                        <td className="py-4 font-heading font-bold text-[#D4AF37]">{formatNaira(p.price)}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 bg-neutral-100 hover:bg-red-100 text-neutral-700 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Category Management</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Organize store collections</p>
                </div>
                <button 
                  onClick={handleOpenAddCat}
                  className="bg-[#D4AF37] hover:bg-[#c29b2f] text-white font-heading font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categories.map(c => (
                  <div key={c.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">{c.name}</h4>
                      <span className="text-[10px] text-neutral-500">Slug: {c.slug}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEditCat(c)}
                        className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete category "${c.name}"?`)) {
                            deleteCategory(c.id);
                            showToast(`Category "${c.name}" deleted.`);
                          }
                        }}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-lg"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BRANDS TAB */}
          {activeTab === 'brands' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Brand Management</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Manage luxury designer brands</p>
                </div>
                <button 
                  onClick={handleOpenAddBrand}
                  className="bg-[#D4AF37] hover:bg-[#c29b2f] text-white font-heading font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Brand
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {brands.map(b => (
                  <div key={b.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">{b.name}</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{b.description || 'Luxury fashion brand'}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleOpenEditBrand(b)}
                        className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg"
                        title="Edit Brand"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete brand "${b.name}"?`)) {
                            deleteBrand(b.id);
                            showToast(`Brand "${b.name}" deleted.`);
                          }
                        }}
                        className="p-2 text-neutral-400 hover:text-red-600 rounded-lg"
                        title="Delete Brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Dedicated Inventory Center</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Monitor stock counts and adjust availability instantly</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Stock Level</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Quick Stock Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-neutral-50">
                        <td className="py-4 flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-9 h-11 object-cover rounded-lg border border-neutral-200" referrerPolicy="no-referrer" />
                          <span className="font-bold text-neutral-900">{p.name}</span>
                        </td>
                        <td className="py-4 font-mono text-neutral-500">{p.sku}</td>
                        <td className="py-4 font-heading font-bold text-neutral-900">{p.stock} units</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {p.stock > 5 ? 'In Stock' : 'Low Stock'}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button 
                            onClick={() => {
                              const updated = { ...p, stock: p.stock + 10 };
                              updateProduct(updated);
                              showToast(`Added 10 units to ${p.name}`);
                            }}
                            className="px-3 py-1 bg-neutral-100 hover:bg-[#D4AF37] hover:text-white rounded-lg font-bold transition-colors"
                          >
                            +10
                          </button>
                          <button 
                            onClick={() => {
                              const newStock = Math.max(0, p.stock - 5);
                              const updated = { ...p, stock: newStock };
                              updateProduct(updated);
                              showToast(`Reduced 5 units from ${p.name}`, 'info');
                            }}
                            className="px-3 py-1 bg-neutral-100 hover:bg-red-100 hover:text-red-600 rounded-lg font-bold transition-colors"
                          >
                            -5
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Customer Orders & Fulfillment</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Manage live orders and connect with customers via WhatsApp</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-neutral-500 py-8 text-center">No orders found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="py-4 font-mono font-semibold text-neutral-900">{order.id}</td>
                          <td className="py-4">
                            <span className="font-heading font-bold text-neutral-900 block">{order.shippingAddress.fullName}</span>
                            <span className="text-[10px] text-neutral-500">{order.shippingAddress.phone}</span>
                          </td>
                          <td className="py-4 text-neutral-600">{order.date}</td>
                          <td className="py-4 font-heading font-bold text-[#D4AF37]">{formatNaira(order.totalAmount)}</td>
                          <td className="py-4">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="px-3 py-1 rounded-lg text-xs font-semibold border bg-neutral-50 text-neutral-700"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <a 
                              href={`https://wa.me/${storeSettings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.shippingAddress.fullName)},%20regarding%20your%20order%20${order.id}%20at%20Global%20Wealth%20Store...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              WhatsApp
                            </a>
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-semibold"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Customer Accounts</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Registered store buyers</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Customer Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Orders Placed</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-neutral-50">
                        <td className="py-4 font-bold text-neutral-900">{o.shippingAddress.fullName}</td>
                        <td className="py-4 text-neutral-600">{o.shippingAddress.email}</td>
                        <td className="py-4 text-neutral-600">{o.shippingAddress.phone}</td>
                        <td className="py-4 font-bold text-[#D4AF37]">1 Order</td>
                        <td className="py-4 text-right">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Discount Coupons & Duration Management</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Create promotional codes, set active durations, and edit or cancel anytime</p>
                </div>
                <button 
                  onClick={handleOpenAddCoupon}
                  className="bg-[#D4AF37] hover:bg-[#c29b2f] text-white font-heading font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map(cp => (
                  <div key={cp.id} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-heading font-extrabold text-base text-neutral-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-neutral-200">{cp.code}</h4>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">{cp.value}% OFF</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-2 space-y-1">
                        <p>Min Purchase: <span className="font-bold">{formatNaira(cp.minPurchase || 0)}</span></p>
                        <p>Valid: <span className="font-semibold text-neutral-800">{cp.startDate || '2026-07-25'} to {cp.expiryDate || '2026-12-31'}</span></p>
                        <p>Applies to: <span className="font-semibold uppercase text-[#D4AF37]">{cp.productId === 'all' ? 'All Products' : 'Selected Product'}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                      <button 
                        onClick={() => handleOpenEditCoupon(cp)}
                        className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-[#D4AF37] font-semibold rounded-lg text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Cancel/Delete coupon "${cp.code}"?`)) {
                            deleteCoupon(cp.id);
                            showToast(`Coupon "${cp.code}" cancelled.`);
                          }
                        }}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOMEPAGE MANAGER TAB */}
          {activeTab === 'homepage' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-neutral-900">Homepage Content Manager</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Customize hero banner title, announcement bar, and flash sale countdown</p>
              </div>

              <div className="space-y-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-200 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Announcement Bar Text</label>
                  <input 
                    type="text" 
                    defaultValue="Nigeria Express Delivery • WhatsApp Support: +234 903 135 5416"
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Hero Subtitle</label>
                  <input 
                    type="text" 
                    defaultValue="Global Wealth Collections • Haute Couture & Luxury Italian Leather"
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5"
                  />
                </div>
                <button 
                  onClick={() => showToast('Homepage banner settings saved successfully!')}
                  className="bg-[#D4AF37] text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Save Homepage Layout
                </button>
              </div>
            </div>
          )}

          {/* MEDIA LIBRARY TAB */}
          {activeTab === 'media' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Central Media Library</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Store assets, banners and product imagery</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.slice(0, 8).map((p, idx) => (
                  <div key={idx} className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 space-y-2">
                    <img src={p.images[0]} alt="" className="w-full h-32 object-cover rounded-xl border border-neutral-200" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-neutral-600 truncate block font-mono">{p.images[0].substring(0, 30)}...</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT MESSAGES TAB */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Customer Inquiries</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Messages sent via store contact form</p>
                </div>
              </div>

              <div className="space-y-4">
                {contactMessages.map(m => (
                  <div key={m.id} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-neutral-900">{m.name}</h4>
                        <span className="text-[10px] text-neutral-500">({m.phone})</span>
                      </div>
                      <p className="text-xs text-neutral-700">{m.message}</p>
                      <span className="text-[10px] text-neutral-400 block">{m.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(m.name)},%20regarding%20your%20inquiry%20at%20Global%20Wealth%20Store...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs"
                      >
                        WhatsApp Reply
                      </a>
                      <button 
                        onClick={() => deleteMessage(m.id)}
                        className="p-2 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Financial Reports & Analytics</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Export sales data and revenue summaries</p>
                </div>
                <button 
                  onClick={() => showToast('Sales report CSV exported successfully!')}
                  className="bg-[#D4AF37] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 uppercase">Gross Revenue</span>
                  <h3 className="text-2xl font-heading font-extrabold text-emerald-600 mt-1">{formatNaira(totalRevenue)}</h3>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 uppercase">Total Completed Orders</span>
                  <h3 className="text-2xl font-heading font-extrabold text-neutral-900 mt-1">{orders.length}</h3>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 uppercase">Average Order Value</span>
                  <h3 className="text-2xl font-heading font-extrabold text-[#D4AF37] mt-1">{formatNaira(orders.length ? totalRevenue / orders.length : 0)}</h3>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-neutral-900">Store Settings & Configuration</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Manage store contact details, WhatsApp number and bank transfer info</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                updateStoreSettings(settingsForm);
              }} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Store Name</label>
                    <input 
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">WhatsApp Concierge Number</label>
                    <input 
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Support Email</label>
                    <input 
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Business Address</label>
                    <input 
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Abuja Delivery Fee (₦)</label>
                    <input 
                      type="number"
                      value={settingsForm.abujaDeliveryFee ?? 2500}
                      onChange={(e) => setSettingsForm({ ...settingsForm, abujaDeliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Lagos Delivery Fee (₦)</label>
                    <input 
                      type="number"
                      value={settingsForm.lagosDeliveryFee ?? 4500}
                      onChange={(e) => setSettingsForm({ ...settingsForm, lagosDeliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase mb-1">Other States Delivery Fee (₦)</label>
                    <input 
                      type="number"
                      value={settingsForm.otherDeliveryFee ?? 6500}
                      onChange={(e) => setSettingsForm({ ...settingsForm, otherDeliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Free Shipping Order Threshold (₦)</label>
                  <input 
                    type="number"
                    value={settingsForm.freeShippingThreshold ?? 150000}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Orders above this amount receive free home delivery automatically.</p>
                </div>

                <button 
                  type="submit"
                  className="bg-[#D4AF37] text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">Notification Center</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">System alerts and customer order updates</p>
                </div>
                <button 
                  onClick={clearNotifications}
                  className="text-xs text-neutral-500 hover:text-red-600 font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-neutral-900">{n.title}</h4>
                      <p className="text-xs text-neutral-600 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-neutral-400 mt-1 block">{n.time}</span>
                    </div>
                    <button 
                      onClick={() => markNotificationRead(n.id)}
                      className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    >
                      Mark Read
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsAddingProduct(false)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white text-neutral-900 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative z-10 border border-neutral-200 max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setIsAddingProduct(false)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-xl text-neutral-900 mb-6">
              {editingProduct ? 'Edit Luxury Product' : 'Upload New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Robert Silk Shirt"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Brand Name</label>
                  <input 
                    type="text" 
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="shoes">Shoes</option>
                    <option value="bags">Bags</option>
                    <option value="accessories">Accessories</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Price (₦)</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="185000"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Product Images (Comma-separated URLs)</label>
                  <input 
                    type="text" 
                    required
                    value={imagesInput}
                    onChange={(e) => setImagesInput(e.target.value)}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Add one or more images of the product separated by commas.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Colours (Name:Hex, comma separated)</label>
                    <input 
                      type="text" 
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      placeholder="Gold:#D4AF37, Black:#111111"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Sizes (Optional - auto detects dress sizes)</label>
                    <input 
                      type="text" 
                      value={sizesInput}
                      onChange={(e) => setSizesInput(e.target.value)}
                      placeholder="S, M, L, XL or leave blank for dress auto-detect"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 py-2 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-[#D4AF37]"
                  /> Mark as New Arrival
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="rounded text-[#D4AF37]"
                  /> Add to Flash Sale
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Full Description</label>
                <textarea 
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Exquisitely tailored luxury item..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-white font-heading font-bold text-xs hover:bg-[#c29b2f] transition-colors shadow-sm"
                >
                  {editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsBrandModalOpen(false)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white text-neutral-900 rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 border border-neutral-200">
            <h3 className="font-heading font-bold text-xl text-neutral-900 mb-6">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </h3>
            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Brand Name</label>
                <input 
                  type="text" 
                  required
                  value={brandFormName}
                  onChange={(e) => setBrandFormName(e.target.value)}
                  placeholder="e.g. Robert Luxury"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Description</label>
                <input 
                  type="text" 
                  value={brandFormDesc}
                  onChange={(e) => setBrandFormDesc(e.target.value)}
                  placeholder="Luxury fashion designer brand"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Website (Optional)</label>
                <input 
                  type="text" 
                  value={brandFormWebsite}
                  onChange={(e) => setBrandFormWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsBrandModalOpen(false)} className="px-5 py-2.5 bg-neutral-100 font-semibold rounded-xl text-neutral-700">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] text-white font-bold rounded-xl">{editingBrand ? 'Update Brand' : 'Add Brand'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsCatModalOpen(false)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white text-neutral-900 rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 border border-neutral-200">
            <h3 className="font-heading font-bold text-xl text-neutral-900 mb-6">
              {editingCat ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSaveCat} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={catFormName}
                  onChange={(e) => setCatFormName(e.target.value)}
                  placeholder="e.g. Haute Couture"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-5 py-2.5 bg-neutral-100 font-semibold rounded-xl text-neutral-700">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] text-white font-bold rounded-xl">{editingCat ? 'Update Category' : 'Add Category'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsCouponModalOpen(false)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white text-neutral-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative z-10 border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-xl text-neutral-900 mb-6">
              {editingCoupon ? 'Edit & Manage Coupon' : 'Create New Discount Coupon'}
            </h3>
            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Coupon Code</label>
                  <input 
                    type="text" 
                    required
                    value={couponFormCode}
                    onChange={(e) => setCouponFormCode(e.target.value)}
                    placeholder="e.g. ROBERT20"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 uppercase font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Discount Percentage (%)</label>
                  <input 
                    type="number" 
                    required
                    value={couponFormValue}
                    onChange={(e) => setCouponFormValue(e.target.value)}
                    placeholder="15"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Minimum Purchase Amount (₦)</label>
                <input 
                  type="number" 
                  value={couponFormMin}
                  onChange={(e) => setCouponFormMin(e.target.value)}
                  placeholder="20000"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={couponFormStart}
                    onChange={(e) => setCouponFormStart(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 uppercase mb-1">Expiry Date (Duration)</label>
                  <input 
                    type="date" 
                    required
                    value={couponFormExpiry}
                    onChange={(e) => setCouponFormExpiry(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase mb-1">Applies To Product</label>
                <select 
                  value={couponFormProductId}
                  onChange={(e) => setCouponFormProductId(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">All Store Products</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-5 py-2.5 bg-neutral-100 font-semibold rounded-xl text-neutral-700">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] text-white font-bold rounded-xl">{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white text-neutral-900 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative z-10 border border-neutral-200 max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-semibold">Order Details</span>
                <h3 className="font-heading font-bold text-xl text-neutral-900">{selectedOrder.id}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                {selectedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
              <div>
                <h4 className="font-heading font-bold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> Customer Information
                </h4>
                <p className="font-bold text-neutral-900">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.email}</p>
                <p className="text-neutral-600 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {selectedOrder.shippingAddress.phone}</p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Shipping Destination
                </h4>
                <p className="text-neutral-800">{selectedOrder.shippingAddress.address}</p>
                <p className="text-neutral-800">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p className="text-[10px] text-neutral-500 mt-1">Payment Method: {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <h4 className="font-heading font-bold text-sm text-neutral-900 mb-3">Ordered Items ({selectedOrder.items.length})</h4>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt="" className="w-12 h-14 object-cover rounded-lg border border-neutral-200" referrerPolicy="no-referrer" />
                    <div>
                      <h5 className="font-heading font-bold text-xs text-neutral-900">{item.product.name}</h5>
                      <p className="text-[10px] text-neutral-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-xs text-[#D4AF37]">{formatNaira(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-neutral-500">Subtotal: {formatNaira(selectedOrder.totalAmount - selectedOrder.shippingFee)}</span>
                <span className="text-neutral-500 block">Shipping Fee: {formatNaira(selectedOrder.shippingFee)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 uppercase font-semibold">Total Paid</span>
                <h3 className="font-heading font-extrabold text-lg text-neutral-900">{formatNaira(selectedOrder.totalAmount)}</h3>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
