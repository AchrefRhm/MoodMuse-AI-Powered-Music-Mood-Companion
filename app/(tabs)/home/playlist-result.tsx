import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Heart, Share, MoveHorizontal as MoreHorizontal, Clock, User } from 'lucide-react-native';
import { COLORS, MOOD_GRADIENTS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import { PREDEFINED_MOODS } from '@/constants/moods';
import { Mood, Playlist } from '@/types/mood';
import { PlaylistGenerator } from '@/utils/playlistGenerator';
import { MoodAnalyzer } from '@/utils/moodAnalyzer';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  withDelay,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PlaylistResultScreen() {
  const router = useRouter();
  const { moodId } = useLocalSearchParams<{ moodId: string }>();
  const { savePlaylist, playPlaylist } = usePlaylistManager();
  
  const [mood, setMood] = useState<Mood | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const fadeAnimation = useSharedValue(0);
  const slideAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(0.8);

  useEffect(() => {
    if (moodId) {
      const foundMood = PREDEFINED_MOODS.find(m => m.id === moodId);
      if (foundMood) {
        setMood(foundMood);
        generatePlaylist(foundMood);
      }
    }
  }, [moodId]);

  useEffect(() => {
    if (playlist) {
      fadeAnimation.value = withTiming(1, { duration: 800 });
      slideAnimation.value = withTiming(1, { duration: 600 });
      scaleAnimation.value = withSpring(1, { duration: 800 });
    }
  }, [playlist]);

  const generatePlaylist = async (selectedMood: Mood) => {
    setIsLoading(true);
    
    // Simulate AI generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedPlaylist = PlaylistGenerator.generatePlaylist(selectedMood);
    setPlaylist(generatedPlaylist);
    setIsLoading(false);
  };

  const handleSavePlaylist = () => {
    if (playlist) {
      savePlaylist(playlist);
      setIsSaved(true);
    }
  };

  const handlePlayPlaylist = () => {
    if (playlist) {
      playPlaylist(playlist);
    }
  };

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(slideAnimation.value, [0, 1], [50, 0])
      }
    ]
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }]
  }));

  if (!mood) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Mood not found</Text>
      </View>
    );
  }

  const gradientColors = MOOD_GRADIENTS[mood.id as keyof typeof MOOD_GRADIENTS] || ['#667eea', '#764ba2'];
  const moodInsight = MoodAnalyzer.generateMoodInsight(mood);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={gradientColors}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodName}>{mood.name}</Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Mood Insight */}
        <Animated.View style={[styles.insightContainer, fadeStyle]}>
          <Text style={styles.insightText}>{moodInsight}</Text>
        </Animated.View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Animated.View style={scaleStyle}>
              <View style={styles.loadingSpinner} />
            </Animated.View>
            <Text style={styles.loadingText}>Creating your perfect playlist...</Text>
          </View>
        ) : playlist ? (
          <Animated.View style={[styles.playlistContainer, slideStyle]}>
            {/* Playlist Header */}
            <View style={styles.playlistHeader}>
              <Text style={styles.playlistTitle}>{playlist.name}</Text>
              <Text style={styles.playlistDescription}>{playlist.description}</Text>
              
              <View style={styles.playlistMeta}>
                <View style={styles.metaItem}>
                  <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.metaText}>
                    {Math.round(playlist.tracks.reduce((acc, track) => acc + track.duration, 0) / 60)} min
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <User size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.metaText}>{playlist.tracks.length} songs</Text>
                </View>
              </View>

              <View style={styles.playlistActions}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={handlePlayPlaylist}
                >
                  <Play size={24} color="#ffffff" />
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, isSaved && styles.actionButtonActive]}
                  onPress={handleSavePlaylist}
                >
                  <Heart size={20} color={isSaved ? COLORS.accent[500] : "rgba(255, 255, 255, 0.8)"} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Share size={20} color="rgba(255, 255, 255, 0.8)" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Track List */}
            <View style={styles.trackList}>
              {playlist.tracks.map((track, index) => (
                <TrackItem key={track.id} track={track} index={index} />
              ))}
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function TrackItem({ track, index }: { track: any; index: number }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <TouchableOpacity style={styles.trackItem}>
      <View style={styles.trackNumber}>
        <Text style={styles.trackNumberText}>{index + 1}</Text>
      </View>
      
      <Image
        source={{ uri: imageError ? 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=100' : track.cover_url }}
        style={styles.trackCover}
        onError={() => setImageError(true)}
      />
      
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
      </View>
      
      <Text style={styles.trackDuration}>
        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  moodName: {
    fontSize: FONT_SIZE.xl,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  insightContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  insightText: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: SPACING.lg,
  },
  loadingText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  playlistContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: SPACING.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: SPACING.lg,
    minHeight: 500,
  },
  playlistHeader: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  playlistTitle: {
    fontSize: FONT_SIZE['3xl'],
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.sm,
  },
  playlistDescription: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  playlistMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
  },
  playlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary[600],
    borderRadius: 28,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  playButtonText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: COLORS.accent[100],
  },
  trackList: {
    paddingHorizontal: SPACING.lg,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  trackNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  trackNumberText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[600],
  },
  trackCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: SPACING.md,
    backgroundColor: COLORS.neutral[200],
  },
  trackInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  trackTitle: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
  },
  trackDuration: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
  },
  errorText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 100,
  },
});