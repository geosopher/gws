-- ============================================================================
-- 009_create_policies.sql
-- Enterprise Row Level Security Policies for Profiles, Addresses, and Notifications
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy for users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles super admin full access" ON public.profiles;

-- 1. Users can view their own profile; staff and super admins can view all profiles.
CREATE POLICY "Profiles select policy"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id 
        OR public.is_staff_or_admin()
    );

-- 2. Users can update their own profile (sensitive fields are protected by trigger).
CREATE POLICY "Profiles update policy for users"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = id);

-- 3. Super admin has full unrestricted access (INSERT, UPDATE, DELETE) on profiles.
CREATE POLICY "Profiles super admin full access"
    ON public.profiles FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());


-- ----------------------------------------------------------------------------
-- ADDRESSES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Addresses select policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses modify own policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses update own policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses delete own policy" ON public.addresses;
DROP POLICY IF EXISTS "Addresses super admin full access" ON public.addresses;

-- 1. Customers can manage their own addresses. Staff can view all addresses.
CREATE POLICY "Addresses select policy"
    ON public.addresses FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_staff_or_admin()
    );

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

-- 2. Super admin full access on addresses.
CREATE POLICY "Addresses super admin full access"
    ON public.addresses FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());


-- ----------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Notifications select policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications update own policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications insert policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications delete own policy" ON public.notifications;
DROP POLICY IF EXISTS "Notifications super admin full access" ON public.notifications;

-- 1. Users can view and update their own notifications. Staff can view all.
CREATE POLICY "Notifications select policy"
    ON public.notifications FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_staff_or_admin()
    );

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

-- 2. Super admin full access on notifications.
CREATE POLICY "Notifications super admin full access"
    ON public.notifications FOR ALL
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());
