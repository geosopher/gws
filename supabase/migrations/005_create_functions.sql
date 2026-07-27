-- ============================================================================
-- 005_create_functions.sql
-- Database Functions and Triggers Handlers
-- ============================================================================

-- Reusable timestamp updater function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Idempotent automatic profile creation handler on auth.users signup
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

-- Staff and admin authorization helper functions for RLS
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

-- Trigger function to protect sensitive profile fields from non-admin modifications
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

