
-- Add release_type column to tracks table to support singles, EPs, and albums
ALTER TABLE public.tracks ADD COLUMN release_type TEXT DEFAULT 'single' CHECK (release_type IN ('single', 'ep', 'album'));

-- Create albums table for grouping tracks
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_art_url TEXT,
  release_type TEXT NOT NULL CHECK (release_type IN ('ep', 'album')),
  release_date DATE DEFAULT CURRENT_DATE,
  total_tracks INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- in seconds
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add album_id to tracks table for grouping
ALTER TABLE public.tracks ADD COLUMN album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL;

-- Add track_number for ordering within albums/EPs
ALTER TABLE public.tracks ADD COLUMN track_number INTEGER DEFAULT 1;

-- Add RLS policies for albums
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public albums are viewable by everyone" 
  ON public.albums FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Artists can create their own albums" 
  ON public.albums FOR INSERT 
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists can update their own albums" 
  ON public.albums FOR UPDATE 
  USING (auth.uid() = artist_id);

CREATE POLICY "Artists can delete their own albums" 
  ON public.albums FOR DELETE 
  USING (auth.uid() = artist_id);

-- Create indexes for performance
CREATE INDEX idx_albums_artist_id ON public.albums(artist_id);
CREATE INDEX idx_albums_release_date ON public.albums(release_date DESC);
CREATE INDEX idx_tracks_album_id ON public.tracks(album_id);
CREATE INDEX idx_tracks_track_number ON public.tracks(album_id, track_number);

-- Function to update album totals when tracks are added/removed
CREATE OR REPLACE FUNCTION update_album_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.album_id IS NOT NULL THEN
    UPDATE public.albums 
    SET 
      total_tracks = (SELECT COUNT(*) FROM public.tracks WHERE album_id = NEW.album_id),
      total_duration = (SELECT COALESCE(SUM(duration), 0) FROM public.tracks WHERE album_id = NEW.album_id)
    WHERE id = NEW.album_id;
  ELSIF TG_OP = 'DELETE' AND OLD.album_id IS NOT NULL THEN
    UPDATE public.albums 
    SET 
      total_tracks = (SELECT COUNT(*) FROM public.tracks WHERE album_id = OLD.album_id),
      total_duration = (SELECT COALESCE(SUM(duration), 0) FROM public.tracks WHERE album_id = OLD.album_id)
    WHERE id = OLD.album_id;
  ELSIF TG_OP = 'UPDATE' AND (OLD.album_id IS DISTINCT FROM NEW.album_id OR OLD.duration IS DISTINCT FROM NEW.duration) THEN
    -- Update old album if album_id changed
    IF OLD.album_id IS NOT NULL THEN
      UPDATE public.albums 
      SET 
        total_tracks = (SELECT COUNT(*) FROM public.tracks WHERE album_id = OLD.album_id),
        total_duration = (SELECT COALESCE(SUM(duration), 0) FROM public.tracks WHERE album_id = OLD.album_id)
      WHERE id = OLD.album_id;
    END IF;
    -- Update new album
    IF NEW.album_id IS NOT NULL THEN
      UPDATE public.albums 
      SET 
        total_tracks = (SELECT COUNT(*) FROM public.tracks WHERE album_id = NEW.album_id),
        total_duration = (SELECT COALESCE(SUM(duration), 0) FROM public.tracks WHERE album_id = NEW.album_id)
      WHERE id = NEW.album_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating album totals
CREATE TRIGGER trigger_update_album_totals
  AFTER INSERT OR UPDATE OR DELETE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_album_totals();
