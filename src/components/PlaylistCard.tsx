
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Lock, Globe } from 'lucide-react';

interface PlaylistCardProps {
  playlist: {
    id: string;
    title: string;
    description?: string;
    is_public: boolean;
    created_at: string;
    track_count?: number;
  };
  onClick?: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
          <Music className="w-16 h-16 text-white" />
        </div>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="truncate">{playlist.title}</span>
          {playlist.is_public ? (
            <Globe className="w-4 h-4 text-green-400" />
          ) : (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {playlist.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {playlist.description}
          </p>
        )}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{playlist.track_count || 0} tracks</span>
          <span>
            {new Date(playlist.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
