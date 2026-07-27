-- ============================================================================
-- GLOBAL WEALTH STORE - PRODUCT CATALOG ENTERPRISE MIGRATION (PART 2 OF 3)
-- Attributes, Tags, Collections, Reviews, Inventory, Stock Movements, Triggers
-- Copy and paste this script into your Supabase SQL Editor and run it second.
-- ============================================================================

-- 8. NORMALIZED ATTRIBUTES
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

-- 9. TAGS
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

-- 10. COLLECTIONS
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

-- 11. PRODUCT REVIEWS
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

-- 12. INVENTORY
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

-- 13. STOCK MOVEMENTS (Immutable Ledger)
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

-- 14. FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
