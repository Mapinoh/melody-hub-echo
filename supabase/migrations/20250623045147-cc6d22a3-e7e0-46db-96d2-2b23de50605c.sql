
-- Create artist_verifications table for verification requests
CREATE TABLE public.artist_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  verification_documents JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_library table for users to save tracks
CREATE TABLE public.user_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Add verified status to artists table
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Add followers count to artists table
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;

-- Create user_follows table for following artists
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, artist_id)
);

-- Update profiles table to link with artists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS artist_id UUID REFERENCES public.artists(id);

-- Enable RLS on new tables
ALTER TABLE public.artist_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for artist_verifications
CREATE POLICY "Artists can view their own verification requests" 
  ON public.artist_verifications 
  FOR SELECT 
  USING (artist_id IN (SELECT id FROM public.artists WHERE id = auth.uid()));

CREATE POLICY "Artists can create verification requests" 
  ON public.artist_verifications 
  FOR INSERT 
  WITH CHECK (artist_id IN (SELECT id FROM public.artists WHERE id = auth.uid()));

-- RLS policies for user_library
CREATE POLICY "Users can view their own library" 
  ON public.user_library 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their library" 
  ON public.user_library 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their library" 
  ON public.user_library 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for user_follows
CREATE POLICY "Users can view their follows" 
  ON public.user_follows 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can follow artists" 
  ON public.user_follows 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow artists" 
  ON public.user_follows 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update follower counts
CREATE OR REPLACE FUNCTION public.update_artist_followers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.artists SET followers_count = followers_count + 1 WHERE id = NEW.artist_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.artists SET followers_count = followers_count - 1 WHERE id = OLD.artist_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for follower count updates
CREATE TRIGGER update_artist_followers_trigger
  AFTER INSERT OR DELETE ON public.user_follows
  FOR EACH ROW EXECUTE FUNCTION public.update_artist_followers();

-- Update the existing handle_new_user function to create artist profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  RETURN NEW;
END;
$function$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_library_user_id ON public.user_library(user_id);
CREATE INDEX IF NOT EXISTS idx_user_library_track_id ON public.user_library(track_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_user_id ON public.user_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_artist_id ON public.user_follows(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_verifications_artist_id ON public.artist_verifications(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_verifications_status ON public.artist_verifications(status);
