-- ============================================================================
-- 020_create_product_reviews.sql
-- Product Reviews and Ratings Table
-- Purpose: Collects customer feedback with moderation status; only approved reviews affect product average rating.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review TEXT NOT NULL,
    status public.review_status NOT NULL DEFAULT 'pending'::public.review_status,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to recalculate average rating and review count on product
CREATE OR REPLACE FUNCTION public.update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET 
        average_rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM public.product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
              AND status = 'approved'
        ), 0.00),
        review_count = (
            SELECT COUNT(*)
            FROM public.product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
              AND status = 'approved'
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_product_ratings ON public.product_reviews;
CREATE TRIGGER trg_update_product_ratings
    AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_rating_stats();

COMMENT ON TABLE public.product_reviews IS 'Customer product reviews with approval workflow and automated product rating aggregation.';
