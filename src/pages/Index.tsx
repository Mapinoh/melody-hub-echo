
import { useSupabaseTracks } from "@/hooks/useSupabaseTracks";
import { useAuth } from "@/hooks/useAuth";
import { EnhancedTrackCard } from "@/components/EnhancedTrackCard";
import { EnhancedMusicPlayer } from "@/components/EnhancedMusicPlayer";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Music, Upload, User, List, Search, Home, LogOut } from "lucide-react";

const Index = () => {
  const { tracks, isLoading } = useSupabaseTracks();
  const { user, signOut } = useAuth();
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artists.stage_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <Music className="w-6 h-6" />
              MusicApp
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link to="/upload" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Upload className="w-4 h-4" />
                Upload
              </Link>
              <Link to="/playlists" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <List className="w-4 h-4" />
                Playlists
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden sm:block relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracks, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-64"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mt-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-full"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-400">Discover new music and upload your own tracks</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/upload">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 hover:from-purple-700 hover:to-pink-700 transition-colors">
                <Upload className="w-6 h-6 text-white mb-2" />
                <div className="text-white font-medium">Upload</div>
                <div className="text-gray-200 text-sm">Share your music</div>
              </div>
            </Link>
            
            <Link to="/playlists">
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                <List className="w-6 h-6 text-white mb-2" />
                <div className="text-white font-medium">Playlists</div>
                <div className="text-gray-400 text-sm">Organize tracks</div>
              </div>
            </Link>
            
            <button
              onClick={() => setIsFullScreenOpen(true)}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors text-left"
            >
              <Music className="w-6 h-6 text-white mb-2" />
              <div className="text-white font-medium">Player</div>
              <div className="text-gray-400 text-sm">Full screen</div>
            </button>
            
            <Link to="/profile">
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                <User className="w-6 h-6 text-white mb-2" />
                <div className="text-white font-medium">Profile</div>
                <div className="text-gray-400 text-sm">Settings</div>
              </div>
            </Link>
          </div>

          {/* Tracks Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery ? `Search Results (${filteredTracks.length})` : 'Latest Tracks'}
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-white text-xl">Loading tracks...</div>
              </div>
            ) : filteredTracks.length > 0 ? (
              <div className="space-y-2">
                {filteredTracks.map((track) => (
                  <Link key={track.id} to={`/track/${track.id}`}>
                    <EnhancedTrackCard
                      track={{
                        id: track.id,
                        title: track.title,
                        artist: track.artists.stage_name,
                        duration: track.duration || 180,
                        plays: `${track.play_count} plays`,
                        imageUrl: track.cover_art_url,
                        url: track.audio_url,
                      }}
                      className="hover:bg-gray-750"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  {searchQuery ? 'No tracks found' : 'No tracks available'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Be the first to upload a track!'
                  }
                </p>
                {!searchQuery && (
                  <Link to="/upload">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Track
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-20 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/upload" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <Upload className="w-5 h-5" />
            <span className="text-xs">Upload</span>
          </Link>
          <Link to="/playlists" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <List className="w-5 h-5" />
            <span className="text-xs">Playlists</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Audio Player */}
      <EnhancedMusicPlayer />

      {/* Full Screen Player */}
      <FullScreenPlayer
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
      />
    </div>
  );
};

export default Index;
