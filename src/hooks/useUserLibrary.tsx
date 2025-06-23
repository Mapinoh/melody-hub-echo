
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useUserLibrary = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get user's library tracks
  const { data: libraryTracks = [], isLoading } = useQuery({
    queryKey: ['user-library', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_library')
        .select(`
          track_id,
          added_at,
          tracks (
            *,
            artists (
              id,
              stage_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Check if track is in library
  const isInLibrary = (trackId: string) => {
    return libraryTracks.some(item => item.track_id === trackId);
  };

  // Add/remove track from library
  const libraryMutation = useMutation({
    mutationFn: async (trackId: string) => {
      if (!user) throw new Error('Must be logged in to manage library');

      const isCurrentlyInLibrary = isInLibrary(trackId);

      if (isCurrentlyInLibrary) {
        // Remove from library
        const { error } = await supabase
          .from('user_library')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add to library
        const { error } = await supabase
          .from('user_library')
          .insert({ user_id: user.id, track_id: trackId });
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user-library'] });
      toast.success(result.action === 'added' ? 'Added to library' : 'Removed from library');
    },
    onError: (error) => {
      console.error('Library error:', error);
      toast.error('Failed to update library');
    }
  });

  return {
    libraryTracks,
    isLoading,
    isInLibrary,
    toggleLibrary: libraryMutation.mutate,
  };
};
