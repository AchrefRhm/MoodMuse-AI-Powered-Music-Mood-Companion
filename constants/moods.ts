import { Mood, RecommendationMode } from '@/types/mood';

export const PREDEFINED_MOODS: Mood[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    color: '#FFD700',
    energy: 8,
    valence: 9,
    description: 'Feeling joyful and upbeat'
  },
  {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    color: '#4169E1',
    energy: 3,
    valence: 2,
    description: 'Feeling down or melancholic'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    color: '#FF6347',
    energy: 10,
    valence: 8,
    description: 'Full of energy and ready to go'
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '🧘',
    color: '#98FB98',
    energy: 4,
    valence: 7,
    description: 'Peaceful and relaxed'
  },
  {
    id: 'anxious',
    name: 'Anxious',
    emoji: '😰',
    color: '#FFA500',
    energy: 7,
    valence: 3,
    description: 'Feeling worried or stressed'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    color: '#FF69B4',
    energy: 5,
    valence: 8,
    description: 'In a loving, romantic mood'
  },
  {
    id: 'angry',
    name: 'Angry',
    emoji: '😠',
    color: '#DC143C',
    energy: 9,
    valence: 2,
    description: 'Feeling frustrated or angry'
  },
  {
    id: 'nostalgic',
    name: 'Nostalgic',
    emoji: '🌅',
    color: '#DDA0DD',
    energy: 4,
    valence: 6,
    description: 'Remembering the past fondly'
  },
];

export const RECOMMENDATION_MODES: RecommendationMode[] = [
  {
    id: 'focus',
    name: 'Focus',
    description: 'Instrumental and ambient tracks for deep concentration',
    icon: 'brain',
    color: '#3B82F6',
    characteristics: {
      energy_range: [4, 7],
      valence_range: [5, 8],
      preferred_genres: ['instrumental', 'ambient', 'classical', 'lo-fi']
    }
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Calm, soothing melodies for stress relief',
    icon: 'leaf',
    color: '#10B981',
    characteristics: {
      energy_range: [1, 5],
      valence_range: [6, 9],
      preferred_genres: ['ambient', 'new-age', 'classical', 'nature-sounds']
    }
  },
  {
    id: 'motivation',
    name: 'Motivation',
    description: 'Upbeat, energizing songs to boost your mood',
    icon: 'zap',
    color: '#F59E0B',
    characteristics: {
      energy_range: [7, 10],
      valence_range: [7, 10],
      preferred_genres: ['pop', 'rock', 'electronic', 'hip-hop']
    }
  },
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'Gentle, peaceful sounds for better rest',
    icon: 'moon',
    color: '#8B5CF6',
    characteristics: {
      energy_range: [1, 3],
      valence_range: [5, 8],
      preferred_genres: ['ambient', 'classical', 'nature-sounds', 'white-noise']
    }
  }
];