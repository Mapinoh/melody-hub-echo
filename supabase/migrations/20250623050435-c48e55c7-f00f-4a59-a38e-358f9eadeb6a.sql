
-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'artist', 'editorial_playlister', 'listener');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'listener',
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS app_role[]
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT ARRAY_AGG(role)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create admin_actions table for audit log
CREATE TABLE public.admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) NOT NULL,
    action_type TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin actions"
  ON public.admin_actions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Update the handle_new_user function to assign default listener role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_artist_id UUID;
BEGIN
  -- Create profile first
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', '_'))
  );

  -- Create artist profile automatically
  INSERT INTO public.artists (id, stage_name, genre, monthly_listeners, social_links)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Unknown Artist'),
    '{}',
    0,
    '{}'
  )
  RETURNING id INTO new_artist_id;

  -- Link profile to artist
  UPDATE public.profiles SET artist_id = new_artist_id WHERE id = NEW.id;

  -- Assign default listener role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'listener');

  RETURN NEW;
END;
$$;

-- Add RLS policies for better content management
CREATE POLICY "Artists can manage their own tracks"
  ON public.tracks
  FOR ALL
  USING (auth.uid() = artist_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editorial playlisters can view all tracks"
  ON public.tracks
  FOR SELECT
  USING (public.has_role(auth.uid(), 'editorial_playlister') OR public.has_role(auth.uid(), 'admin'));

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON public.tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON public.comments(track_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_user_id ON public.play_history(user_id);
