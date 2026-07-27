-- ============================================================================
-- GLOBAL WEALTH STORE - PRODUCTION PRODUCT CATALOG ENTERPRISE MIGRATION
-- Target: Supabase PostgreSQL (Production Grade)
-- All-in-one unified migration script for copy-pasting directly into Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM POSTGRESQL ENUMS
-- ============================================================================

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
        'purchase',
        'sale',
        'return',
        'adjustment',
        'damage',
        'restock',
        'reservation',
        'release'
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
        'featured',
        'trending',
        'editors_choice',
        'new_arrival',
        'flash_sale',
        'seasonal',
        'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ============================================================================
-- 2. CATEGORIES (Recursive Nesting)
-- ============================================================================
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


-- ============================================================================
-- 3. SUBCATEGORIES
-- ============================================================================
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


-- ============================================================================
-- 4. BRANDS
-- ============================================================================
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


-- ============================================================================
-- 5. PRODUCTS
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


-- ============================================================================
-- 6. PRODUCT VARIANTS
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


-- ============================================================================
-- 7. PRODUCT MEDIA
-- ============================================================================
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


-- ============================================================================
-- 8. NORMALIZED ATTRIBUTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attribute_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    display_type VARCHAR(50) NOT NULL DEFAULT 'text',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id UUID NOT NULL REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
    value VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    meta_value TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_attribute_value_per_def UNIQUE (attribute_id, slug)
);

CREATE TABLE IF NOT EXISTS public.product_attribute_values (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    attribute_value_id UUID NOT NULL REFERENCES public.attribute_values(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, attribute_value_id)
);


-- ============================================================================
-- 9. TAGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(name) >= 2),
    slug VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(slug) >= 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_tag_mappings (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.product_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);


-- ============================================================================
-- 10. COLLECTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE CHECK (char_length(name) >= 2),
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (char_length(slug) >= 2),
    description TEXT,
    collection_type public.collection_type NOT NULL DEFAULT 'custom'::public.collection_type,
    banner_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collection_products (
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);


-- ============================================================================
-- 11. PRODUCT REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review TEXT NOT NULL,
    status public.review_status NOT NULL DEFAULT 'pending'::public.review_status,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 12. INVENTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    damaged_quantity INT NOT NULL DEFAULT 0 CHECK (damaged_quantity >= 0),
    returned_quantity INT NOT NULL DEFAULT 0 CHECK (returned_quantity >= 0),
    reorder_level INT NOT NULL DEFAULT 10 CHECK (reorder_level >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    inventory_status public.inventory_status NOT NULL DEFAULT 'in_stock'::public.inventory_status,
    warehouse_location VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_variant_inventory UNIQUE (product_id, variant_id)
);


-- ============================================================================
-- 13. STOCK MOVEMENTS (Immutable Ledger)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    movement_type public.stock_movement_type NOT NULL,
    quantity INT NOT NULL,
    previous_quantity INT NOT NULL CHECK (previous_quantity >= 0),
    new_quantity INT NOT NULL CHECK (new_quantity >= 0),
    reason VARCHAR(255),
    reference_type VARCHAR(100),
    reference_id VARCHAR(100),
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 14. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Product rating stats recalculation function
CREATE OR REPLACE FUNCTION public.update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET 
        average_rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM public.product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
              AND status = 'approved'
        ), 0.00),
        review_count = (
            SELECT COUNT(*)
            FROM public.product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
              AND status = 'approved'
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stock movement immutability trigger function
CREATE OR REPLACE FUNCTION public.prevent_stock_movement_tampering()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'Stock movement history is immutable and cannot be updated.';
    ELSIF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Stock movement history is immutable and cannot be deleted.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Triggers
DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_subcategories_updated_at ON public.subcategories;
CREATE TRIGGER trg_subcategories_updated_at BEFORE UPDATE ON public.subcategories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_brands_updated_at ON public.brands;
CREATE TRIGGER trg_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_product_variants_updated_at ON public.product_variants;
CREATE TRIGGER trg_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_collections_updated_at ON public.collections;
CREATE TRIGGER trg_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER trg_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON public.inventory;
CREATE TRIGGER trg_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_update_product_ratings ON public.product_reviews;
CREATE TRIGGER trg_update_product_ratings AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_product_rating_stats();

DROP TRIGGER IF EXISTS trg_immutable_stock_movements ON public.stock_movements;
CREATE TRIGGER trg_immutable_stock_movements BEFORE UPDATE OR DELETE ON public.stock_movements FOR EACH ROW EXECUTE FUNCTION public.prevent_stock_movement_tampering();


-- ============================================================================
-- 15. INDEXES & GIN FULL-TEXT SEARCH
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON public.products(new_arrival) WHERE new_arrival = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_flash_sale ON public.products(flash_sale) WHERE flash_sale = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(base_price);

CREATE INDEX IF NOT EXISTS idx_products_fts_gin ON public.products USING GIN (
    to_tsvector('english', 
        coalesce(name, '') || ' ' || 
        coalesce(short_description, '') || ' ' || 
        coalesce(full_description, '') || ' ' || 
        coalesce(search_keywords, '')
    )
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_variant_id ON public.product_media(variant_id);

CREATE INDEX IF NOT EXISTS idx_attribute_values_attribute_id ON public.attribute_values(attribute_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id, status);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);


-- ============================================================================
-- 16. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tag_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Public Select Policies
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL OR public.is_staff_or_admin());
CREATE POLICY "Public read active subcategories" ON public.subcategories FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL OR public.is_staff_or_admin());
CREATE POLICY "Public read active brands" ON public.brands FOR SELECT USING (deleted_at IS NULL OR public.is_staff_or_admin());
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (status = 'active'::public.product_status AND deleted_at IS NULL OR public.is_staff_or_admin());
CREATE POLICY "Public read active variants" ON public.product_variants FOR SELECT USING (status = 'active'::public.product_status OR public.is_staff_or_admin());
CREATE POLICY "Public read product media" ON public.product_media FOR SELECT USING (TRUE);
CREATE POLICY "Public read attribute definitions" ON public.attribute_definitions FOR SELECT USING (TRUE);
CREATE POLICY "Public read attribute values" ON public.attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Public read product attribute values" ON public.product_attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Public read product tags" ON public.product_tags FOR SELECT USING (TRUE);
CREATE POLICY "Public read product tag mappings" ON public.product_tag_mappings FOR SELECT USING (TRUE);
CREATE POLICY "Public read active collections" ON public.collections FOR SELECT USING (is_active = TRUE AND deleted_at IS NULL OR public.is_staff_or_admin());
CREATE POLICY "Public read collection products" ON public.collection_products FOR SELECT USING (TRUE);
CREATE POLICY "Public read approved reviews" ON public.product_reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_staff_or_admin());
CREATE POLICY "Public read inventory" ON public.inventory FOR SELECT USING (TRUE);

-- Customer Review Policies
CREATE POLICY "Customers create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers update own reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id AND status = 'pending') WITH CHECK (auth.uid() = user_id);

-- Staff & Super Admin Full Access Policies
CREATE POLICY "Staff admin full access categories" ON public.categories FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access subcategories" ON public.subcategories FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access brands" ON public.brands FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access products" ON public.products FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access variants" ON public.product_variants FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access media" ON public.product_media FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access attributes" ON public.attribute_definitions FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access attribute values" ON public.attribute_values FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access product attribute values" ON public.product_attribute_values FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access tags" ON public.product_tags FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access tag mappings" ON public.product_tag_mappings FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access collections" ON public.collections FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access collection products" ON public.collection_products FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "To prevent deletion staff admin full access reviews" ON public.product_reviews FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access inventory" ON public.inventory FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
CREATE POLICY "Staff admin full access stock movements" ON public.stock_movements FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

-- ============================================================================
-- PRODUCT CATALOG ENTERPRISE MIGRATION COMPLETE
-- ============================================================================
