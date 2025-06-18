
import React from 'react';
import { Play, Heart, Share, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackCardProps {
  title: string;
  artist: string;
  duration: string;
  plays: string;
  imageUrl?: string;
  isPlaying?: boolean;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  title,
  artist,
  duration,
  plays,
  imageUrl,
  isPlaying = false,
  className,
}) => {
  return (
    <div className={cn(
      'group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-all cursor-pointer',
      className
    )}>
      <div className="flex items-center space-x-4">
        {/* Album Art */}
        <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={16} className="text-white" />
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-medium truncate',
            isPlaying ? 'text-green-400' : 'text-white'
          )}>
            {title}
          </h3>
          <p className="text-gray-400 text-sm truncate">{artist}</p>
        </div>

        {/* Stats */}
        <div className="hidden md:block text-gray-400 text-sm">
          {plays} plays
        </div>
        <div className="text-gray-400 text-sm">
          {duration}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Heart size={16} />
          </button>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
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
