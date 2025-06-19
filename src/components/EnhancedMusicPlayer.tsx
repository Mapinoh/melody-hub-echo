
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface EnhancedMusicPlayerProps {
  onOpenFullScreen?: () => void;
}

export const EnhancedMusicPlayer: React.FC<EnhancedMusicPlayerProps> = ({ onOpenFullScreen }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Mobile Mini Player */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-3 z-50">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 cursor-pointer"
            onClick={onOpenFullScreen}
          >
            {currentTrack.imageUrl ? (
              <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0" onClick={onOpenFullScreen}>
            <h4 className="text-white font-medium text-sm truncate">{currentTrack.title}</h4>
            <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                'p-2 rounded transition-colors',
                isLiked ? 'text-green-500' : 'text-gray-400'
              )}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" />
              ) : (
                <Play size={20} className="text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setShowQueue(!showQueue)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronUp size={16} className={cn('transition-transform', showQueue && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div
              className="bg-white rounded-full h-1 transition-all"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Desktop Player */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          {/* Currently Playing */}
          <div className="flex items-center space-x-4 flex-1">
            <div 
              className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 cursor-pointer"
              onClick={onOpenFullScreen}
            >
              {currentTrack.imageUrl ? (
                <img src={currentTrack.imageUrl} alt={currentTrack.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
              )}
            </div>
            <div className="cursor-pointer" onClick={onOpenFullScreen}>
              <h4 className="text-white font-medium">{currentTrack.title}</h4>
              <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                'p-1 rounded transition-colors',
                isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'
              )}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center flex-1 max-w-md">
            <div className="flex items-center space-x-4 mb-2">
              <button 
                onClick={toggleShuffle}
                className={cn(
                  'transition-colors',
                  shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'
                )}
              >
                <Shuffle size={16} />
              </button>
              <button 
                onClick={previousTrack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-black" />
                ) : (
                  <Play size={20} className="text-black ml-0.5" />
                )}
              </button>
              <button 
                onClick={nextTrack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward size={20} />
              </button>
              <button 
                onClick={toggleRepeat}
                className={cn(
                  'transition-colors',
                  repeat ? 'text-green-500' : 'text-gray-400 hover:text-white'
                )}
              >
                <Repeat size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <div 
                className="flex-1 bg-gray-600 rounded-full h-1 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / rect.width) * duration;
                  seek(newTime);
                }}
              >
                <div
                  className="bg-white rounded-full h-1 transition-all"
                  style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 size={16} className="text-gray-400" />
            <div 
              className="w-24 bg-gray-600 rounded-full h-1 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newVolume = (clickX / rect.width) * 100;
                setVolume(newVolume);
              }}
            >
              <div
                className="bg-white rounded-full h-1"
                style={{ width: `${volume}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
