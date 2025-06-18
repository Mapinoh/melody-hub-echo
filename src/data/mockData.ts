
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // Changed to number (seconds)
  plays: string;
  imageUrl?: string;
  url?: string;
  genre?: string;
  releaseDate?: string;
}

export interface Artist {
  id: string;
  name: string;
  followers: string;
  imageUrl?: string;
  genre?: string;
  topTracks?: Track[];
}

// Helper function to convert duration string to seconds
const durationToSeconds = (duration: string): number => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Artist',
    duration: durationToSeconds('3:24'),
    plays: '1.2M',
    genre: 'Electronic',
    imageUrl: '/placeholder.svg',
    url: '/audio/midnight-dreams.mp3'
  },
  {
    id: '2',
    title: 'Neon Lights',
    artist: 'Electric Soul',
    duration: durationToSeconds('2:58'),
    plays: '890K',
    genre: 'Synthwave',
    imageUrl: '/placeholder.svg',
    url: '/audio/neon-lights.mp3'
  },
  {
    id: '3',
    title: 'Ocean Waves',
    artist: 'Peaceful Mind',
    duration: durationToSeconds('4:12'),
    plays: '2.1M',
    genre: 'Ambient',
    imageUrl: '/placeholder.svg',
    url: '/audio/ocean-waves.mp3'
  },
  {
    id: '4',
    title: 'City Nights',
    artist: 'Urban Beats',
    duration: durationToSeconds('3:45'),
    plays: '750K',
    genre: 'Hip Hop',
    imageUrl: '/placeholder.svg',
    url: '/audio/city-nights.mp3'
  },
  {
    id: '5',
    title: 'Golden Hour',
    artist: 'Sunset Vibes',
    duration: durationToSeconds('3:18'),
    plays: '1.5M',
    genre: 'Indie Pop',
    imageUrl: '/placeholder.svg',
    url: '/audio/golden-hour.mp3'
  },
  {
    id: '6',
    title: 'Starlight',
    artist: 'Cosmic Journey',
    duration: durationToSeconds('4:05'),
    plays: '623K',
    genre: 'Space Rock',
    imageUrl: '/placeholder.svg',
    url: '/audio/starlight.mp3'
  },
  {
    id: '7',
    title: 'Thunder Storm',
    artist: 'Nature Sounds',
    duration: durationToSeconds('5:12'),
    plays: '445K',
    genre: 'Ambient',
    imageUrl: '/placeholder.svg',
    url: '/audio/thunder-storm.mp3'
  },
  {
    id: '8',
    title: 'Digital Love',
    artist: 'Cyber Dreams',
    duration: durationToSeconds('3:33'),
    plays: '1.8M',
    genre: 'Electronic',
    imageUrl: '/placeholder.svg',
    url: '/audio/digital-love.mp3'
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Luna Artist',
    followers: '245K',
    genre: 'Electronic',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Electric Soul',
    followers: '180K',
    genre: 'Synthwave',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Peaceful Mind',
    followers: '92K',
    genre: 'Ambient',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Urban Beats',
    followers: '156K',
    genre: 'Hip Hop',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Sunset Vibes',
    followers: '134K',
    genre: 'Indie Pop',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Cosmic Journey',
    followers: '78K',
    genre: 'Space Rock',
    imageUrl: '/placeholder.svg'
  }
];

export const featuredPlaylists = [
  { id: '1', name: 'Today\'s Top Hits', description: 'The most played songs right now', trackCount: 50 },
  { id: '2', name: 'Chill Vibes', description: 'Perfect for relaxing', trackCount: 32 },
  { id: '3', name: 'Workout Mix', description: 'High energy tracks', trackCount: 45 },
  { id: '4', name: 'Late Night Drives', description: 'Smooth night driving music', trackCount: 28 },
  { id: '5', name: 'Electronic Essentials', description: 'Best electronic music', trackCount: 67 },
  { id: '6', name: 'Indie Favorites', description: 'Independent artist gems', trackCount: 41 }
];
