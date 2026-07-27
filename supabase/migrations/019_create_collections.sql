-- ============================================================================
-- 019_create_collections.sql
-- Collections and Curated Product Groups Table
-- Purpose: Supports curation types like Featured, Trending, Editors Choice, New Arrival, Flash Sale, Seasonal, and Custom Collections.
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

COMMENT ON TABLE public.collections IS 'Curated product groupings supporting editorial merchandising, promotional campaigns, and automated collections.';
