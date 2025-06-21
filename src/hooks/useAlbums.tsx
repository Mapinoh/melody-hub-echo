
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Album {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  cover_art_url?: string;
  release_type: 'ep' | 'album';
  release_date: string;
  total_tracks: number;
  total_duration: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  artists: {
    id: string;
    stage_name: string;
  };
}

export const useAlbums = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: albums = [], isLoading, error } = useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      console.log('Fetching albums...');
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          artists (
            id,
            stage_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching albums:', error);
        throw error;
      }
      
      console.log('Fetched albums:', data);
      return data as Album[];
    },
  });

  const createAlbum = useMutation({
    mutationFn: async (albumData: Omit<Album, 'id' | 'created_at' | 'updated_at' | 'artists'>) => {
      const { data, error } = await supabase
        .from('albums')
        .insert(albumData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  return {
    albums,
    isLoading,
    error,
    createAlbum: createAlbum.mutate,
  };
};
