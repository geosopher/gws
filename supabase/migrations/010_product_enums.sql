-- ============================================================================
-- 010_product_enums.sql
-- Enterprise Product Catalog Enums for Global Wealth Store
-- Defines status types, inventory states, stock movement ledger types, media types,
-- review moderation states, and curated collection types.
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE public.product_status AS ENUM ('draft', 'active', 'archived', 'out_of_stock');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.inventory_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock', 'backorder');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.stock_movement_type AS ENUM (
        'purchase',
        'sale',
        'return',
        'adjustment',
        'damage',
        'restock',
        'reservation',
        'release'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.media_type AS ENUM ('image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.collection_type AS ENUM (
        'featured',
        'trending',
        'editors_choice',
        'new_arrival',
        'flash_sale',
        'seasonal',
        'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
