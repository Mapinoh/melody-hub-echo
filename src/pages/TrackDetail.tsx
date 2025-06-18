
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { CommentSection } from '@/components/CommentSection';
import { SocialActions } from '@/components/SocialActions';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';

interface TrackDetails {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  audio_url: string;
  cover_art_url?: string;
  play_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  artists: {
    id: string;
    stage_name: string;
  };
}

const TrackDetail = () => {
  const { trackId } = useParams();
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();
  const [track, setTrack] = useState<TrackDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const isCurrentTrack = currentTrack?.id === trackId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  useEffect(() => {
    if (trackId) {
      fetchTrackDetails();
    }
  }, [trackId]);

  const fetchTrackDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          artists (
            id,
            stage_name
          )
        `)
        .eq('id', trackId)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      setTrack(data);
    } catch (error: any) {
      console.error('Error fetching track details:', error);
      toast.error('Failed to load track details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!track) return;

    const trackData = {
      id: track.id,
      title: track.title,
      artist: track.artists.stage_name,
      duration: track.duration,
      url: track.audio_url,
      imageUrl: track.cover_art_url,
      plays: `${track.play_count} plays`,
    };

    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play(trackData);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading track...</div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Track not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Cover Art */}
            <div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl overflow-hidden flex-shrink-0">
              {track.cover_art_url ? (
                <img 
                  src={track.cover_art_url} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-6xl">🎵</div>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {track.title}
              </h1>
              
              <Link 
                to={`/artist/${track.artists.id}`}
                className="text-xl text-gray-300 hover:text-white mb-4 inline-block"
              >
                {track.artists.stage_name}
              </Link>

              <div className="flex flex-wrap gap-4 text-gray-400 mb-6 justify-center md:justify-start">
                <span>{track.play_count.toLocaleString()} plays</span>
                <span>{formatDuration(track.duration)}</span>
                {track.genre && <span>{track.genre}</span>}
                <span>{new Date(track.created_at).getFullYear()}</span>
              </div>

              {track.description && (
                <p className="text-gray-300 mb-6 max-w-2xl">
                  {track.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                <Button
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center"
                >
                  {isCurrentlyPlaying ? (
                    <Pause size={24} className="text-black" />
                  ) : (
                    <Play size={24} className="text-black ml-1" />
                  )}
                </Button>

                <SocialActions
                  trackId={track.id}
                  likeCount={track.like_count}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CommentSection trackId={track.id} />
        </div>
      </div>
    </div>
  );
};

export default TrackDetail;
