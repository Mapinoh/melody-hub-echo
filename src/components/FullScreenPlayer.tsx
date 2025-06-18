
import React, { useState } from 'react';
import { X, Heart, Share, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({ isOpen, onClose }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayer();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!isOpen || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-purple-900/50 to-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X size={24} />
        </Button>
        <h1 className="text-white font-medium">Now Playing</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <MoreHorizontal size={24} />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg aspect-square">
          {currentTrack.imageUrl ? (
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-6xl md:text-8xl">🎵</div>
            </div>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="px-6 md:px-8 text-center">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 truncate">
          {currentTrack.title}
        </h2>
        <p className="text-gray-300 text-lg md:text-xl mb-6 truncate">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 md:px-8 mb-4">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-gray-400 text-sm mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 md:px-8 pb-8">
        <div className="flex items-center justify-center space-x-6 md:space-x-8 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShuffle}
            className={`text-white hover:bg-white/10 ${shuffle ? 'text-green-400' : ''}`}
          >
            <Shuffle size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={previousTrack}
            className="text-white hover:bg-white/10"
          >
            <SkipBack size={24} />
          </Button>
          
          <Button
            onClick={togglePlay}
            className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause size={28} className="text-black" />
            ) : (
              <Play size={28} className="text-black ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="text-white hover:bg-white/10"
          >
            <SkipForward size={24} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRepeat}
            className={`text-white hover:bg-white/10 ${repeat ? 'text-green-400' : ''}`}
          >
            <Repeat size={20} />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Heart size={24} />
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-white hover:bg-white/10"
            >
              <Volume2 size={24} />
            </Button>
            {showVolumeSlider && (
              <div className="w-24">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Share size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};
