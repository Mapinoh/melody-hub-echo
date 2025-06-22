
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DatabaseTrack {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  duration?: number;
  audio_url: string;
  cover_art_url?: string;
  release_date?: string;
  release_type?: string;
  track_number?: number;
  album_id?: string;
  play_count: number;
  like_count: number;
  comment_count: number;
  is_public: boolean;
  created_at: string;
  artist_id: string;
  artists: {
    id: string;
    stage_name: string;
  };
  albums?: {
    id: string;
    title: string;
    cover_art_url?: string;
    release_type: string;
  };
}

export const useSupabaseTracks = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: tracks = [], isLoading, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      console.log('Fetching tracks...');
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          artists (
            id,
            stage_name
          ),
          albums (
            id,
            title,
            cover_art_url,
            release_type
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tracks:', error);
        throw error;
      }
      
      console.log('Fetched tracks:', data);
      return data as DatabaseTrack[];
    },
  });

  // Get user's liked tracks
  const { data: likedTracks = [] } = useQuery({
    queryKey: ['liked-tracks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('likes')
        .select('track_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(like => like.track_id);
    },
    enabled: !!user,
  });

  // Check if track is liked by current user
  const isTrackLiked = (trackId: string) => {
    return likedTracks.includes(trackId);
  };

  const likeMutation = useMutation({
    mutationFn: async (trackId: string) => {
      if (!user) throw new Error('Must be logged in to like tracks');

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', trackId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId);
        if (error) throw error;
        return { action: 'unliked' };
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, track_id: trackId });
        if (error) throw error;
        return { action: 'liked' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      queryClient.invalidateQueries({ queryKey: ['liked-tracks'] });
    },
  });

  const recordPlayMutation = useMutation({
    mutationFn: async ({ trackId, duration, completed }: { trackId: string; duration: number; completed: boolean }) => {
      if (!user) return;

      console.log('Recording play:', { trackId, duration, completed });

      // Record play history
      const { error: historyError } = await supabase
        .from('play_history')
        .insert({
          user_id: user.id,
          track_id: trackId,
          play_duration: duration,
          completed
        });

      if (historyError) {
        console.error('Error recording play history:', historyError);
        throw historyError;
      }

      // Get current play count and increment it
      const { data: currentTrack, error: fetchError } = await supabase
        .from('tracks')
        .select('play_count')
        .eq('id', trackId)
        .single();

      if (fetchError) {
        console.error('Error fetching current track:', fetchError);
        throw fetchError;
      }

      // Update play count
      const { error: countError } = await supabase
        .from('tracks')
        .update({ play_count: (currentTrack?.play_count || 0) + 1 })
        .eq('id', trackId);

      if (countError) {
        console.error('Error updating play count:', countError);
        throw countError;
      }

      console.log('Play recorded successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    },
  });

  return {
    tracks,
    isLoading,
    error,
    likedTracks,
    isTrackLiked,
    likeTrack: likeMutation.mutate,
    recordPlay: recordPlayMutation.mutate,
  };
};
