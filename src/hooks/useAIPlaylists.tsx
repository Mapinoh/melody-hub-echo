
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
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

  const generateDiscoverWeekly = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');

      // Create or update Discover Weekly playlist
      const { data: existingPlaylist } = await supabase
        .from('ai_playlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('playlist_type', 'discover_weekly')
        .single();

      let playlistId;
      
      if (existingPlaylist) {
        // Update existing playlist
        const { data: updatedPlaylist, error: updateError } = await supabase
          .from('ai_playlists')
          .update({ last_updated: new Date().toISOString() })
          .eq('id', existingPlaylist.id)
          .select()
          .single();

        if (updateError) throw updateError;
        playlistId = updatedPlaylist.id;

        // Clear existing tracks
        await supabase
          .from('ai_playlist_tracks')
          .delete()
          .eq('ai_playlist_id', playlistId);
      } else {
        // Create new playlist
        const { data: newPlaylist, error: createError } = await supabase
          .from('ai_playlists')
          .insert({
            user_id: user.id,
            title: 'Discover Weekly',
            description: 'Your weekly mix of fresh music',
            playlist_type: 'discover_weekly',
            cover_art_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
          })
          .select()
          .single();

        if (createError) throw createError;
        playlistId = newPlaylist.id;
      }

      // Get random tracks for the playlist (simple AI simulation)
      const { data: tracks } = await supabase
        .from('tracks')
        .select('id')
        .eq('is_public', true)
        .limit(30);

      if (tracks && tracks.length > 0) {
        // Shuffle and take first 30
        const shuffledTracks = tracks.sort(() => Math.random() - 0.5).slice(0, 30);
        
        const playlistTracks = shuffledTracks.map((track, index) => ({
          ai_playlist_id: playlistId,
          track_id: track.id,
          position: index + 1
        }));

        await supabase
          .from('ai_playlist_tracks')
          .insert(playlistTracks);
      }

      return playlistId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-playlists'] });
    },
  });

  return {
    aiPlaylists,
    isLoading,
    error,
    getPlaylistTracks,
    generateDiscoverWeekly: generateDiscoverWeekly.mutate,
    isGenerating: generateDiscoverWeekly.isPending,
  };
};
