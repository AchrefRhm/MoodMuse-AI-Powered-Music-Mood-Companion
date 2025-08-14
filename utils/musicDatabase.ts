import { Track } from '@/types/mood';

export const SAMPLE_TRACKS: Track[] = [
  // Happy tracks
  {
    id: 'happy-1',
    title: 'Sunshine Symphony',
    artist: 'Bright Horizons',
    album: 'Golden Days',
    duration: 210,
    mood_tags: ['happy', 'upbeat', 'positive'],
    energy: 8,
    valence: 9,
    genre: 'pop',
    cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'happy-2',
    title: 'Dancing in Light',
    artist: 'Joy Collective',
    album: 'Radiant Moments',
    duration: 195,
    mood_tags: ['happy', 'energetic', 'fun'],
    energy: 9,
    valence: 8,
    genre: 'electronic',
    cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  
  // Sad tracks
  {
    id: 'sad-1',
    title: 'Rainy Reflections',
    artist: 'Melancholy Moon',
    album: 'Quiet Storms',
    duration: 245,
    mood_tags: ['sad', 'melancholy', 'introspective'],
    energy: 3,
    valence: 2,
    genre: 'indie',
    cover_url: 'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'sad-2',
    title: 'Echoes of Yesterday',
    artist: 'Somber Souls',
    album: 'Fading Light',
    duration: 280,
    mood_tags: ['sad', 'nostalgic', 'emotional'],
    energy: 2,
    valence: 3,
    genre: 'classical',
    cover_url: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Energetic tracks
  {
    id: 'energetic-1',
    title: 'Electric Thunder',
    artist: 'Power Surge',
    album: 'High Voltage',
    duration: 180,
    mood_tags: ['energetic', 'powerful', 'intense'],
    energy: 10,
    valence: 8,
    genre: 'rock',
    cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'energetic-2',
    title: 'Neon Rush',
    artist: 'Cyber Beats',
    album: 'Digital Dreams',
    duration: 165,
    mood_tags: ['energetic', 'electronic', 'futuristic'],
    energy: 9,
    valence: 7,
    genre: 'electronic',
    cover_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Calm tracks
  {
    id: 'calm-1',
    title: 'Gentle Waves',
    artist: 'Ocean Whispers',
    album: 'Serenity',
    duration: 320,
    mood_tags: ['calm', 'peaceful', 'meditative'],
    energy: 2,
    valence: 7,
    genre: 'ambient',
    cover_url: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'calm-2',
    title: 'Mountain Meditation',
    artist: 'Tranquil Minds',
    album: 'Inner Peace',
    duration: 380,
    mood_tags: ['calm', 'spiritual', 'grounding'],
    energy: 3,
    valence: 8,
    genre: 'new-age',
    cover_url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Romantic tracks
  {
    id: 'romantic-1',
    title: 'Moonlight Serenade',
    artist: 'Love Symphony',
    album: 'Heart Songs',
    duration: 225,
    mood_tags: ['romantic', 'intimate', 'gentle'],
    energy: 4,
    valence: 8,
    genre: 'jazz',
    cover_url: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'romantic-2',
    title: 'Stars Align',
    artist: 'Cosmic Love',
    album: 'Infinite Hearts',
    duration: 210,
    mood_tags: ['romantic', 'dreamy', 'ethereal'],
    energy: 5,
    valence: 9,
    genre: 'indie',
    cover_url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300'
  },

  // Focus tracks
  {
    id: 'focus-1',
    title: 'Deep Concentration',
    artist: 'Mind Palace',
    album: 'Flow State',
    duration: 420,
    mood_tags: ['focus', 'instrumental', 'minimal'],
    energy: 5,
    valence: 6,
    genre: 'instrumental',
    cover_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'focus-2',
    title: 'Neural Networks',
    artist: 'Brain Waves',
    album: 'Cognitive Enhancement',
    duration: 360,
    mood_tags: ['focus', 'electronic', 'ambient'],
    energy: 6,
    valence: 7,
    genre: 'ambient',
    cover_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export class MusicDatabase {
  static getTracksByMood(mood: Mood, limit: number = 10): Track[] {
    // Filter tracks that have compatible mood tags
    const compatibleTracks = SAMPLE_TRACKS.filter(track => 
      track.mood_tags.includes(mood.id) ||
      Math.abs(track.energy - mood.energy) <= 3 &&
      Math.abs(track.valence - mood.valence) <= 3
    );

    // Sort by compatibility score
    const scoredTracks = compatibleTracks.map(track => ({
      track,
      score: this.calculateCompatibilityScore(track, mood)
    }));

    scoredTracks.sort((a, b) => b.score - a.score);

    return scoredTracks.slice(0, limit).map(item => item.track);
  }

  static getTracksByGenre(genre: string, limit: number = 10): Track[] {
    return SAMPLE_TRACKS
      .filter(track => track.genre === genre)
      .slice(0, limit);
  }

  static searchTracks(query: string): Track[] {
    const lowercaseQuery = query.toLowerCase();
    return SAMPLE_TRACKS.filter(track =>
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.toLowerCase().includes(lowercaseQuery) ||
      track.album.toLowerCase().includes(lowercaseQuery) ||
      track.mood_tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  private static calculateCompatibilityScore(track: Track, mood: Mood): number {
    const energyScore = 1 - Math.abs(track.energy - mood.energy) / 10;
    const valenceScore = 1 - Math.abs(track.valence - mood.valence) / 10;
    const tagBonus = track.mood_tags.includes(mood.id) ? 0.3 : 0;
    
    return (energyScore + valenceScore) / 2 + tagBonus;
  }

  static getRandomTracks(count: number = 5): Track[] {
    const shuffled = [...SAMPLE_TRACKS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static getAllGenres(): string[] {
    const genres = new Set(SAMPLE_TRACKS.map(track => track.genre));
    return Array.from(genres);
  }
}