-- ============================================================================
-- 017_create_attributes.sql
-- Normalized Product Attributes Tables (Definitions, Values, and Product Mapping)
-- Purpose: Allows robust faceted filtering (Color, Size, Material, Gender, Occasion, Season, Fabric, Style) without duplication.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.attribute_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    display_type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, color_swatch, button
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id UUID NOT NULL REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
    value VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    meta_value TEXT, -- e.g. Hex code for color swatch
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_attribute_value_per_def UNIQUE (attribute_id, slug)
);

CREATE TABLE IF NOT EXISTS public.product_attribute_values (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    attribute_value_id UUID NOT NULL REFERENCES public.attribute_values(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, attribute_value_id)
);

COMMENT ON TABLE public.attribute_definitions IS 'Defines filterable attribute types such as Color, Size, Material, Gender, Occasion, Season, Fabric, Style.';
COMMENT ON TABLE public.attribute_values IS 'Specific values belonging to attribute definitions with optional swatch metadata.';
COMMENT ON TABLE public.product_attribute_values IS 'Junction table mapping products to normalized attribute values for lightning-fast faceted search.';
