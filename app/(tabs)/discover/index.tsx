import React, { useState, useEffect } from 'react';
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
import { 
  Compass, 
  Zap, 
  Leaf, 
  Brain,
  Moon,
  TrendingUp,
  Sparkles,
  RefreshCw
} from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import { RECOMMENDATION_MODES } from '@/constants/moods';
import { MusicDatabase } from '@/utils/musicDatabase';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withDelay
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [selectedMode, setSelectedMode] = useState<string>('focus');
  const [recommendedTracks, setRecommendedTracks] = useState<any[]>([]);
  const [trendingGenres, setTrendingGenres] = useState<string[]>([]);

  const fadeAnimation = useSharedValue(0);
  const slideAnimation = useSharedValue(0);

  useEffect(() => {
    // Initial animation
    fadeAnimation.value = withTiming(1, { duration: 800 });
    slideAnimation.value = withTiming(1, { duration: 600 });
    
    // Load initial data
    loadRecommendations();
    loadTrendingGenres();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
    transform: [
      { translateY: slideAnimation.value * 0 }
    ]
  }));

  const loadRecommendations = () => {
    const tracks = MusicDatabase.getRandomTracks(8);
    setRecommendedTracks(tracks);
  };

  const loadTrendingGenres = () => {
    const genres = MusicDatabase.getAllGenres();
    setTrendingGenres(genres.slice(0, 5));
  };

  const handleRefresh = () => {
    fadeAnimation.value = withTiming(0.5, { duration: 200 }, () => {
      loadRecommendations();
      fadeAnimation.value = withTiming(1, { duration: 400 });
    });
  };

  const getModeIcon = (modeId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      focus: <Brain size={24} color="#ffffff" />,
      relaxation: <Leaf size={24} color="#ffffff" />,
      motivation: <Zap size={24} color="#ffffff" />,
      sleep: <Moon size={24} color="#ffffff" />,
    };
    return iconMap[modeId] || <Sparkles size={24} color="#ffffff" />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={[COLORS.neutral[50], COLORS.neutral[100]]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Compass size={28} color={COLORS.primary[600]} />
          <Text style={styles.title}>Discover</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={20} color={COLORS.neutral[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Recommendation Modes */}
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Recommendation Modes</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modesScroll}
          >
            {RECOMMENDATION_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  selectedMode === mode.id && styles.modeCardSelected
                ]}
                onPress={() => setSelectedMode(mode.id)}
              >
                <LinearGradient
                  colors={[mode.color, mode.color + 'CC']}
                  style={styles.modeGradient}
                >
                  {getModeIcon(mode.id)}
                  <Text style={styles.modeTitle}>{mode.name}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* For You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tracksScroll}
          >
            {recommendedTracks.slice(0, 6).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </ScrollView>
        </View>

        {/* Trending Genres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Genres</Text>
          <View style={styles.genreGrid}>
            {trendingGenres.map((genre) => (
              <TouchableOpacity key={genre} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
                <TrendingUp size={14} color={COLORS.success[600]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Mix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Mix</Text>
          <View style={styles.dailyMixContainer}>
            <LinearGradient
              colors={[COLORS.secondary[500], COLORS.secondary[600]]}
              style={styles.dailyMixCard}
            >
              <Sparkles size={32} color="#ffffff" />
              <Text style={styles.dailyMixTitle}>Your Daily Mix</Text>
              <Text style={styles.dailyMixDescription}>
                A personalized blend of your favorite moods and genres
              </Text>
              <TouchableOpacity style={styles.dailyMixButton}>
                <Play size={16} color={COLORS.secondary[600]} />
                <Text style={styles.dailyMixButtonText}>Play Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TrackCard({ track }: { track: any }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <TouchableOpacity style={styles.trackCard}>
      <Image
        source={{ 
          uri: imageError 
            ? 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=200' 
            : track.cover_url 
        }}
        style={styles.trackImage}
        onError={() => setImageError(true)}
      />
      <View style={styles.trackCardContent}>
        <Text style={styles.trackCardTitle} numberOfLines={2}>{track.title}</Text>
        <Text style={styles.trackCardArtist} numberOfLines={1}>{track.artist}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE['3xl'],
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.primary[600],
  },
  modesScroll: {
    paddingHorizontal: SPACING.lg,
  },
  modeCard: {
    width: 160,
    height: 120,
    borderRadius: 16,
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  modeCardSelected: {
    transform: [{ scale: 1.05 }],
  },
  modeGradient: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  modeDescription: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 14,
  },
  tracksScroll: {
    paddingHorizontal: SPACING.lg,
  },
  trackCard: {
    width: 140,
    marginRight: SPACING.md,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.neutral[200],
  },
  trackCardContent: {
    flex: 1,
  },
  trackCardTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  trackCardArtist: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  genreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  genreText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[700],
    textTransform: 'capitalize',
  },
  dailyMixContainer: {
    paddingHorizontal: SPACING.lg,
  },
  dailyMixCard: {
    padding: SPACING.xl,
    borderRadius: 20,
    alignItems: 'center',
  },
  dailyMixTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  dailyMixDescription: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  dailyMixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  dailyMixButtonText: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.secondary[600],
  },
});