-- ============================================================================
-- 021_create_inventory.sql
-- Inventory Stock Levels and Warehouse Tracking Table
-- Purpose: Precise multi-state warehouse inventory management ensuring non-negative stock.
-- ============================================================================

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

COMMENT ON TABLE public.inventory IS 'Advanced inventory tracking table supporting available, reserved, damaged, and returned stock states with zero negative tolerance.';
