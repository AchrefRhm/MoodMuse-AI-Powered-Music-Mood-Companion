import { Mood, MoodInput, Track } from '@/types/mood';
import { PREDEFINED_MOODS } from '@/constants/moods';

export class MoodAnalyzer {
  private static moodKeywords: Record<string, string[]> = {
    happy: ['happy', 'joy', 'excited', 'cheerful', 'elated', 'upbeat', 'positive', 'bright'],
    sad: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'sorrowful', 'upset'],
    energetic: ['energetic', 'pumped', 'hyper', 'active', 'dynamic', 'vigorous', 'lively'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'mellow', 'chill'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 'restless'],
    romantic: ['romantic', 'love', 'intimate', 'passionate', 'tender', 'affectionate'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'rage', 'annoyed'],
    nostalgic: ['nostalgic', 'memories', 'past', 'reminiscing', 'wistful', 'sentimental']
  };

  static analyzeMoodFromText(text: string): Mood | null {
    const lowercaseText = text.toLowerCase();
    let bestMatch: { mood: Mood; score: number } | null = null;

    for (const [moodId, keywords] of Object.entries(this.moodKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowercaseText.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        const mood = PREDEFINED_MOODS.find(m => m.id === moodId);
        if (mood) {
          bestMatch = { mood, score };
        }
      }
    }

    return bestMatch?.mood || null;
  }

  static analyzeMoodFromEmoji(emoji: string): Mood | null {
    const emojiMoodMap: Record<string, string> = {
      '😊': 'happy', '😃': 'happy', '😄': 'happy', '🙂': 'happy', '😁': 'happy',
      '😢': 'sad', '😭': 'sad', '☹️': 'sad', '🙁': 'sad', '😞': 'sad',
      '⚡': 'energetic', '🔥': 'energetic', '💪': 'energetic', '🚀': 'energetic',
      '🧘': 'calm', '😌': 'calm', '😴': 'calm', '🌅': 'calm', '🍃': 'calm',
      '😰': 'anxious', '😟': 'anxious', '😬': 'anxious', '😨': 'anxious',
      '💕': 'romantic', '❤️': 'romantic', '💖': 'romantic', '😍': 'romantic',
      '😠': 'angry', '😡': 'angry', '🤬': 'angry', '💢': 'angry',
      '🌅': 'nostalgic', '📸': 'nostalgic', '⏰': 'nostalgic', '🎭': 'nostalgic'
    };

    const moodId = emojiMoodMap[emoji];
    return moodId ? PREDEFINED_MOODS.find(m => m.id === moodId) || null : null;
  }

  static calculateMoodCompatibility(track: Track, mood: Mood): number {
    const energyDiff = Math.abs(track.energy - mood.energy);
    const valenceDiff = Math.abs(track.valence - mood.valence);
    
    // Normalize to 0-1 scale and invert (higher score = better match)
    const energyScore = 1 - (energyDiff / 10);
    const valenceScore = 1 - (valenceDiff / 10);
    
    // Weight energy and valence equally
    return (energyScore + valenceScore) / 2;
  }

  static generateMoodInsight(mood: Mood): string {
    const insights: Record<string, string[]> = {
      happy: [
        "Your positive energy is contagious! Let's amplify it with uplifting melodies.",
        "Happiness looks good on you! Time for some feel-good music.",
        "Your joy deserves a soundtrack! Let's create something bright and beautiful."
      ],
      sad: [
        "It's okay to feel this way. Music can be a gentle companion through difficult moments.",
        "Let the music wrap around you like a warm hug. You're not alone in this feeling.",
        "Sometimes sad songs help us process our emotions. Let's find something healing."
      ],
      energetic: [
        "Your energy is electric! Let's channel it into some high-powered beats.",
        "Feeling unstoppable? Your playlist should match that incredible energy!",
        "Time to turn up the volume on life! Your energy deserves an epic soundtrack."
      ],
      calm: [
        "Your peaceful state is beautiful. Let's enhance it with serene melodies.",
        "In this moment of tranquility, let music be your meditation.",
        "Your calm energy is grounding. Let's create a soundscape that honors this peace."
      ],
      anxious: [
        "Take a deep breath. Let's find music that helps ease your mind.",
        "Your feelings are valid. Sometimes the right song can be incredibly soothing.",
        "Let's create a gentle musical space where you can find some relief."
      ],
      romantic: [
        "Love is in the air! Let's craft the perfect romantic atmosphere.",
        "Your heart is singing - let's find music that matches its rhythm.",
        "Romance deserves the perfect soundtrack. Let's create something magical."
      ],
      angry: [
        "Sometimes we need music that understands our fire. Let's channel this energy.",
        "Your intensity is powerful. Let's find music that honors these strong feelings.",
        "It's okay to feel angry. Let music be your outlet and release."
      ],
      nostalgic: [
        "Memories are precious. Let's create a soundtrack for this beautiful nostalgia.",
        "Looking back can be bittersweet. Let music be your time machine.",
        "Your memories deserve a beautiful musical tribute. Let's honor them together."
      ]
    };

    const moodInsights = insights[mood.id] || ["Let's create something special that matches your unique mood."];
    return moodInsights[Math.floor(Math.random() * moodInsights.length)];
  }
}