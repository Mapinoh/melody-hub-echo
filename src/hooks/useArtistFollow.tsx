
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useArtistFollow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get user's followed artists
  const { data: followedArtists = [] } = useQuery({
    queryKey: ['followed-artists', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_follows')
        .select('artist_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(follow => follow.artist_id);
    },
    enabled: !!user,
  });

  // Check if following artist
  const isFollowing = (artistId: string) => {
    return followedArtists.includes(artistId);
  };

  // Follow/unfollow artist
  const followMutation = useMutation({
    mutationFn: async (artistId: string) => {
      if (!user) throw new Error('Must be logged in to follow artists');

      const isCurrentlyFollowing = isFollowing(artistId);

      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('user_id', user.id)
          .eq('artist_id', artistId);
        if (error) throw error;
        return { action: 'unfollowed' };
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert({ user_id: user.id, artist_id: artistId });
        if (error) throw error;
        return { action: 'followed' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['followed-artists'] });
      toast.success(result.action === 'followed' ? 'Following artist' : 'Unfollowed artist');
    },
    onError: (error) => {
      console.error('Follow error:', error);
      toast.error('Failed to update follow status');
    }
  });

  return {
    followedArtists,
    isFollowing,
    toggleFollow: followMutation.mutate,
  };
};
