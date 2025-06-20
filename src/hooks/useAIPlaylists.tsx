
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AIPlaylist {
  id: string;
  title: string;
  description?: string;
  playlist_type: string;
  cover_art_url?: string;
  last_updated: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

export interface AIPlaylistTrack {
  id: string;
  ai_playlist_id: string;
  track_id?: string;
  episode_id?: string;
  position: number;
  added_at: string;
  tracks?: {
    id: string;
    title: string;
    duration?: number;
    audio_url: string;
    cover_art_url?: string;
    artists: {
      id: string;
      stage_name: string;
    };
  };
  episodes?: {
    id: string;
    title: string;
    duration?: number;
    audio_url: string;
    podcasts: {
      id: string;
      title: string;
      host_name?: string;
    };
  };
}

export const useAIPlaylists = () => {
  const { user } = useAuth();

  const { data: aiPlaylists = [], isLoading, error } = useQuery({
    queryKey: ['ai-playlists', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching AI playlists...');
      const { data, error } = await supabase
        .from('ai_playlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('Error fetching AI playlists:', error);
        throw error;
      }
      
      console.log('Fetched AI playlists:', data);
      return data as AIPlaylist[];
    },
    enabled: !!user,
  });

  const getPlaylistTracks = (playlistId: string) => {
    return useQuery({
      queryKey: ['ai-playlist-tracks', playlistId],
      queryFn: async () => {
        console.log('Fetching AI playlist tracks for:', playlistId);
        const { data, error } = await supabase
          .from('ai_playlist_tracks')
          .select(`
            *,
            tracks (
              id,
              title,
              duration,
              audio_url,
              cover_art_url,
              artists (
                id,
                stage_name
              )
            ),
            episodes (
              id,
              title,
              duration,
              audio_url,
              podcasts (
                id,
                title,
                host_name
              )
            )
          `)
          .eq('ai_playlist_id', playlistId)
          .order('position', { ascending: true });

        if (error) {
          console.error('Error fetching AI playlist tracks:', error);
          throw error;
        }
        
        console.log('Fetched AI playlist tracks:', data);
        return data as AIPlaylistTrack[];
      },
    });
  };

  return {
    aiPlaylists,
    isLoading,
    error,
    getPlaylistTracks,
  };
};
