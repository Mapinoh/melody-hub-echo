
import React from 'react';
import { Button } from '@/components/ui/button';
import { Music, Plus } from 'lucide-react';

interface EmptyPlaylistsStateProps {
  onCreateClick: () => void;
}

export const EmptyPlaylistsState: React.FC<EmptyPlaylistsStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-12">
      <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-400 mb-2">No playlists yet</h3>
      <p className="text-gray-500 mb-6">Create your first playlist to organize your favorite tracks</p>
      <Button
        onClick={onCreateClick}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Playlist
      </Button>
    </div>
  );
};
