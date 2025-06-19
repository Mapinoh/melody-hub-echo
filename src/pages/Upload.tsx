import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SharedLayout } from '@/components/SharedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload as UploadIcon, Music } from 'lucide-react';

const Upload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !audioFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check if user is an artist
      const { data: artistData } = await supabase
        .from('artists')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!artistData) {
        // Create artist profile if doesn't exist
        const { error: artistError } = await supabase
          .from('artists')
          .insert({
            id: user.id,
            stage_name: user.email?.split('@')[0] || 'Unknown Artist',
          });

        if (artistError) throw artistError;
      }

      // Upload audio file
      const audioFileName = `${user.id}/${Date.now()}-${audioFile.name}`;
      const { error: audioUploadError } = await supabase.storage
        .from('audio-files')
        .upload(audioFileName, audioFile);

      if (audioUploadError) throw audioUploadError;
      setUploadProgress(50);

      // Upload cover art if provided
      let coverArtUrl = null;
      if (coverArt) {
        const coverFileName = `${user.id}/${Date.now()}-${coverArt.name}`;
        const { error: coverUploadError } = await supabase.storage
          .from('cover-art')
          .upload(coverFileName, coverArt);

        if (coverUploadError) throw coverUploadError;

        const { data: coverUrlData } = supabase.storage
          .from('cover-art')
          .getPublicUrl(coverFileName);
        coverArtUrl = coverUrlData.publicUrl;
      }

      setUploadProgress(75);

      // Get audio file URL
      const { data: audioUrlData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(audioFileName);

      // Create track record
      const { error: trackError } = await supabase
        .from('tracks')
        .insert({
          artist_id: user.id,
          title: formData.title,
          description: formData.description,
          genre: formData.genre,
          audio_url: audioUrlData.publicUrl,
          cover_art_url: coverArtUrl,
          duration: 180, // Default duration, could be extracted from audio file
        });

      if (trackError) throw trackError;

      setUploadProgress(100);
      toast.success('Track uploaded successfully!');
      
      // Reset form
      setFormData({ title: '', description: '', genre: '' });
      setAudioFile(null);
      setCoverArt(null);

    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <SharedLayout showMusicPlayer={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Please log in to upload tracks</div>
        </div>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <div className="p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="w-6 h-6" />
                Upload New Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-200">Track Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-200">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="genre" className="text-gray-200">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Hip-Hop, Pop, Rock, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="audio" className="text-gray-200">Audio File (MP3, WAV)</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept=".mp3,.wav"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cover" className="text-gray-200">Cover Art (Optional)</Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverArt(e.target.files?.[0] || null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                {isUploading && (
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUploading || !audioFile}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <UploadIcon className="w-4 h-4 animate-spin" />
                      Uploading... {uploadProgress}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UploadIcon className="w-4 h-4" />
                      Upload Track
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SharedLayout>
  );
};

export default Upload;
