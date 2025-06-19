
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { UserLibrary } from '@/components/UserLibrary';
import { useAuth } from '@/hooks/useAuth';

const Library = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <SharedLayout showMusicPlayer={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Please log in to view your library</div>
        </div>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <div className="p-4 md:p-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Library</h1>
            <p className="text-gray-400">Your liked songs and recently played tracks</p>
          </div>
          
          <UserLibrary />
        </div>
      </div>
    </SharedLayout>
  );
};

export default Library;
