-- ============================================================================
-- 022_create_stock_movements.sql
-- Stock Movements Auditing Ledger Table
-- Purpose: Immutable audit log recording every inventory change with strict append-only policy.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    movement_type public.stock_movement_type NOT NULL,
    quantity INT NOT NULL,
    previous_quantity INT NOT NULL CHECK (previous_quantity >= 0),
    new_quantity INT NOT NULL CHECK (new_quantity >= 0),
    reason VARCHAR(255),
    reference_type VARCHAR(100), -- e.g. 'order', 'purchase_order', 'return_request'
    reference_id VARCHAR(100),
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger function to enforce stock movement immutability (append-only)
CREATE OR REPLACE FUNCTION public.prevent_stock_movement_tampering()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'Stock movement history is immutable and cannot be updated.';
    ELSIF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Stock movement history is immutable and cannot be deleted.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_immutable_stock_movements ON public.stock_movements;
CREATE TRIGGER trg_immutable_stock_movements
    BEFORE UPDATE OR DELETE ON public.stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_stock_movement_tampering();

COMMENT ON TABLE public.stock_movements IS 'Immutable append-only stock movement ledger tracking all inventory transactions and adjustments.';
