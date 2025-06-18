
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ResponsiveSidebar } from "@/components/ResponsiveSidebar";
import { EnhancedMusicPlayer } from "@/components/EnhancedMusicPlayer";
import { EnhancedTrackCard } from "@/components/EnhancedTrackCard";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useSupabaseTracks } from "@/hooks/useSupabaseTracks";
import { useAuth } from "@/hooks/useAuth";
import { mockTracks } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const { addToQueue } = useAudioPlayer();
  const { tracks: dbTracks, isLoading } = useSupabaseTracks();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Convert database tracks to the format expected by the audio player
  const convertedTracks = dbTracks.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artists.stage_name,
    duration: track.duration || 0,
    plays: track.play_count.toLocaleString(),
    imageUrl: track.cover_art_url,
    url: track.audio_url,
    genre: track.genre,
  }));

  // Use database tracks if available, otherwise fall back to mock data
  const allTracks = convertedTracks.length > 0 ? convertedTracks : mockTracks;

  useEffect(() => {
    if (allTracks.length > 0) {
      addToQueue(allTracks);
    }
  }, [allTracks, addToQueue]);

  const handlePlayerClick = () => {
    if (isMobile) {
      setIsFullScreenOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tracks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        <ResponsiveSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-24">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.email?.split('@')[0] || 'Music Lover'}!
              </h1>
              <p className="text-gray-400">Discover your next favorite track</p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Featured Tracks</h2>
              <div className="space-y-2 md:space-y-3">
                {allTracks.slice(0, 8).map((track) => (
                  <EnhancedTrackCard key={track.id} track={track} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      <div onClick={handlePlayerClick} className="cursor-pointer md:cursor-default">
        <EnhancedMusicPlayer />
      </div>

      <FullScreenPlayer
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
      />
    </div>
  );
};

export default Index;
