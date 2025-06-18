
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_artist BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artists table for verified artists
CREATE TABLE public.artists (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  stage_name TEXT NOT NULL,
  genre TEXT[],
  social_links JSONB DEFAULT '{}',
  monthly_listeners INTEGER DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracks table
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  duration INTEGER, -- in seconds
  audio_url TEXT NOT NULL,
  cover_art_url TEXT,
  release_date DATE DEFAULT CURRENT_DATE,
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_art_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_tracks junction table
CREATE TABLE public.playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create play_history table
CREATE TABLE public.play_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  play_duration INTEGER, -- seconds played
  completed BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for artists
CREATE POLICY "Anyone can view artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Artists can update own profile" ON public.artists FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Artists can insert own profile" ON public.artists FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for tracks
CREATE POLICY "Anyone can view public tracks" ON public.tracks FOR SELECT USING (is_public = true);
CREATE POLICY "Artists can view own tracks" ON public.tracks FOR SELECT USING (artist_id = auth.uid());
CREATE POLICY "Artists can insert own tracks" ON public.tracks FOR INSERT WITH CHECK (artist_id = auth.uid());
CREATE POLICY "Artists can update own tracks" ON public.tracks FOR UPDATE USING (artist_id = auth.uid());
CREATE POLICY "Artists can delete own tracks" ON public.tracks FOR DELETE USING (artist_id = auth.uid());

-- RLS Policies for playlists
CREATE POLICY "Users can view public playlists" ON public.playlists FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own playlists" ON public.playlists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own playlists" ON public.playlists FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own playlists" ON public.playlists FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own playlists" ON public.playlists FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for playlist_tracks
CREATE POLICY "Users can view playlist tracks if playlist is viewable" ON public.playlist_tracks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.playlists p 
  WHERE p.id = playlist_id AND (p.is_public = true OR p.user_id = auth.uid())
));
CREATE POLICY "Users can manage own playlist tracks" ON public.playlist_tracks FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.playlists p 
  WHERE p.id = playlist_id AND p.user_id = auth.uid()
));

-- RLS Policies for likes
CREATE POLICY "Users can view all likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON public.likes FOR ALL USING (user_id = auth.uid());

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (NOT is_flagged);
CREATE POLICY "Users can insert comments" ON public.comments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for play_history
CREATE POLICY "Users can view own play history" ON public.play_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own play history" ON public.play_history FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cover-art', 'cover-art', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Anyone can view audio files" ON storage.objects FOR SELECT USING (bucket_id = 'audio-files');
CREATE POLICY "Artists can upload audio files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audio-files' AND auth.role() = 'authenticated');
CREATE POLICY "Artists can update own audio files" ON storage.objects FOR UPDATE USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Artists can delete own audio files" ON storage.objects FOR DELETE USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view cover art" ON storage.objects FOR SELECT USING (bucket_id = 'cover-art');
CREATE POLICY "Artists can upload cover art" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cover-art' AND auth.role() = 'authenticated');
CREATE POLICY "Artists can update own cover art" ON storage.objects FOR UPDATE USING (bucket_id = 'cover-art' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Artists can delete own cover art" ON storage.objects FOR DELETE USING (bucket_id = 'cover-art' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', '_'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update track counts
CREATE OR REPLACE FUNCTION public.update_track_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.tracks SET like_count = like_count + 1 WHERE id = NEW.track_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.tracks SET like_count = like_count - 1 WHERE id = OLD.track_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.tracks SET comment_count = comment_count + 1 WHERE id = NEW.track_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.tracks SET comment_count = comment_count - 1 WHERE id = OLD.track_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for track counts
CREATE TRIGGER update_like_count
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_track_counts();

CREATE TRIGGER update_comment_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_track_counts();
