
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SharedLayout } from '@/components/SharedLayout';
import { SearchResults } from '@/components/SearchResults';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  return (
    <SharedLayout>
      <ResponsiveContainer className="py-4 md:py-6 pb-24">
        {/* Mobile Search Header */}
        <div className="md:hidden mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="What do you want to listen to?"
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700"
              />
            </div>
          </form>
        </div>

        <SearchResults 
          query={query}
          tracks={tracks}
          artists={artists}
          isLoading={isLoading}
        />
      </ResponsiveContainer>
    </SharedLayout>
  );
};

export default Search;
