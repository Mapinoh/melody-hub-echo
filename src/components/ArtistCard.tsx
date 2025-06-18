
import React from 'react';
import { Play, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  name: string;
  followers: string;
  imageUrl?: string;
  isFollowing?: boolean;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  followers,
  imageUrl,
  isFollowing = false,
  className,
}) => {
  return (
    <div className={cn(
      'group bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800 transition-all cursor-pointer',
      className
    )}>
      <div className="flex flex-col items-center text-center">
        {/* Artist Image */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-white" />
          </div>
        </div>

        {/* Artist Info */}
        <h3 className="text-white font-semibold text-lg mb-1">{name}</h3>
        <p className="text-gray-400 text-sm mb-4">{followers} followers</p>

        {/* Follow Button */}
        <button className={cn(
          'flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
          isFollowing
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-white text-black hover:bg-gray-200'
        )}>
          <UserPlus size={16} />
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>
      </div>
    </div>
  );
};
