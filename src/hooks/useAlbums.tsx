
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Album {
  id: string;
  title: string;
  description?: string;
  cover_art_url?: string;
  release_type: 'ep' | 'album';
  release_date?: string;
  total_tracks: number;
  total_duration: number;
  is_public: boolean;
  created_at: string;
  artist_id: string;
  artists: {
    id: string;
    stage_name: string;
  };
}

export const useAlbums = () => {
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
        .order('release_date', { ascending: false });

      if (error) {
        console.error('Error fetching albums:', error);
        throw error;
      }
      
      console.log('Fetched albums:', data);
      return data as Album[];
    },
  });

  return {
    albums,
    isLoading,
    error,
  };
};
