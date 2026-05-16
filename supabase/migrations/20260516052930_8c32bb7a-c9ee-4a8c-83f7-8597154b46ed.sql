
-- 1. Activity log
CREATE TABLE public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all activity" ON public.admin_activity_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert their own activity" ON public.admin_activity_log
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users view their own activity" ON public.admin_activity_log
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_activity_created ON public.admin_activity_log (created_at DESC);
CREATE INDEX idx_activity_user ON public.admin_activity_log (user_id);

-- 2. Admin notifications
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view notifications" ON public.admin_notifications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update notifications" ON public.admin_notifications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone authed can insert notification" ON public.admin_notifications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_notif_created ON public.admin_notifications (created_at DESC);

-- 3. Admin settings (single-row)
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_enabled BOOLEAN NOT NULL DEFAULT true,
  pdf_enabled BOOLEAN NOT NULL DEFAULT true,
  signups_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view settings" ON public.admin_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update settings" ON public.admin_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert settings" ON public.admin_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.admin_settings (ai_enabled, pdf_enabled, signups_enabled) VALUES (true, true, true);

-- 4. Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- 5. Extend past_trips
ALTER TABLE public.past_trips
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'planned',
  ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE;

-- 6. Extend handle_new_user to log signup + notify admins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_name TEXT;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);

  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.admin_activity_log (user_id, action_type, description, metadata)
  VALUES (NEW.id, 'signup', v_name || ' signed up', jsonb_build_object('email', NEW.email));

  INSERT INTO public.admin_notifications (type, message, metadata)
  VALUES ('signup', 'New user ' || v_name || ' just signed up', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Helper RPC for client logging
CREATE OR REPLACE FUNCTION public.log_activity(_action_type TEXT, _description TEXT, _metadata JSONB DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.admin_activity_log (user_id, action_type, description, metadata)
  VALUES (auth.uid(), _action_type, _description, _metadata);

  INSERT INTO public.admin_notifications (type, message, metadata)
  VALUES (_action_type, _description, _metadata);
END;
$$;

-- 8. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;
ALTER TABLE public.admin_activity_log REPLICA IDENTITY FULL;
ALTER TABLE public.admin_notifications REPLICA IDENTITY FULL;
