
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SharedLayout } from '@/components/SharedLayout';
import { PlaylistCard } from '@/components/PlaylistCard';
import { CreatePlaylistDialog } from '@/components/CreatePlaylistDialog';
import { EmptyPlaylistsState } from '@/components/EmptyPlaylistsState';
import { toast } from 'sonner';

interface Playlist {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  track_count?: number;
}

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks(count)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error: any) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (formData: {
    title: string;
    description: string;
    is_public: boolean;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          is_public: formData.is_public,
        });

      if (error) throw error;

      toast.success('Playlist created successfully!');
      fetchPlaylists();
    } catch (error: any) {
      toast.error(`Failed to create playlist: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <SharedLayout showMusicPlayer={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Please log in to view your playlists</div>
        </div>
      </SharedLayout>
    );
  }

  if (loading) {
    return (
      <SharedLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading playlists...</div>
        </div>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <div className="p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">My Playlists</h1>
            <CreatePlaylistDialog onCreatePlaylist={handleCreatePlaylist} />
          </div>

          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard 
                  key={playlist.id} 
                  playlist={playlist}
                  onClick={() => console.log('Clicked playlist:', playlist.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyPlaylistsState onCreateClick={() => {}} />
          )}
        </div>
      </div>
    </SharedLayout>
  );
};

export default Playlists;
