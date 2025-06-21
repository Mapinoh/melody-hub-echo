
-- Fix the search_path security warnings for all three functions

-- Update the update_album_totals function with proper search_path
CREATE OR REPLACE FUNCTION public.update_album_totals()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Update the handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', '_'))
  );
  RETURN NEW;
END;
$$;

-- Update the update_track_counts function with proper search_path
CREATE OR REPLACE FUNCTION public.update_track_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
