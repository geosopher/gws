-- ============================================================================
-- 011_create_categories.sql
-- Categories Table with unlimited recursive nesting support (parent_id)
-- Purpose: Organizes merchandise hierarchically for enterprise navigation and filtering.
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

COMMENT ON TABLE public.categories IS 'Hierarchical categories table supporting unlimited recursive nesting via parent_id for advanced e-commerce taxonomies.';
COMMENT ON COLUMN public.categories.parent_id IS 'Self-referencing FK supporting multi-level category sub-trees.';
COMMENT ON COLUMN public.categories.slug IS 'URL-friendly unique identifier for category routing.';
