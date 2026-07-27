-- ============================================================================
-- 003_create_addresses.sql
-- Addresses Table for Customer Shipping and Billing
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(150) NOT NULL CHECK (char_length(recipient_name) >= 2),
    phone VARCHAR(50) NOT NULL CHECK (char_length(phone) >= 7),
    address_line1 TEXT NOT NULL CHECK (char_length(address_line1) >= 5),
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
    landmark TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
