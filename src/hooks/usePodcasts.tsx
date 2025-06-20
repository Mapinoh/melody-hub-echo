
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Podcast {
  id: string;
  title: string;
  description?: string;
  host_name?: string;
  cover_art_url?: string;
  category?: string;
  language: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  creator_id: string;
}

export interface Episode {
  id: string;
  podcast_id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration?: number;
  episode_number?: number;
  season_number: number;
  published_at: string;
  play_count: number;
  like_count: number;
  is_published: boolean;
  created_at: string;
  podcasts: {
    id: string;
    title: string;
    host_name?: string;
    cover_art_url?: string;
  };
}

export const usePodcasts = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: podcasts = [], isLoading: podcastsLoading, error: podcastsError } = useQuery({
    queryKey: ['podcasts'],
    queryFn: async () => {
      console.log('Fetching podcasts...');
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching podcasts:', error);
        throw error;
      }
      
      console.log('Fetched podcasts:', data);
      return data as Podcast[];
    },
  });

  const { data: episodes = [], isLoading: episodesLoading, error: episodesError } = useQuery({
    queryKey: ['episodes'],
    queryFn: async () => {
      console.log('Fetching episodes...');
      const { data, error } = await supabase
        .from('episodes')
        .select(`
          *,
          podcasts (
            id,
            title,
            host_name,
            cover_art_url
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching episodes:', error);
        throw error;
      }
      
      console.log('Fetched episodes:', data);
      return data as Episode[];
    },
  });

  const getPodcastEpisodes = (podcastId: string) => {
    return useQuery({
      queryKey: ['podcast-episodes', podcastId],
      queryFn: async () => {
        console.log('Fetching episodes for podcast:', podcastId);
        const { data, error } = await supabase
          .from('episodes')
          .select(`
            *,
            podcasts (
              id,
              title,
              host_name,
              cover_art_url
            )
          `)
          .eq('podcast_id', podcastId)
          .eq('is_published', true)
          .order('episode_number', { ascending: false });

        if (error) {
          console.error('Error fetching podcast episodes:', error);
          throw error;
        }
        
        console.log('Fetched podcast episodes:', data);
        return data as Episode[];
      },
    });
  };

  const recordEpisodePlay = useMutation({
    mutationFn: async ({ episodeId, duration, completed }: { episodeId: string; duration: number; completed: boolean }) => {
      if (!user) return;

      console.log('Recording episode play:', { episodeId, duration, completed });

      // Update episode play count
      const { data: currentEpisode, error: fetchError } = await supabase
        .from('episodes')
        .select('play_count')
        .eq('id', episodeId)
        .single();

      if (fetchError) {
        console.error('Error fetching current episode:', fetchError);
        throw fetchError;
      }

      const { error: countError } = await supabase
        .from('episodes')
        .update({ play_count: (currentEpisode?.play_count || 0) + 1 })
        .eq('id', episodeId);

      if (countError) {
        console.error('Error updating episode play count:', countError);
        throw countError;
      }

      console.log('Episode play recorded successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });

  return {
    podcasts,
    episodes,
    isLoading: podcastsLoading || episodesLoading,
    error: podcastsError || episodesError,
    getPodcastEpisodes,
    recordEpisodePlay: recordEpisodePlay.mutate,
  };
};
