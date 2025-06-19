
import React from 'react';
import { EnhancedTrackCard } from '@/components/EnhancedTrackCard';
import { ArtistCard } from '@/components/ArtistCard';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  query: string;
  tracks: any[];
  artists: any[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  tracks,
  artists,
  isLoading
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white text-center">Searching...</div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="p-6">
        <div className="text-gray-400 text-center">
          Start typing to search for music, artists, and more
        </div>
      </div>
    );
  }

  const hasResults = tracks.length > 0 || artists.length > 0;

  if (!hasResults) {
    return (
      <div className="p-6">
        <div className="text-gray-400 text-center">
          No results found for "{query}"
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {tracks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Tracks</h2>
          <div className="space-y-2">
            {tracks.slice(0, 10).map((track) => (
              <EnhancedTrackCard 
                key={track.id} 
                track={track}
                onClick={() => navigate(`/track/${track.id}`)}
              />
            ))}
          </div>
          {tracks.length > 10 && (
            <button className="mt-4 text-gray-400 hover:text-white text-sm">
              Show all {tracks.length} tracks
            </button>
          )}
        </section>
      )}

      {artists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artists.slice(0, 12).map((artist) => (
              <ArtistCard 
                key={artist.id} 
                artist={artist}
                onClick={() => navigate(`/artist/${artist.id}`)}
              />
            ))}
          </div>
          {artists.length > 12 && (
            <button className="mt-4 text-gray-400 hover:text-white text-sm">
              Show all {artists.length} artists
            </button>
          )}
        </section>
      )}
    </div>
  );
};
