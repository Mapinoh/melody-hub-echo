
import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart, MoreHorizontal, Share, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  duration?: number;
  audio_url: string;
}

interface FullScreenPlayerProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  track,
  isOpen,
  onClose,
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs');
  };

  const handleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
    toast.success(isShuffleOn ? 'Shuffle off' : 'Shuffle on');
  };

  const handleRepeat = () => {
    const modes = ['off', 'all', 'one'] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    toast.success(`Repeat ${nextMode === 'off' ? 'off' : nextMode === 'all' ? 'all' : 'one'}`);
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(0.5);
    } else {
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black z-50 overflow-hidden">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-110"
        style={{
          backgroundImage: track.cover ? `url(${track.cover})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10 h-10 w-10"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="text-white">
            <p className="text-sm opacity-70">Playing from playlist</p>
            <p className="font-medium">My Playlist</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={handleShare}
          >
            <Share className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 py-12 max-w-2xl mx-auto">
        {/* Album Art */}
        <div className="relative mb-8 group">
          <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
            {track.cover ? (
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl font-bold text-white opacity-50">
                {track.title.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              onClick={() => toast.success('Added to playlist')}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            {track.title}
          </h1>
          <p className="text-xl text-gray-300 hover:text-white transition-colors cursor-pointer">
            {track.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => onSeek(value[0])}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          {/* Shuffle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShuffle}
            className={`text-white hover:bg-white/10 transition-colors ${
              isShuffleOn ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          {/* Previous */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </Button>

          {/* Play/Pause */}
          <Button
            onClick={onPlayPause}
            className="bg-white hover:bg-gray-200 text-black w-14 h-14 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          {/* Next */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </Button>

          {/* Repeat */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRepeat}
            className={`text-white hover:bg-white/10 transition-colors ${
              repeatMode !== 'off' ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                1
              </span>
            )}
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between w-full max-w-md">
          {/* Like */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`hover:bg-white/10 transition-colors ${
              isLiked ? 'text-green-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>

          {/* Download */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => toast.success('Download started')}
          >
            <Download className="w-5 h-5" />
          </Button>

          {/* Volume */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVolumeToggle}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            
            {/* Volume Slider */}
            <div 
              className={`transition-all duration-300 ${
                showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'
              }`}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => onVolumeChange(value[0] / 100)}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Queue Section (Bottom) */}
      <div className="relative z-10 p-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Next: Loading next track...
          </p>
        </div>
      </div>
    </div>
  );
};
