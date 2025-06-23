
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { UserLibrary } from '@/components/UserLibrary';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useAuth } from '@/hooks/useAuth';

const Library = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <SharedLayout showMusicPlayer={false}>
        <ResponsiveContainer className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-lg md:text-xl text-center px-4">
            Please log in to view your library
          </div>
        </ResponsiveContainer>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <ResponsiveContainer className="py-4 md:py-6 pb-24">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Library</h1>
          <p className="text-gray-400 text-sm md:text-base">Your liked songs and recently played tracks</p>
        </div>
        
        <UserLibrary />
      </ResponsiveContainer>
    </SharedLayout>
  );
};

export default Library;
