-- ============================================================================
-- 001_create_enums.sql
-- Custom PostgreSQL ENUMs for Global Wealth Store User Management
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
