
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { EnhancedMusicPlayer } from '@/components/EnhancedMusicPlayer';
import { FullScreenPlayer } from '@/components/FullScreenPlayer';
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
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <Header />
          
          {/* Content Area */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-24">
            {children}
          </main>

          {/* Music Player */}
          {showMusicPlayer && (
            <>
              <EnhancedMusicPlayer onOpenFullScreen={handleOpenFullScreenPlayer} />
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
