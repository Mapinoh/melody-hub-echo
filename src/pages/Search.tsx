
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SharedLayout } from '@/components/SharedLayout';
import { SearchResults } from '@/components/SearchResults';
import { useSupabaseTracks } from '@/hooks/useSupabaseTracks';
import { supabase } from '@/integrations/supabase/client';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      searchContent(query.trim());
    } else {
      setTracks([]);
      setArtists([]);
    }
  }, [query]);

  const searchContent = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Search tracks
      const { data: tracksData } = await supabase
        .from('tracks')
        .select(`
          *,
          artists (
            id,
            stage_name
          )
        `)
        .eq('is_public', true)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,genre.ilike.%${searchQuery}%`)
        .limit(20);

      // Search artists
      const { data: artistsData } = await supabase
        .from('artists')
        .select('*')
        .ilike('stage_name', `%${searchQuery}%`)
        .limit(20);

      // Transform tracks to match expected format
      const formattedTracks = (tracksData || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artists.stage_name,
        duration: track.duration || 180,
        plays: `${track.play_count} plays`,
        imageUrl: track.cover_art_url,
        url: track.audio_url
      }));

      setTracks(formattedTracks);
      setArtists(artistsData || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SharedLayout>
      <div className="pb-24">
        <SearchResults 
          query={query}
          tracks={tracks}
          artists={artists}
          isLoading={isLoading}
        />
      </div>
    </SharedLayout>
  );
};

export default Search;
