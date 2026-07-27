import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';
import { Filter, SlidersHorizontal, Grid, List, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const ShopPage: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'best-selling' | 'rating'>('newest');
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const brands = Array.from(new Set(products.map(p => p.brand)));

  let filtered = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
    if (p.price > priceRange) return false;
    if (searchFilter.trim() !== '' && !p.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'best-selling') {
    filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="bg-gradient-to-r from-neutral-900 to-[#6A1B9A] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">Global Wealth Collections</span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl capitalize">
              {selectedCategory === 'all' ? 'All Luxury Collections' : `${selectedCategory} Fashion`}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              Discover authentic Italian leather, haute couture, tailored suits, and exclusive accessories priced in Nigerian Naira (₦).
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-neutral-100 text-neutral-800 px-4 py-2.5 rounded-xl text-xs font-semibold"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>

            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="Search collection..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 whitespace-nowrap">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-[#E91E63]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1 border-l border-neutral-200 pl-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#E91E63] text-white' : 'bg-neutral-100 text-neutral-600'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#E91E63] text-white' : 'bg-neutral-100 text-neutral-600'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm h-fit`}>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="font-heading font-bold text-sm text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#E91E63]" /> Filters
              </h3>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setPriceRange(1000000);
                  setSearchFilter('');
                }}
                className="text-[11px] text-[#E91E63] font-semibold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Categories</h4>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Collections' },
                  { id: 'women', label: "Women's Fashion" },
                  { id: 'men', label: "Men's Tailoring" },
                  { id: 'shoes', label: 'Luxury Shoes' },
                  { id: 'bags', label: 'Bags & Luggage' },
                  { id: 'accessories', label: 'Accessories' },
                  { id: 'kids', label: "Kids' Royal Wear" },
                ].map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat.id 
                        ? 'bg-pink-50 text-[#E91E63] font-bold' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="pt-4 border-t border-neutral-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Designer Brand</h4>
              <div className="space-y-1.5">
                <button 
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${selectedBrand === 'all' ? 'text-[#E91E63] font-bold' : 'text-neutral-700'}`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button 
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${selectedBrand === brand ? 'text-[#E91E63] font-bold' : 'text-neutral-700'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Max Price</h4>
                <span className="text-xs font-bold text-[#6A1B9A]">₦{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="30000" 
                max="1200000" 
                step="20000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#E91E63]"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-xs text-neutral-500">
              Showing <strong className="text-neutral-900">{filtered.length}</strong> luxury items
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-heading font-semibold text-lg text-neutral-900">No matching luxury items found</h3>
                <p className="text-xs text-neutral-500">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setPriceRange(1000000);
                    setSearchFilter('');
                  }}
                  className="bg-[#6A1B9A] text-white px-6 py-2.5 rounded-xl font-semibold text-xs shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
};
