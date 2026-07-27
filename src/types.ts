export interface Product {
  id: string;
  name: string;
  category: 'women' | 'men' | 'kids' | 'shoes' | 'bags' | 'accessories';
  gender: 'women' | 'men' | 'unisex' | 'kids';
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  isEditorPick?: boolean;
  sku: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    notes?: string;
  };
  paymentMethod: 'Bank Transfer' | 'WhatsApp Order';
  paymentReference?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: {
    id: string;
    title: string;
    address: string;
    city: string;
    state: string;
    isDefault: boolean;
  }[];
}

export type ViewState = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'checkout' 
  | 'success' 
  | 'dashboard' 
  | 'admin'
  | 'contact' 
  | 'not-found';
