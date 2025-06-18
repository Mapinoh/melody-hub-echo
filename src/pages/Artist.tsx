
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Music, Heart, Share } from 'lucide-react';

interface Artist {
  id: string;
  stage_name: string;
  genre: string[];
  monthly_listeners: number;
  created_at: string;
}

interface Track {
  id: string;
  title: string;
  duration: number;
  play_count: number;
  like_count: number;
  audio_url: string;
  cover_art_url?: string;
  created_at: string;
}

const Artist = () => {
  const { artistId } = useParams();
  const { user } = useAuth();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);

  const fetchArtistData = async () => {
    try {
      // Fetch artist info
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single();

      if (artistError) throw artistError;
      setArtist(artistData);

      // Fetch artist's tracks
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*')
        .eq('artist_id', artistId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (tracksError) throw tracksError;
      setTracks(tracksData || []);

    } catch (error: any) {
      console.error('Error fetching artist data:', error);
      toast.error('Failed to load artist profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please log in to follow artists');
      return;
    }

    try {
      // This would require a follows table - for now just show success
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed artist' : 'Following artist');
    } catch (error: any) {
      toast.error('Failed to update follow status');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artist?.stage_name} on Music App`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading artist profile...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Artist not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Artist Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {artist.stage_name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                <span>{artist.monthly_listeners.toLocaleString()} monthly listeners</span>
                <span>{tracks.length} tracks</span>
                {artist.genre && artist.genre.length > 0 && (
                  <span>{artist.genre.join(', ')}</span>
                )}
              </div>
              
              <div className="flex gap-3 justify-center md:justify-start">
                <Button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isFollowing ? 'currentColor' : 'none'} />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Share className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Music className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Popular Tracks</h2>
          </div>

          {tracks.length > 0 ? (
            <div className="space-y-2">
              {tracks.map((track) => (
                <EnhancedTrackCard
                  key={track.id}
                  track={{
                    id: track.id,
                    title: track.title,
                    artist: artist.stage_name,
                    duration: track.duration,
                    plays: `${track.play_count} plays`,
                    imageUrl: track.cover_art_url,
                    url: track.audio_url,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tracks uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Artist;
