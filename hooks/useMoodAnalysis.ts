import { useState, useCallback } from 'react';
import { Mood, MoodInput, Playlist } from '@/types/mood';
import { MoodAnalyzer } from '@/utils/moodAnalyzer';
import { PlaylistGenerator } from '@/utils/playlistGenerator';

export function useMoodAnalysis() {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Playlist | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodInput[]>([]);

  const analyzeMood = useCallback(async (input: MoodInput): Promise<Mood | null> => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let detectedMood: Mood | null = null;
    
    switch (input.type) {
      case 'text':
        detectedMood = MoodAnalyzer.analyzeMoodFromText(input.value);
        break;
      case 'emoji':
        detectedMood = MoodAnalyzer.analyzeMoodFromEmoji(input.value);
        break;
      case 'visual':
        // For visual selection, the mood ID is passed directly
        const { PREDEFINED_MOODS } = require('@/constants/moods');
        detectedMood = PREDEFINED_MOODS.find((m: Mood) => m.id === input.value) || null;
        break;
    }
    
    if (detectedMood) {
      setCurrentMood(detectedMood);
      setMoodHistory(prev => [...prev, input]);
      
      // Generate playlist based on detected mood
      const playlist = PlaylistGenerator.generatePlaylist(detectedMood);
      setGeneratedPlaylist(playlist);
    }
    
    setIsAnalyzing(false);
    return detectedMood;
  }, []);

  const generateNewPlaylist = useCallback((mood: Mood) => {
    const playlist = PlaylistGenerator.generatePlaylist(mood);
    setGeneratedPlaylist(playlist);
    return playlist;
  }, []);

  const clearMoodAnalysis = useCallback(() => {
    setCurrentMood(null);
    setGeneratedPlaylist(null);
  }, []);

  return {
    currentMood,
    isAnalyzing,
    generatedPlaylist,
    moodHistory,
    analyzeMood,
    generateNewPlaylist,
    clearMoodAnalysis
  };
}