-- ============================================================================
-- 014_create_products.sql
-- Products Table representing core merchandise items
-- Purpose: Central product master table built for high-performance scale (100k+ products).
-- ============================================================================

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

COMMENT ON TABLE public.products IS 'Core product catalog master table optimized for scale, pricing tiers, analytics metrics, and SEO.';
