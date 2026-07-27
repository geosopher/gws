-- ============================================================================
-- 017_create_product_attributes.sql
-- Product Attributes Table for key-value filterable product specs
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
