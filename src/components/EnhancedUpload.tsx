
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload as UploadIcon, Music, Plus, X, Calendar } from 'lucide-react';

interface Track {
  title: string;
  audioFile: File | null;
  trackNumber: number;
}

const GENRES = [
  'Hip-Hop',
  'Pop',
  'Rock',
  'R&B',
  'Jazz',
  'Blues',
  'Country',
  'Electronic',
  'Classical',
  'Reggae',
  'Folk',
  'Punk',
  'Metal',
  'Alternative',
  'Indie',
  'Soul',
  'Funk',
  'Gospel',
  'Afrobeat',
  'Fuji'
];

const EnhancedUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [releaseType, setReleaseType] = useState<'single' | 'ep' | 'album'>('single');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseDate: new Date().toISOString().split('T')[0],
  });
  const [tracks, setTracks] = useState<Track[]>([
    { title: '', audioFile: null, trackNumber: 1 }
  ]);
  const [coverArt, setCoverArt] = useState<File | null>(null);

  const addTrack = () => {
    setTracks([...tracks, { title: '', audioFile: null, trackNumber: tracks.length + 1 }]);
  };

  const removeTrack = (index: number) => {
    if (tracks.length > 1) {
      const newTracks = tracks.filter((_, i) => i !== index);
      // Renumber tracks
      newTracks.forEach((track, i) => track.trackNumber = i + 1);
      setTracks(newTracks);
    }
  };

  const updateTrack = (index: number, field: keyof Track, value: any) => {
    const newTracks = [...tracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    setTracks(newTracks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (releaseType === 'single' && tracks.length !== 1) {
      toast.error('A single can only have one track');
      return;
    }
    if (releaseType === 'ep' && (tracks.length < 2 || tracks.length > 6)) {
      toast.error('An EP must have 2-6 tracks');
      return;
    }
    if (releaseType === 'album' && tracks.length < 7) {
      toast.error('An album must have at least 7 tracks');
      return;
    }

    const invalidTracks = tracks.filter(track => !track.title || !track.audioFile);
    if (invalidTracks.length > 0) {
      toast.error('All tracks must have a title and audio file');
      return;
    }

    if (!formData.genre) {
      toast.error('Please select a genre');
      return;
    }

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

      let albumId = null;

      // Create album if EP or Album
      if (releaseType !== 'single') {
        // Upload cover art for album/EP
        let coverArtUrl = null;
        if (coverArt) {
          const coverFileName = `${user.id}/${Date.now()}-cover-${coverArt.name}`;
          const { error: coverUploadError } = await supabase.storage
            .from('cover-art')
            .upload(coverFileName, coverArt);

          if (coverUploadError) throw coverUploadError;

          const { data: coverUrlData } = supabase.storage
            .from('cover-art')
            .getPublicUrl(coverFileName);
          coverArtUrl = coverUrlData.publicUrl;
        }

        const { data: albumData, error: albumError } = await supabase
          .from('albums')
          .insert({
            artist_id: user.id,
            title: formData.title,
            description: formData.description,
            cover_art_url: coverArtUrl,
            release_type: releaseType,
            release_date: formData.releaseDate,
          })
          .select()
          .single();

        if (albumError) throw albumError;
        albumId = albumData.id;
      }

      setUploadProgress(25);

      // Upload tracks
      const totalTracks = tracks.length;
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        
        // Upload audio file
        const audioFileName = `${user.id}/${Date.now()}-${track.audioFile!.name}`;
        const { error: audioUploadError } = await supabase.storage
          .from('audio-files')
          .upload(audioFileName, track.audioFile!);

        if (audioUploadError) throw audioUploadError;

        // Get audio file URL
        const { data: audioUrlData } = supabase.storage
          .from('audio-files')
          .getPublicUrl(audioFileName);

        // For singles, upload cover art per track
        let trackCoverArtUrl = null;
        if (releaseType === 'single' && coverArt) {
          const coverFileName = `${user.id}/${Date.now()}-cover-${coverArt.name}`;
          const { error: coverUploadError } = await supabase.storage
            .from('cover-art')
            .upload(coverFileName, coverArt);

          if (coverUploadError) throw coverUploadError;

          const { data: coverUrlData } = supabase.storage
            .from('cover-art')
            .getPublicUrl(coverFileName);
          trackCoverArtUrl = coverUrlData.publicUrl;
        }

        // Create track record
        const { error: trackError } = await supabase
          .from('tracks')
          .insert({
            artist_id: user.id,
            album_id: albumId,
            title: releaseType === 'single' ? formData.title : track.title,
            description: releaseType === 'single' ? formData.description : null,
            genre: formData.genre,
            audio_url: audioUrlData.publicUrl,
            cover_art_url: trackCoverArtUrl,
            release_type: releaseType,
            track_number: track.trackNumber,
            release_date: formData.releaseDate,
            duration: 180, // Default duration, could be extracted from audio file
          });

        if (trackError) throw trackError;

        setUploadProgress(25 + ((i + 1) / totalTracks) * 75);
      }

      toast.success(`${releaseType.charAt(0).toUpperCase() + releaseType.slice(1)} uploaded successfully!`);
      
      // Reset form
      setFormData({ 
        title: '', 
        description: '', 
        genre: '', 
        releaseDate: new Date().toISOString().split('T')[0] 
      });
      setTracks([{ title: '', audioFile: null, trackNumber: 1 }]);
      setCoverArt(null);
      setReleaseType('single');

    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl">Please log in to upload music</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Music className="w-6 h-6" />
            Upload Music
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Release Type Selection */}
            <div>
              <Label htmlFor="releaseType" className="text-gray-200">Release Type</Label>
              <Select value={releaseType} onValueChange={(value: 'single' | 'ep' | 'album') => setReleaseType(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="ep">EP (2-6 tracks)</SelectItem>
                  <SelectItem value="album">Album (7+ tracks)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-gray-200">
                {releaseType === 'single' ? 'Track Title' : `${releaseType.toUpperCase()} Title`}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Description */}
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

            {/* Genre */}
            <div>
              <Label htmlFor="genre" className="text-gray-200">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 max-h-60">
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Release Date */}
            <div>
              <Label htmlFor="releaseDate" className="text-gray-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Release Date
              </Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Cover Art */}
            <div>
              <Label htmlFor="cover" className="text-gray-200">Cover Art</Label>
              <Input
                id="cover"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverArt(e.target.files?.[0] || null)}
                className="bg-gray-700 border-gray-600 text-white"
                required={releaseType !== 'single'}
              />
              <p className="text-gray-400 text-sm mt-1">
                {releaseType === 'single' ? 'Optional for singles' : 'Required for EPs and Albums'}
              </p>
            </div>

            {/* Tracks */}
            <div>
              <Label className="text-gray-200">
                {releaseType === 'single' ? 'Audio File' : 'Tracks'}
              </Label>
              {tracks.map((track, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Track {track.trackNumber}</span>
                    {tracks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTrack(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                  
                  {releaseType !== 'single' && (
                    <div className="mb-3">
                      <Input
                        placeholder="Track title"
                        value={track.title}
                        onChange={(e) => updateTrack(index, 'title', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        required
                      />
                    </div>
                  )}
                  
                  <Input
                    type="file"
                    accept=".mp3,.wav,.m4a,.flac"
                    onChange={(e) => updateTrack(index, 'audioFile', e.target.files?.[0] || null)}
                    className="bg-gray-600 border-gray-500 text-white"
                    required
                  />
                </div>
              ))}
              
              {releaseType !== 'single' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTrack}
                  className="mt-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Plus size={16} className="mr-2" />
                  Add Track
                </Button>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <UploadIcon className="w-4 h-4 animate-spin" />
                  Uploading... {uploadProgress.toFixed(0)}%
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadIcon className="w-4 h-4" />
                  Upload {releaseType.charAt(0).toUpperCase() + releaseType.slice(1)}
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUpload;
