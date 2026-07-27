-- ============================================================================
-- 018_create_product_tags.sql
-- Product Tags and Many-to-Many Junction Table
-- Purpose: Flexible tagging for promotional merchandising and search indexing.
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

COMMENT ON TABLE public.product_tags IS 'Unique product tags for campaign organization and discovery.';
