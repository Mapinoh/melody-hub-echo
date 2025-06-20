
import React from 'react';
import { Play, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EpisodeCardProps {
  episode: {
    id: string;
    title: string;
    description?: string;
    duration?: number;
    episode_number?: number;
    published_at: string;
    play_count: number;
    podcasts: {
      title: string;
      host_name?: string;
      cover_art_url?: string;
    };
  };
  className?: string;
  onClick?: () => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  className,
  onClick,
}) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
        {/* Episode Art */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          {episode.podcasts.cover_art_url ? (
            <img 
              src={episode.podcasts.cover_art_url} 
              alt={episode.podcasts.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500"></div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-white" />
          </div>
        </div>

        {/* Episode Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{episode.title}</h3>
          <p className="text-gray-400 text-xs mb-2">{episode.podcasts.title}</p>
          {episode.description && (
            <p className="text-gray-500 text-xs mb-2 line-clamp-2">{episode.description}</p>
          )}
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{formatDate(episode.published_at)}</span>
            {episode.duration && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{formatDuration(episode.duration)}</span>
                </div>
              </>
            )}
            <span>•</span>
            <span>{episode.play_count} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
};
