
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [duration] = useState(180);
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Currently Playing */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-white/20 rounded"></div>
          </div>
          <div>
            <h4 className="text-white font-medium">Midnight Dreams</h4>
            <p className="text-gray-400 text-sm">Luna Artist</p>
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
            <button className="text-gray-400 hover:text-white transition-colors">
              <Shuffle size={16} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black ml-0.5" />
              ) : (
                <Play size={20} className="text-black ml-0.5" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div
                className="bg-white rounded-full h-1 transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Volume2 size={16} className="text-gray-400" />
          <div className="w-24 bg-gray-600 rounded-full h-1">
            <div
              className="bg-white rounded-full h-1"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
