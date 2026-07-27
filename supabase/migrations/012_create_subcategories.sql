-- ============================================================================
-- 012_create_subcategories.sql
-- Subcategories Table linked to parent categories
-- Purpose: Provides granular sub-categorization in addition to recursive categories.
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

COMMENT ON TABLE public.subcategories IS 'Subcategories table linked to parent categories for structured faceted navigation.';
