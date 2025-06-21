
-- Create storage buckets for audio files and cover art
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('audio-files', 'audio-files', true),
  ('cover-art', 'cover-art', true);

-- Set up RLS policies for audio-files bucket
CREATE POLICY "Allow authenticated users to upload audio files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to audio files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio-files');

CREATE POLICY "Allow users to update their own audio files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own audio files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Set up RLS policies for cover-art bucket
CREATE POLICY "Allow authenticated users to upload cover art"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cover-art' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to cover art"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cover-art');

CREATE POLICY "Allow users to update their own cover art"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'cover-art' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own cover art"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cover-art' AND auth.uid()::text = (storage.foldername(name))[1]);
