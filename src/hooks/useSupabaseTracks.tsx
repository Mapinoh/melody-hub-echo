
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
}

export const useSupabaseTracks = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          artists (
            id,
            stage_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DatabaseTrack[];
    },
  });

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
    },
  });

  const recordPlayMutation = useMutation({
    mutationFn: async ({ trackId, duration, completed }: { trackId: string; duration: number; completed: boolean }) => {
      if (!user) return;

      // Record play history
      const { error: historyError } = await supabase
        .from('play_history')
        .insert({
          user_id: user.id,
          track_id: trackId,
          play_duration: duration,
          completed
        });

      if (historyError) throw historyError;

      // Update play count
      const { error: countError } = await supabase
        .from('tracks')
        .update({ play_count: supabase.sql`play_count + 1` })
        .eq('id', trackId);

      if (countError) throw countError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    },
  });

  return {
    tracks,
    isLoading,
    likeTrack: likeMutation.mutate,
    recordPlay: recordPlayMutation.mutate,
  };
};
