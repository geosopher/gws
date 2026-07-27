-- ============================================================================
-- 015_create_product_variants.sql
-- Product Variants Table for specific options (size, color, material, etc.)
-- Purpose: Manages SKU variants with individual pricing, stock, and attributes.
-- ============================================================================

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

COMMENT ON TABLE public.product_variants IS 'Product variants table for managing color, size, material variations with independent pricing and stock.';
