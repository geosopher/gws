-- ============================================================================
-- 021_create_stock_movements.sql
-- Stock Movements Auditing Ledger Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    movement_type public.stock_movement_type NOT NULL,
    quantity_change INT NOT NULL,
    previous_quantity INT NOT NULL CHECK (previous_quantity >= 0),
    new_quantity INT NOT NULL CHECK (new_quantity >= 0),
    reference_id VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
