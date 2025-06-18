
import React from 'react';
import { Play, Heart, Share, MoreHorizontal, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  plays: string;
  imageUrl?: string;
  url?: string;
}

interface EnhancedTrackCardProps {
  track: Track;
  className?: string;
}

export const EnhancedTrackCard: React.FC<EnhancedTrackCardProps> = ({
  track,
  className,
}) => {
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlayPause = () => {
    const trackData = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]),
      url: track.url,
      imageUrl: track.imageUrl,
      plays: track.plays,
    };

    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play(trackData);
    }
  };

  return (
    <div className={cn(
      'group bg-gray-800/50 rounded-lg p-3 md:p-4 hover:bg-gray-800 transition-all cursor-pointer touch-manipulation',
      isCurrentTrack && 'bg-gray-800',
      className
    )}>
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Album Art */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 overflow-hidden">
          {track.imageUrl ? (
            <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isCurrentlyPlaying ? (
                <Pause size={16} className="text-black" />
              ) : (
                <Play size={16} className="text-black ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-medium truncate text-sm md:text-base',
            isCurrentTrack ? 'text-green-400' : 'text-white'
          )}>
            {track.title}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm truncate">{track.artist}</p>
        </div>

        {/* Stats - Hidden on small mobile */}
        <div className="hidden sm:block text-gray-400 text-xs md:text-sm">
          {track.plays}
        </div>
        <div className="text-gray-400 text-xs md:text-sm">
          {track.duration}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors touch-manipulation">
            <Heart size={14} className="md:w-4 md:h-4" />
          </button>
          <button className="p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors touch-manipulation">
            <Share size={14} className="md:w-4 md:h-4" />
          </button>
          <button className="p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors touch-manipulation">
            <MoreHorizontal size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Play Button - Visible on tap */}
      <div className="md:hidden mt-2 opacity-0 group-active:opacity-100 transition-opacity">
        <button
          onClick={handlePlayPause}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium text-sm"
        >
          {isCurrentlyPlaying ? 'Pause' : 'Play Now'}
        </button>
      </div>
    </div>
  );
};
