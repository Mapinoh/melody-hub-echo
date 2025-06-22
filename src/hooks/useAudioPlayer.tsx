
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useSupabaseTracks } from './useSupabaseTracks';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  imageUrl?: string;
  plays?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  currentIndex: number;
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (tracks: Track[]) => void;
  shuffle: boolean;
  repeat: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  recordPlay?: (playData: { trackId: string; duration: number; completed: boolean }) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [lastPlayTime, setLastPlayTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { recordPlay } = useSupabaseTracks();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Record play progress every 30 seconds
      if (currentTrack && audio.currentTime - lastPlayTime > 30) {
        recordPlay?.({
          trackId: currentTrack.id,
          duration: Math.floor(audio.currentTime),
          completed: false
        });
        setLastPlayTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    const handleEnded = () => {
      // Record completed play
      if (currentTrack) {
        recordPlay?.({
          trackId: currentTrack.id,
          duration: Math.floor(audio.duration),
          completed: true
        });
      }

      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [repeat, currentTrack, recordPlay, lastPlayTime]);

  const play = (track?: Track) => {
    if (track && audioRef.current) {
      setCurrentTrack(track);
      setLastPlayTime(0);
      // Using a dummy audio URL for demo purposes - replace with actual audio URL
      audioRef.current.src = track.url || '/audio/demo-track.mp3';
      audioRef.current.volume = volume / 100;
    }
    
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    
    setCurrentIndex(nextIndex);
    play(queue[nextIndex]);
  };

  const previousTrack = () => {
    if (queue.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    play(queue[prevIndex]);
  };

  const addToQueue = (tracks: Track[]) => {
    setQueue(tracks);
    if (tracks.length > 0 && !currentTrack) {
      setCurrentIndex(0);
      setCurrentTrack(tracks[0]);
    }
  };

  const toggleShuffle = () => setShuffle(!shuffle);
  const toggleRepeat = () => setRepeat(!repeat);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        nextTrack,
        previousTrack,
        addToQueue,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
        recordPlay,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
