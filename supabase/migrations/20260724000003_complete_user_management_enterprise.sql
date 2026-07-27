-- ============================================================================
-- GLOBAL WEALTH STORE - PRODUCTION USER MANAGEMENT ENTERPRISE MIGRATION
-- Target: Supabase PostgreSQL (Production Grade)
-- All-in-one unified migration script for copy-pasting directly into Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM POSTGRESQL ENUMS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'staff', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'prefer_not_to_say');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.notification_type AS ENUM ('info', 'order', 'payment', 'promotion', 'security', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ============================================================================
-- 2. REUSABLE TRIGGER FUNCTIONS
-- ============================================================================

-- Automatically updates the updated_at timestamp on row modification.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Protects sensitive profile fields from non-admin modifications
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN NEW;
    END IF;

    -- Prevent non-super-admins from modifying sensitive fields
    NEW.role := OLD.role;
    NEW.is_active := OLD.is_active;
    NEW.email_verified := OLD.email_verified;
    NEW.deleted_at := OLD.deleted_at;
    NEW.last_login_at := OLD.last_login_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 3. PROFILES TABLE (Extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'customer'::public.user_role,
    first_name VARCHAR(100) CHECK (first_name IS NULL OR (char_length(first_name) >= 1 AND char_length(first_name) <= 100)),
    last_name VARCHAR(100) CHECK (last_name IS NULL OR (char_length(last_name) >= 1 AND char_length(last_name) <= 100)),
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


-- ============================================================================
-- 4. ADDRESSES TABLE
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


-- ============================================================================
-- 5. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type public.notification_type NOT NULL DEFAULT 'info'::public.notification_type,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    icon TEXT,
    action_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================================
-- 6. AUTH & AUTHORIZATION FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        is_active,
        email_verified,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role),
        TRUE,
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() 
          AND role IN ('staff'::public.user_role, 'super_admin'::public.user_role)
          AND is_active = TRUE
          AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() 
          AND role = 'super_admin'::public.user_role
          AND is_active = TRUE
          AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive_fields
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_sensitive_fields();

DROP TRIGGER IF EXISTS trg_addresses_updated_at ON public.addresses;
CREATE TRIGGER trg_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 8. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_active_deleted ON public.profiles(is_active, deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_state_city ON public.addresses(state, city);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_default_address_per_user 
    ON public.addresses(user_id) 
    WHERE (is_default = TRUE);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);


-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy for users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles super admin full access" ON public.profiles;

CREATE POLICY "Profiles select policy"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_staff_or_admin());

CREATE POLICY "Profiles update policy for users"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles super admin full access"
    ON public.profiles FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- Addresses Policies
DROP POLICY IF EXISTS "Addresses select policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses modify own policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses update own policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses delete own policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses super admin full access" ON public.addresses;

CREATE POLICY "Addresses select policy"
    ON public.addresses FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff_or_admin());

CREATE POLICY "Addresses modify own policy"
    ON public.addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Addresses update own policy"
    ON public.addresses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Addresses delete own policy"
    ON public.addresses FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Addresses super admin full access"
    ON public.addresses FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- Notifications Policies
DROP POLICY IF EXISTS "Notifications select policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications update own policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications insert policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications delete own policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications super admin full access" ON public.notifications;

CREATE POLICY "Notifications select policy"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff_or_admin());

CREATE POLICY "Notifications update own policy"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Notifications insert policy"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_staff_or_admin());

CREATE POLICY "Notifications delete own policy"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "Notifications super admin full access"
    ON public.notifications FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- ============================================================================
-- MIGRATION SCRIPT COMPLETE
-- ============================================================================
