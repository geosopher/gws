-- ============================================================================
-- 002_create_profiles.sql
-- Profiles Table extending Supabase auth.users
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'customer'::public.user_role,
    first_name VARCHAR(100) CHECK (first_name IS NULL OR char_length(first_name) >= 1 AND char_length(first_name) <= 100),
    last_name VARCHAR(100) CHECK (last_name IS NULL OR char_length(last_name) >= 1 AND char_length(last_name) <= 100),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (char_length(email) <= 255 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(50) UNIQUE CHECK (phone IS NULL OR char_length(phone) >= 7),
    avatar_url TEXT,
    gender public.gender_type,
    date_of_birth DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
