-- ============================================================================
-- 016_create_product_media.sql
-- Product Media Table supporting images and videos across products and variants
-- Purpose: Unified media gallery management for rich product presentation.
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

COMMENT ON TABLE public.product_media IS 'Unified product and variant media library supporting high-res images and promotional videos.';
