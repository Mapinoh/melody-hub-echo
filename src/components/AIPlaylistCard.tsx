
import React from 'react';
import { Play, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIPlaylistCardProps {
  playlist: {
    id: string;
    title: string;
    description?: string;
    playlist_type: string;
    cover_art_url?: string;
    last_updated: string;
  };
  className?: string;
  onClick?: () => void;
}

export const AIPlaylistCard: React.FC<AIPlaylistCardProps> = ({
  playlist,
  className,
  onClick,
}) => {
  const getPlaylistIcon = (type: string) => {
    switch (type) {
      case 'discover_weekly':
        return <Sparkles size={16} className="text-green-400" />;
      case 'daily_mix':
        return <Clock size={16} className="text-blue-400" />;
      default:
        return <Play size={16} className="text-purple-400" />;
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Updated today';
    if (diffDays === 2) return 'Updated yesterday';
    if (diffDays <= 7) return `Updated ${diffDays} days ago`;
    return `Updated ${date.toLocaleDateString()}`;
  };

  return (
    <div 
      className={cn(
        'group bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-all cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Cover Art */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {playlist.cover_art_url ? (
            <img 
              src={playlist.cover_art_url} 
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              {getPlaylistIcon(playlist.playlist_type)}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-white" />
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {getPlaylistIcon(playlist.playlist_type)}
            <h3 className="text-white font-semibold text-sm truncate">{playlist.title}</h3>
          </div>
          {playlist.description && (
            <p className="text-gray-400 text-xs mb-2 line-clamp-2">{playlist.description}</p>
          )}
          <p className="text-gray-500 text-xs">{formatLastUpdated(playlist.last_updated)}</p>
        </div>
      </div>
    </div>
  );
};
