import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'gws-001',
    name: 'Monogram Velvet Royal Abaya & Kaftan Set',
    category: 'women',
    gender: 'women',
    brand: 'Global Wealth Couture',
    price: 185000,
    oldPrice: 220000,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Exquisitely tailored royal velvet abaya featuring intricate gold embroidery along the cuffs and neckline. Designed for high society elegance and effortless grace.',
    details: [
      'Premium Italian Velvet & Silk Blend',
      'Hand-embellished Luxury Gold Zari Thread',
      'Matching Luxury Chiffon Shayla Scarf included',
      'Dry clean only'
    ],
    sizes: ['UK 8 (S)', 'UK 10 (M)', 'UK 12 (L)', 'UK 14 (XL)'],
    colors: [
      { name: 'Royal Purple', hex: '#6A1B9A' },
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Rose Pink', hex: '#E91E63' }
    ],
    stock: 12,
    rating: 4.9,
    reviewsCount: 38,
    isNew: true,
    isBestSeller: true,
    isEditorPick: true,
    sku: 'GWS-W-001'
  },
  {
    id: 'gws-002',
    name: 'Executive Bespoke Italian Wool 3-Piece Suit',
    category: 'men',
    gender: 'men',
    brand: 'Wealth Tailors Savile',
    price: 450000,
    oldPrice: 520000,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Command the boardroom and high-end galas in this masterfully crafted 3-piece suit made from Super 150s Italian virgin wool with satin lapel accents.',
    details: [
      '100% Super 150s Italian Virgin Wool',
      'Hand-stitched silk lining with signature gold monogram',
      'Includes Jacket, Vest, and Tailored Trousers',
      'Bespoke slim modern cut'
    ],
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    colors: [
      { name: 'Charcoal Navy', hex: '#1C2833' },
      { name: 'Rich Burgundy', hex: '#581845' },
      { name: 'Jet Black', hex: '#000000' }
    ],
    stock: 8,
    rating: 5.0,
    reviewsCount: 24,
    isBestSeller: true,
    isFlashSale: true,
    sku: 'GWS-M-002'
  },
  {
    id: 'gws-003',
    name: 'Luxe Quilted Leather Chain Handbag',
    category: 'bags',
    gender: 'women',
    brand: 'Wealth Milano',
    price: 280000,
    oldPrice: 350000,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'An iconic statement accessory crafted from supple calfskin leather with chevron quilting and heavy 24k gold-plated interlocking hardware and chain strap.',
    details: [
      '100% Genuine Italian Calfskin Leather',
      '24k Gold-Plated Hardware & Sliding Chain',
      'Microfiber suede interior lining with zip pocket',
      'Dimensions: 28cm x 18cm x 9cm'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Luxury Gold', hex: '#D4AF37' },
      { name: 'Blush Pink', hex: '#F8BBD0' },
      { name: 'Obsidian Black', hex: '#212121' }
    ],
    stock: 15,
    rating: 4.8,
    reviewsCount: 52,
    isNew: true,
    isBestSeller: true,
    isEditorPick: true,
    sku: 'GWS-B-003'
  },
  {
    id: 'gws-004',
    name: 'Handcrafted Crocodile Textured Oxford Shoes',
    category: 'shoes',
    gender: 'men',
    brand: 'Wealth Firenze',
    price: 210000,
    oldPrice: 260000,
    discount: 19,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7d97e0afd8b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Exquisite handcrafted leather oxford shoes with sophisticated crocodile texture stamping, Goodyear welted leather sole, and cushioned inner comfort.',
    details: [
      'Hand-finished Italian Calf Leather',
      'Goodyear Welt Construction for lifelong durability',
      'Genuine leather sole with rubber heel insert',
      'Includes dust bags and cedar shoe trees'
    ],
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
    colors: [
      { name: 'Cognac Brown', hex: '#8D4004' },
      { name: 'Deep Espresso', hex: '#3E2723' },
      { name: 'Midnight Black', hex: '#000000' }
    ],
    stock: 10,
    rating: 4.9,
    reviewsCount: 19,
    isFlashSale: true,
    sku: 'GWS-S-004'
  },
  {
    id: 'gws-005',
    name: 'Crystal Embellished Bridal Silk Gown',
    category: 'women',
    gender: 'women',
    brand: 'Global Wealth Couture',
    price: 950000,
    oldPrice: 1200000,
    discount: 21,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A breathtaking masterpiece of haute couture. Hand-beaded Swarovski crystals cascading down French silk tulle with a dramatic royal train.',
    details: [
      'Pure Mulberry French Silk and Italian Tulle',
      'Over 5,000 Hand-Applied Swarovski Crystals',
      'Built-in structured corset for impeccable posture',
      'Custom tailored fitting consultation available'
    ],
    sizes: ['UK 8', 'UK 10', 'UK 12', 'Bespoke Custom'],
    colors: [
      { name: 'Ivory Pearl', hex: '#FFFFF0' },
      { name: 'Champagne Gold', hex: '#F7E7CE' }
    ],
    stock: 3,
    rating: 5.0,
    reviewsCount: 12,
    isEditorPick: true,
    sku: 'GWS-W-005'
  },
  {
    id: 'gws-006',
    name: 'Designer Gold-Link Luxury Swiss Watch',
    category: 'accessories',
    gender: 'unisex',
    brand: 'Wealth Horology',
    price: 680000,
    oldPrice: 850000,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Precision Swiss automatic movement housed in 18k yellow gold-plated stainless steel with sapphire crystal glass and mother-of-pearl dial.',
    details: [
      'Swiss Automatic Self-Winding Movement',
      'Scratch-resistant Sapphire Crystal',
      'Water resistant up to 50 meters (5 ATM)',
      '18k Yellow Gold Ion-Plated Bracelet'
    ],
    sizes: ['Standard Adjustable'],
    colors: [
      { name: 'Yellow Gold & White', hex: '#D4AF37' },
      { name: 'Rose Gold & Diamond', hex: '#B76E79' },
      { name: 'Steel & Gold Two-Tone', hex: '#C5C5C5' }
    ],
    stock: 6,
    rating: 4.9,
    reviewsCount: 29,
    isBestSeller: true,
    isNew: true,
    sku: 'GWS-A-006'
  },
  {
    id: 'gws-007',
    name: 'Little Princess Royal Ankara & Organza Dress',
    category: 'kids',
    gender: 'kids',
    brand: 'Global Wealth Kids',
    price: 65000,
    oldPrice: 80000,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Adorably chic designer party dress for young royalty, combining vibrant premium Ankara print with voluminous silk organza ruffles.',
    details: [
      '100% Breathable Cotton Ankara & Soft Organza',
      'Cotton inner lining for sensitive skin comfort',
      'Back zipper and elegant bow sash',
      'Machine washable (gentle cycle)'
    ],
    sizes: ['3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years'],
    colors: [
      { name: 'Magenta Pink', hex: '#E91E63' },
      { name: 'Royal Gold', hex: '#D4AF37' },
      { name: 'Imperial Purple', hex: '#6A1B9A' }
    ],
    stock: 20,
    rating: 4.8,
    reviewsCount: 15,
    isNew: true,
    sku: 'GWS-K-007'
  },
  {
    id: 'gws-008',
    name: 'Stiletto Designer Velvet Evening Pumps',
    category: 'shoes',
    gender: 'women',
    brand: 'Wealth Milano',
    price: 145000,
    oldPrice: 180000,
    discount: 19,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Sleek 105mm stiletto heels wrapped in luscious royal purple velvet with crystal-encrusted brooch toe clip for maximum glamour.',
    details: [
      'Plush Velvet Upper with Leather Sole',
      '105mm (4.1 inch) Heel Height',
      'Cushioned leather insole for all-night comfort',
      'Handmade in Italy'
    ],
    sizes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40'],
    colors: [
      { name: 'Royal Purple', hex: '#6A1B9A' },
      { name: 'Hot Pink', hex: '#E91E63' },
      { name: 'Jet Black', hex: '#000000' }
    ],
    stock: 14,
    rating: 4.7,
    reviewsCount: 22,
    isFlashSale: true,
    sku: 'GWS-S-008'
  },
  {
    id: 'gws-009',
    name: 'Executive Silk Tie & Cufflinks Gift Box Set',
    category: 'accessories',
    gender: 'men',
    brand: 'Wealth Tailors Savile',
    price: 45000,
    oldPrice: 60000,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'The ultimate gentleman gift set including a 100% jacquard woven pure silk tie, matching pocket square, sterling silver plated cufflinks, and tie pin.',
    details: [
      '100% Jacquard Woven Silk',
      'Handcrafted finish with luxurious drape',
      'Includes premium matte black presentation gift box',
      'Includes matching pocket square & cufflinks'
    ],
    sizes: ['Standard Size'],
    colors: [
      { name: 'Gold & Navy', hex: '#D4AF37' },
      { name: 'Purple & Silver', hex: '#6A1B9A' },
      { name: 'Classic Burgundy', hex: '#800020' }
    ],
    stock: 25,
    rating: 4.9,
    reviewsCount: 44,
    isBestSeller: true,
    sku: 'GWS-A-009'
  },
  {
    id: 'gws-010',
    name: 'Designer Leather Weekender Travel Duffle',
    category: 'bags',
    gender: 'unisex',
    brand: 'Global Wealth Luggage',
    price: 320000,
    oldPrice: 390000,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Travel in supreme luxury with this full-grain pebbled leather duffle bag. Features a spacious main compartment, shoe pouch, and sturdy brass hardware.',
    details: [
      '100% Full-Grain Italian Pebbled Leather',
      'Reinforced brass feet and detachable shoulder strap',
      'Dedicated interior laptop sleeve & zippered compartments',
      'Meets international cabin baggage dimensions'
    ],
    sizes: ['Large (48L)'],
    colors: [
      { name: 'Cognac Tan', hex: '#964B00' },
      { name: 'Charcoal Black', hex: '#1A1A1A' }
    ],
    stock: 9,
    rating: 4.9,
    reviewsCount: 31,
    isEditorPick: true,
    sku: 'GWS-B-010'
  },
  {
    id: 'gws-011',
    name: 'Boys Traditional Agbada & Cap Set',
    category: 'kids',
    gender: 'kids',
    brand: 'Global Wealth Kids',
    price: 85000,
    oldPrice: 105000,
    discount: 19,
    images: [
      'https://images.unsplash.com/photo-1503944583220-7eeec4934c7b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Exquisite miniature Agbada set crafted from rich brocade fabric with detailed golden embroidery, perfect for weddings, naming ceremonies, and festivities.',
    details: [
      'Premium Nigerian Brocade Fabric',
      'Includes matching top, trousers, inner tunic, and fila cap',
      'Soft inner lining for supreme child comfort',
      'Expertly embroidered gold motifs'
    ],
    sizes: ['2-3 Years', '4-5 Years', '6-7 Years', '8-10 Years'],
    colors: [
      { name: 'Royal White & Gold', hex: '#F5F5F5' },
      { name: 'Imperial Purple', hex: '#6A1B9A' },
      { name: 'Deep Navy', hex: '#000080' }
    ],
    stock: 16,
    rating: 4.8,
    reviewsCount: 27,
    sku: 'GWS-K-011'
  },
  {
    id: 'gws-012',
    name: 'Luxury Oversized Gradient Designer Sunglasses',
    category: 'accessories',
    gender: 'unisex',
    brand: 'Wealth Eyewear',
    price: 95000,
    oldPrice: 120000,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Statement oversized frames with gradient UV400 lenses and gold monogram temples. The quintessential accessory for Lagos and Abuja sunlit luxury.',
    details: [
      '100% UV400 Sun Protection Lenses',
      'Hand-polished acetate frame with 18k gold accents',
      'Includes hard leather protective case and microfiber cloth',
      'Ergonomic lightweight fit'
    ],
    sizes: ['Universal Fit'],
    colors: [
      { name: 'Tortoiseshell Gold', hex: '#8B4513' },
      { name: 'Jet Black & Gold', hex: '#111111' },
      { name: 'Rose Tinted', hex: '#FFC0CB' }
    ],
    stock: 18,
    rating: 4.7,
    reviewsCount: 20,
    isNew: true,
    sku: 'GWS-A-012'
  }
];

export const CATEGORIES = [
  { id: 'women', name: "Women's Fashion", image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', count: '45+ Items' },
  { id: 'men', name: "Men's Fashion", image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', count: '38+ Items' },
  { id: 'shoes', name: 'Luxury Shoes', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80', count: '25+ Items' },
  { id: 'bags', name: 'Bags & Luggage', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', count: '30+ Items' },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', count: '50+ Items' },
  { id: 'kids', name: "Kids' Royal Wear", image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80', count: '20+ Items' },
];

export const FAQS = [
  {
    question: 'How do I place an order and make payments?',
    answer: 'You can complete your order securely via Direct Bank Transfer or via WhatsApp Support (+2349031355416). After transferring to our official corporate account, please send your payment receipt via WhatsApp for instant confirmation and dispatch.'
  },
  {
    question: 'What is the delivery timeline within Nigeria?',
    answer: 'We offer express delivery within Abuja FCT (24 hours) and major cities like Lagos, Port Harcourt, Ibadan, and Kano (2-4 business days). You can also select free physical store pickup at our Abuja showroom. All shipments are fully insured and tracked.'
  },
  {
    question: 'Can I request a custom bespoke fitting or size?',
    answer: 'Yes! Global Wealth Store offers bespoke tailoring for high-end suits, abayas, and bridal wear. Contact our WhatsApp support at +2349031355416 to schedule your virtual or physical measurement consultation at our Mpape, Abuja showroom.'
  },
  {
    question: 'What is your return and exchange policy?',
    answer: 'We accept returns and size exchanges within 7 days of delivery for unworn items in original packaging with tags attached. Bespoke custom orders are final sale.'
  }
];
