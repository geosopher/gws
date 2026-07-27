-- ============================================================================
-- GLOBAL WEALTH STORE - PRODUCT CATALOG ENTERPRISE MIGRATION (PART 3 OF 3)
-- Indexes, Full-Text Search, Row Level Security (RLS) & Policies
-- Copy and paste this script into your Supabase SQL Editor and run it third.
-- ============================================================================

-- 1. INDEXES & GIN FULL-TEXT SEARCH
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
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = TRUE AND deleted_at IS NULL;
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


-- 2. ROW LEVEL SECURITY (RLS) & POLICIES
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
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING ((is_active = TRUE AND deleted_at IS NULL) OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read active subcategories" ON public.subcategories;
CREATE POLICY "Public read active subcategories" ON public.subcategories FOR SELECT USING ((is_active = TRUE AND deleted_at IS NULL) OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read active brands" ON public.brands;
CREATE POLICY "Public read active brands" ON public.brands FOR SELECT USING (deleted_at IS NULL OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING ((status = 'active'::public.product_status AND deleted_at IS NULL) OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read active variants" ON public.product_variants;
CREATE POLICY "Public read active variants" ON public.product_variants FOR SELECT USING (status = 'active'::public.product_status OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read product media" ON public.product_media;
CREATE POLICY "Public read product media" ON public.product_media FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read attribute definitions" ON public.attribute_definitions;
CREATE POLICY "Public read attribute definitions" ON public.attribute_definitions FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read attribute values" ON public.attribute_values;
CREATE POLICY "Public read attribute values" ON public.attribute_values FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read product attribute values" ON public.product_attribute_values;
CREATE POLICY "Public read product attribute values" ON public.product_attribute_values FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read product tags" ON public.product_tags;
CREATE POLICY "Public read product tags" ON public.product_tags FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read product tag mappings" ON public.product_tag_mappings;
CREATE POLICY "Public read product tag mappings" ON public.product_tag_mappings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read active collections" ON public.collections;
CREATE POLICY "Public read active collections" ON public.collections FOR SELECT USING ((is_active = TRUE AND deleted_at IS NULL) OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read collection products" ON public.collection_products;
CREATE POLICY "Public read collection products" ON public.collection_products FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read approved reviews" ON public.product_reviews;
CREATE POLICY "Public read approved reviews" ON public.product_reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_staff_or_admin());

DROP POLICY IF EXISTS "Public read inventory" ON public.inventory;
CREATE POLICY "Public read inventory" ON public.inventory FOR SELECT USING (TRUE);

-- Customer Review Policies
DROP POLICY IF EXISTS "Customers create reviews" ON public.product_reviews;
CREATE POLICY "Customers create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Customers update own reviews" ON public.product_reviews;
CREATE POLICY "Customers update own reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id AND status = 'pending') WITH CHECK (auth.uid() = user_id);

-- Staff & Super Admin Full Access Policies
DROP POLICY IF EXISTS "Staff admin full access categories" ON public.categories;
CREATE POLICY "Staff admin full access categories" ON public.categories FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access subcategories" ON public.subcategories;
CREATE POLICY "Staff admin full access subcategories" ON public.subcategories FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access brands" ON public.brands;
CREATE POLICY "Staff admin full access brands" ON public.brands FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access products" ON public.products;
CREATE POLICY "Staff admin full access products" ON public.products FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access variants" ON public.product_variants;
CREATE POLICY "Staff admin full access variants" ON public.product_variants FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access media" ON public.product_media;
CREATE POLICY "Staff admin full access media" ON public.product_media FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access attributes" ON public.attribute_definitions;
CREATE POLICY "Staff admin full access attributes" ON public.attribute_definitions FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access attribute values" ON public.attribute_values;
CREATE POLICY "Staff admin full access attribute values" ON public.attribute_values FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access product attribute values" ON public.product_attribute_values;
CREATE POLICY "Staff admin full access product attribute values" ON public.product_attribute_values FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access tags" ON public.product_tags;
CREATE POLICY "Staff admin full access tags" ON public.product_tags FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access tag mappings" ON public.product_tag_mappings;
CREATE POLICY "Staff admin full access tag mappings" ON public.product_tag_mappings FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access collections" ON public.collections;
CREATE POLICY "Staff admin full access collections" ON public.collections FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access collection products" ON public.collection_products;
CREATE POLICY "Staff admin full access collection products" ON public.collection_products FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access reviews" ON public.product_reviews;
CREATE POLICY "Staff admin full access reviews" ON public.product_reviews FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access inventory" ON public.inventory;
CREATE POLICY "Staff admin full access inventory" ON public.inventory FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());

DROP POLICY IF EXISTS "Staff admin full access stock movements" ON public.stock_movements;
CREATE POLICY "Staff admin full access stock movements" ON public.stock_movements FOR ALL USING (public.is_staff_or_admin()) WITH CHECK (public.is_staff_or_admin());
