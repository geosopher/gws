-- ============================================================================
-- GLOBAL WEALTH STORE - PRODUCT CATALOG ENTERPRISE MIGRATION (PART 1 OF 3)
-- Core Tables: Enums, Categories, Subcategories, Brands, Products, Variants, Media
-- Copy and paste this script into your Supabase SQL Editor and run it first.
-- ============================================================================

-- 1. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE public.product_status AS ENUM ('draft', 'active', 'archived', 'out_of_stock');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.inventory_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock', 'backorder');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.stock_movement_type AS ENUM (
        'purchase', 'sale', 'return', 'adjustment', 'damage', 'restock', 'reservation', 'release'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.media_type AS ENUM ('image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.collection_type AS ENUM (
        'featured', 'trending', 'editors_choice', 'new_arrival', 'flash_sale', 'seasonal', 'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CATEGORIES (Recursive Nesting)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL CHECK (char_length(name) >= 2),
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (char_length(slug) >= 2),
    description TEXT,
    image_url TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SUBCATEGORIES
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL CHECK (char_length(name) >= 2),
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (char_length(slug) >= 2),
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE CHECK (char_length(name) >= 2),
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (char_length(slug) >= 2),
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    slug VARCHAR(255) NOT NULL UNIQUE CHECK (char_length(slug) >= 2),
    name VARCHAR(255) NOT NULL CHECK (char_length(name) >= 2),
    short_description VARCHAR(500),
    full_description TEXT,
    sku VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(sku) >= 3),
    barcode VARCHAR(100) UNIQUE,
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    sale_price NUMERIC(12,2) CHECK (sale_price IS NULL OR sale_price >= 0),
    cost_price NUMERIC(12,2) CHECK (cost_price IS NULL OR cost_price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    weight_kg NUMERIC(8,3) CHECK (weight_kg IS NULL OR weight_kg >= 0),
    status public.product_status NOT NULL DEFAULT 'draft'::public.product_status,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    new_arrival BOOLEAN NOT NULL DEFAULT TRUE,
    flash_sale BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    search_keywords TEXT,
    view_count INT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    wishlist_count INT NOT NULL DEFAULT 0 CHECK (wishlist_count >= 0),
    sales_count INT NOT NULL DEFAULT 0 CHECK (sales_count >= 0),
    average_rating NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    sort_order INT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_sale_price_less_than_base CHECK (sale_price IS NULL OR sale_price <= base_price)
);

-- 6. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL CHECK (char_length(name) >= 1),
    sku VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(sku) >= 3),
    barcode VARCHAR(100) UNIQUE,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12,2) CHECK (sale_price IS NULL OR sale_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_stock INT NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    weight_kg NUMERIC(8,3) CHECK (weight_kg IS NULL OR weight_kg >= 0),
    color VARCHAR(50),
    size VARCHAR(50),
    material VARCHAR(100),
    status public.product_status NOT NULL DEFAULT 'active'::public.product_status,
    sort_order INT NOT NULL DEFAULT 0,
    attributes JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_variant_sale_price CHECK (sale_price IS NULL OR sale_price <= price)
);

-- 7. PRODUCT MEDIA
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    media_type public.media_type NOT NULL DEFAULT 'image'::public.media_type,
    url TEXT NOT NULL,
    storage_path TEXT,
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
