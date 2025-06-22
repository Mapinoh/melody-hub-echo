
import React from 'react';
import { Play, Heart, Share, MoreHorizontal, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSupabaseTracks } from '@/hooks/useSupabaseTracks';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    plays: string;
    imageUrl?: string;
    url?: string;
  };
  isPlaying?: boolean;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying: isCurrentlyPlaying = false,
  className,
}) => {
  const { user } = useAuth();
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();
  const { likeTrack, isTrackLiked } = useSupabaseTracks();

  const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
  const isThisTrackCurrent = currentTrack?.id === track.id;

  const handlePlayPause = () => {
    if (isThisTrackCurrent && isPlaying) {
      pause();
    } else {
      play(track);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to like tracks');
      return;
    }
    
    try {
      likeTrack(track.id);
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `${track.title} by ${track.artist}`,
      url: `${window.location.origin}/track/${track.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard');
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLiked = user ? isTrackLiked(track.id) : false;

  return (
    <div 
      className={cn(
        'group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-all cursor-pointer',
        isThisTrackCurrent && 'bg-gray-700/50',
        className
      )}
      onClick={handlePlayPause}
    >
      <div className="flex items-center space-x-4">
        {/* Album Art */}
        <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 overflow-hidden">
          {track.imageUrl ? (
            <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {track.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isThisTrackPlaying ? (
              <Pause size={16} className="text-white" />
            ) : (
              <Play size={16} className="text-white" />
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-medium truncate',
            isThisTrackCurrent ? 'text-green-400' : 'text-white'
          )}>
            {track.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>

        {/* Stats */}
        <div className="hidden md:block text-gray-400 text-sm">
          {track.plays}
        </div>
        <div className="text-gray-400 text-sm">
          {formatDuration(track.duration)}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleLike}
            className={cn(
              'p-1 transition-colors',
              isLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'
            )}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={handleShare}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Share size={16} />
          </button>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
