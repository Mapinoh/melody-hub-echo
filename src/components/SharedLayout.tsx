
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { EnhancedMusicPlayer } from '@/components/EnhancedMusicPlayer';
import { FullScreenPlayer } from '@/components/FullScreenPlayer';
import { MobileNavigation } from '@/components/MobileNavigation';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface SharedLayoutProps {
  children: React.ReactNode;
  showMusicPlayer?: boolean;
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  children, 
  showMusicPlayer = true 
}) => {
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    setVolume
  } = useAudioPlayer();

  const handleOpenFullScreenPlayer = () => {
    setIsFullScreenPlayerOpen(true);
  };

  const handleCloseFullScreenPlayer = () => {
    setIsFullScreenPlayerOpen(false);
  };

  // Create a default track if none is available
  const defaultTrack = {
    id: 'default',
    title: 'No Track Playing',
    artist: 'Unknown Artist',
    audio_url: '',
    duration: 0
  };

  // Convert currentTrack from useAudioPlayer format to FullScreenPlayer format
  const fullScreenTrack = currentTrack ? {
    id: currentTrack.id,
    title: currentTrack.title,
    artist: currentTrack.artist,
    audio_url: currentTrack.url || '',
    duration: currentTrack.duration,
    cover: currentTrack.imageUrl
  } : defaultTrack;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header - Hidden on mobile, handled by MobileNavigation */}
          <div className="hidden md:block">
            <Header />
          </div>
          
          {/* Content Area with mobile-optimized padding */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-24">
            <div className="min-h-full">
              {children}
            </div>
          </main>

          {/* Music Player - Desktop */}
          {showMusicPlayer && (
            <>
              <div className="hidden md:block">
                <EnhancedMusicPlayer onOpenFullScreen={handleOpenFullScreenPlayer} />
              </div>
              <FullScreenPlayer 
                track={fullScreenTrack}
                isOpen={isFullScreenPlayerOpen} 
                onClose={handleCloseFullScreenPlayer}
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                currentTime={currentTime}
                duration={duration}
                onSeek={seek}
                volume={volume}
                onVolumeChange={setVolume}
              />
            </>
          )}

          {/* Mobile Music Player */}
          {showMusicPlayer && currentTrack && (
            <div className="md:hidden fixed bottom-16 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2 z-30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex-shrink-0">
                  {currentTrack.imageUrl ? (
                    <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-full h-full object-cover rounded" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{currentTrack.title}</p>
                  <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
                </div>
                <button
                  onClick={togglePlay}
                  className="p-2 text-white hover:bg-gray-700 rounded"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>
          )}
        </SidebarInset>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
};
