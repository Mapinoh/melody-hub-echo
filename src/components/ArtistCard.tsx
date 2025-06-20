
import React from 'react';
import { Play, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artist {
  id: string;
  stage_name: string;
  monthly_listeners?: number;
  social_links?: any;
  genre?: string[];
  created_at?: string;
  verified_at?: string;
}

interface ArtistCardProps {
  artist: Artist;
  className?: string;
  onClick?: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  className,
  onClick,
}) => {
  const followersText = artist.monthly_listeners 
    ? `${artist.monthly_listeners} monthly listeners`
    : '0 monthly listeners';

  return (
    <div 
      className={cn(
        'group bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800 transition-all cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        {/* Artist Image */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-white" />
          </div>
        </div>

        {/* Artist Info */}
        <h3 className="text-white font-semibold text-lg mb-1">{artist.stage_name}</h3>
        <p className="text-gray-400 text-sm mb-4">{followersText}</p>

        {/* Follow Button */}
        <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white text-black hover:bg-gray-200">
          <UserPlus size={16} />
          <span>Follow</span>
        </button>
      </div>
    </div>
  );
};
