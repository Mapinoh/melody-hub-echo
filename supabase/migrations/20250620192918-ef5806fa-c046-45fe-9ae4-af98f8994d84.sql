
-- Add podcast/audio show support
CREATE TABLE public.podcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  host_name TEXT,
  cover_art_url TEXT,
  category TEXT,
  language TEXT DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  creator_id UUID REFERENCES auth.users NOT NULL
);

-- Podcast episodes table
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  podcast_id UUID REFERENCES public.podcasts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  episode_number INTEGER,
  season_number INTEGER DEFAULT 1,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI curated playlists table
CREATE TABLE public.ai_playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  playlist_type TEXT NOT NULL, -- 'discover_weekly', 'daily_mix', 'release_radar', etc.
  cover_art_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI playlist tracks junction table
CREATE TABLE public.ai_playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_playlist_id UUID REFERENCES public.ai_playlists(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT ai_playlist_tracks_content_check CHECK (
    (track_id IS NOT NULL AND episode_id IS NULL) OR 
    (track_id IS NULL AND episode_id IS NOT NULL)
  )
);

-- User listening preferences for AI curation
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  preferred_genres TEXT[],
  preferred_artists UUID[],
  discovery_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  include_podcasts BOOLEAN DEFAULT true,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for podcasts
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public podcasts are viewable by everyone" 
  ON public.podcasts FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can create their own podcasts" 
  ON public.podcasts FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own podcasts" 
  ON public.podcasts FOR UPDATE 
  USING (auth.uid() = creator_id);

-- Add RLS policies for episodes
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published episodes are viewable by everyone" 
  ON public.episodes FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Podcast creators can manage their episodes" 
  ON public.episodes FOR ALL 
  USING (podcast_id IN (SELECT id FROM public.podcasts WHERE creator_id = auth.uid()));

-- Add RLS policies for AI playlists
ALTER TABLE public.ai_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI playlists" 
  ON public.ai_playlists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage AI playlists" 
  ON public.ai_playlists FOR ALL 
  USING (true);

-- Add RLS policies for AI playlist tracks
ALTER TABLE public.ai_playlist_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view AI playlist tracks for their playlists" 
  ON public.ai_playlist_tracks FOR SELECT 
  USING (ai_playlist_id IN (SELECT id FROM public.ai_playlists WHERE user_id = auth.uid()));

-- Add RLS policies for user preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences" 
  ON public.user_preferences FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_episodes_podcast_id ON public.episodes(podcast_id);
CREATE INDEX idx_episodes_published_at ON public.episodes(published_at DESC);
CREATE INDEX idx_ai_playlist_tracks_playlist_id ON public.ai_playlist_tracks(ai_playlist_id);
CREATE INDEX idx_ai_playlist_tracks_position ON public.ai_playlist_tracks(ai_playlist_id, position);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
