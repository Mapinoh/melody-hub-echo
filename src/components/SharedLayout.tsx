
import React from 'react';
import { ResponsiveSidebar } from '@/components/ResponsiveSidebar';
import { Header } from '@/components/Header';
import { EnhancedMusicPlayer } from '@/components/EnhancedMusicPlayer';
import { FullScreenPlayer } from '@/components/FullScreenPlayer';
import { useState } from 'react';

interface SharedLayoutProps {
  children: React.ReactNode;
  showMusicPlayer?: boolean;
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  children, 
  showMusicPlayer = true 
}) => {
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);

  const handleOpenFullScreenPlayer = () => {
    setIsFullScreenPlayerOpen(true);
  };

  const handleCloseFullScreenPlayer = () => {
    setIsFullScreenPlayerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex w-full">
      {/* Sidebar */}
      <ResponsiveSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Music Player */}
        {showMusicPlayer && (
          <>
            <EnhancedMusicPlayer onOpenFullScreen={handleOpenFullScreenPlayer} />
            <FullScreenPlayer 
              isOpen={isFullScreenPlayerOpen} 
              onClose={handleCloseFullScreenPlayer} 
            />
          </>
        )}
      </div>
    </div>
  );
};
