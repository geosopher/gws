-- ============================================================================
-- 007_create_indexes.sql
-- High-Performance Enterprise Indexes
-- ============================================================================

-- Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_active_deleted ON public.profiles(is_active, deleted_at) WHERE deleted_at IS NULL;

-- Addresses Indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_state_city ON public.addresses(state, city);

-- Partial Unique Index: Prevent multiple default addresses per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_default_address_per_user 
    ON public.addresses(user_id) 
    WHERE (is_default = TRUE);

-- Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
