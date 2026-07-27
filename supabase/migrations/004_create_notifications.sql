-- ============================================================================
-- 004_create_notifications.sql
-- Notifications Table for User Alerts and Messaging
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
