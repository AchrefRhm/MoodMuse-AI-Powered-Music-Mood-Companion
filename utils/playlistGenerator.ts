import { Mood, Track, Playlist } from '@/types/mood';
import { MusicDatabase } from './musicDatabase';

export class PlaylistGenerator {
  static generatePlaylist(mood: Mood, preferences?: any): Playlist {
    const tracks = MusicDatabase.getTracksByMood(mood, 12);
    
    // Add some variety by including complementary moods
    const complementaryTracks = this.getComplementaryTracks(mood, 3);
    const allTracks = [...tracks, ...complementaryTracks];
    
    // Shuffle and limit to reasonable playlist length
    const shuffledTracks = this.shuffleArray(allTracks).slice(0, 15);
    
    return {
      id: `playlist-${Date.now()}`,
      name: this.generatePlaylistName(mood),
      description: this.generatePlaylistDescription(mood),
      mood,
      tracks: shuffledTracks,
      created_at: new Date(),
      updated_at: new Date(),
      is_favorite: false,
      play_count: 0
    };
  }

  private static getComplementaryTracks(mood: Mood, count: number): Track[] {
    // Find tracks that are similar but not identical to the mood
    const complementaryMoods = this.getComplementaryMoods(mood);
    const tracks: Track[] = [];
    
    for (const complementaryMood of complementaryMoods) {
      const moodTracks = MusicDatabase.getTracksByMood(complementaryMood, 2);
      tracks.push(...moodTracks);
    }
    
    return tracks.slice(0, count);
  }

  private static getComplementaryMoods(mood: Mood): Mood[] {
    // This is a simplified implementation
    // In a real app, this would be more sophisticated
    const complementaryMap: Record<string, string[]> = {
      happy: ['energetic', 'romantic'],
      sad: ['nostalgic', 'calm'],
      energetic: ['happy', 'angry'],
      calm: ['romantic', 'nostalgic'],
      anxious: ['calm', 'sad'],
      romantic: ['happy', 'calm'],
      angry: ['energetic', 'sad'],
      nostalgic: ['sad', 'romantic']
    };

    const { PREDEFINED_MOODS } = require('@/constants/moods');
    const complementaryIds = complementaryMap[mood.id] || [];
    
    return complementaryIds
      .map(id => PREDEFINED_MOODS.find((m: Mood) => m.id === id))
      .filter(Boolean) as Mood[];
  }

  private static generatePlaylistName(mood: Mood): string {
    const nameTemplates: Record<string, string[]> = {
      happy: ['Sunshine Vibes', 'Joy Unleashed', 'Happy Hearts', 'Golden Moments', 'Bright Day Ahead'],
      sad: ['Healing Rain', 'Gentle Tears', 'Quiet Reflections', 'Emotional Release', 'Soft Solace'],
      energetic: ['Power Surge', 'Electric Energy', 'High Voltage', 'Unstoppable Force', 'Dynamic Drive'],
      calm: ['Peaceful Waters', 'Zen Garden', 'Tranquil Moments', 'Serene Spaces', 'Quiet Mind'],
      anxious: ['Soothing Calm', 'Anxiety Relief', 'Peaceful Mind', 'Gentle Comfort', 'Stress Release'],
      romantic: ['Love Letters', 'Romantic Evening', 'Hearts Entwined', 'Passion Play', 'Love Songs'],
      angry: ['Controlled Chaos', 'Raw Energy', 'Fierce Fire', 'Powerful Release', 'Intense Emotions'],
      nostalgic: ['Memory Lane', 'Yesterday\'s Dreams', 'Time Capsule', 'Golden Years', 'Sweet Memories']
    };

    const templates = nameTemplates[mood.id] || ['Mood Music'];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private static generatePlaylistDescription(mood: Mood): string {
    const descriptions: Record<string, string[]> = {
      happy: [
        'A collection of uplifting songs to amplify your joy and spread positive vibes.',
        'Bright melodies and cheerful rhythms to celebrate your happiness.',
        'Feel-good music that matches your radiant energy and optimistic spirit.'
      ],
      sad: [
        'Gentle melodies to accompany you through this emotional moment.',
        'Comforting songs that understand and validate your feelings.',
        'A musical companion for processing emotions and finding healing.'
      ],
      energetic: [
        'High-energy tracks to fuel your motivation and power your day.',
        'Dynamic beats that match your unstoppable energy and drive.',
        'Adrenaline-pumping music for when you\'re ready to conquer the world.'
      ],
      calm: [
        'Peaceful melodies to enhance your tranquil state of mind.',
        'Serene soundscapes for meditation, relaxation, and inner peace.',
        'Gentle music that honors your calm and centered energy.'
      ],
      anxious: [
        'Soothing tracks carefully selected to ease anxiety and bring comfort.',
        'Calming melodies to help quiet a busy mind and reduce stress.',
        'Gentle musical therapy for moments when you need extra support.'
      ],
      romantic: [
        'Intimate melodies perfect for love, connection, and romantic moments.',
        'Heartfelt songs that capture the beauty and magic of love.',
        'Romantic soundtracks for creating special memories with someone special.'
      ],
      angry: [
        'Powerful music that channels intense emotions into something constructive.',
        'Raw, honest tracks that understand and validate your anger.',
        'Intense melodies for when you need to release and transform strong emotions.'
      ],
      nostalgic: [
        'Bittersweet melodies that honor memories and celebrate the past.',
        'Wistful songs that transport you to cherished moments in time.',
        'Musical time travel through the beautiful landscape of memory.'
      ]
    };

    const moodDescriptions = descriptions[mood.id] || ['A personalized playlist created just for your current mood.'];
    return moodDescriptions[Math.floor(Math.random() * moodDescriptions.length)];
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static refinePlaylistWithFeedback(playlist: Playlist, likedTrackIds: string[], dislikedTrackIds: string[]): Playlist {
    // Remove disliked tracks
    const filteredTracks = playlist.tracks.filter(track => !dislikedTrackIds.includes(track.id));
    
    // Add more tracks similar to liked ones
    const additionalTracks: Track[] = [];
    for (const likedId of likedTrackIds) {
      const likedTrack = playlist.tracks.find(t => t.id === likedId);
      if (likedTrack) {
        const similarTracks = this.findSimilarTracks(likedTrack, 2);
        additionalTracks.push(...similarTracks);
      }
    }
    
    const refinedTracks = [...filteredTracks, ...additionalTracks].slice(0, 15);
    
    return {
      ...playlist,
      tracks: refinedTracks,
      updated_at: new Date()
    };
  }

  private static findSimilarTracks(track: Track, count: number): Track[] {
    return MusicDatabase.getTracksByGenre(track.genre, count)
      .filter(t => t.id !== track.id);
  }
}