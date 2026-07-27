-- ============================================================================
-- 013_create_brands.sql
-- Brands Table for manufacturer and designer information
-- Purpose: Tracks luxury brands and designers with rich media, SEO metadata, and soft delete.
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

COMMENT ON TABLE public.brands IS 'Enterprise brands and designers directory with SEO and featured merchandising flags.';
