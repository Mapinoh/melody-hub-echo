
import React from 'react';
import { Play, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PodcastCardProps {
  podcast: {
    id: string;
    title: string;
    host_name?: string;
    cover_art_url?: string;
    category?: string;
  };
  className?: string;
  onClick?: () => void;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  className,
  onClick,
}) => {
  return (
    <div 
      className={cn(
        'group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-all cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col">
        {/* Cover Art */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
          {podcast.cover_art_url ? (
            <img 
              src={podcast.cover_art_url} 
              alt={podcast.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Mic size={24} className="text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-white" />
          </div>
        </div>

        {/* Podcast Info */}
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{podcast.title}</h3>
        {podcast.host_name && (
          <p className="text-gray-400 text-xs mb-1">by {podcast.host_name}</p>
        )}
        {podcast.category && (
          <p className="text-gray-500 text-xs capitalize">{podcast.category}</p>
        )}
      </div>
    </div>
  );
};
