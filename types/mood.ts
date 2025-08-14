export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  energy: number; // 0-10 scale
  valence: number; // 0-10 scale (negative to positive)
  description: string;
}

export interface MoodInput {
  type: 'text' | 'emoji' | 'visual';
  value: string;
  timestamp: Date;
  confidence?: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  mood_tags: string[];
  energy: number;
  valence: number;
  genre: string;
  cover_url: string;
  preview_url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  mood: Mood;
  tracks: Track[];
  created_at: Date;
  updated_at: Date;
  is_favorite: boolean;
  user_rating?: number;
  play_count: number;
}

export interface UserPreferences {
  preferred_genres: string[];
  disliked_genres: string[];
  favorite_artists: string[];
  mood_history: MoodInput[];
  feedback_history: PlaylistFeedback[];
}

export interface PlaylistFeedback {
  playlist_id: string;
  rating: number; // 1-5 stars
  tracks_liked: string[];
  tracks_disliked: string[];
  feedback_text?: string;
  timestamp: Date;
}

export interface RecommendationMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  characteristics: {
    energy_range: [number, number];
    valence_range: [number, number];
    preferred_genres: string[];
  };
}