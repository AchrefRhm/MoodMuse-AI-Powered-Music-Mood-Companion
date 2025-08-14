import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Music,
  Headphones,
  Waves
} from 'lucide-react-native';
import { COLORS, MOOD_GRADIENTS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import { PREDEFINED_MOODS } from '@/constants/moods';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSpring,
  interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Animation values
  const floatingAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(1);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Start animations
    floatingAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
    
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(floatingAnimation.value, [0, 1], [0, -10])
      }
    ]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnimation.value, [0, 1], [0.3, 0.8]),
    transform: [
      {
        scale: interpolate(pulseAnimation.value, [0, 1], [0.95, 1.05])
      }
    ]
  }));

  const handleMoodInput = () => {
    scaleAnimation.value = withSpring(0.95, {}, () => {
      scaleAnimation.value = withSpring(1);
    });
    router.push('/home/mood-input');
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }]
  }));

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={floatingStyle}>
            <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
            <Text style={styles.title}>How are you feeling?</Text>
          </Animated.View>
          
          <Animated.View style={[styles.musicIcon, pulseStyle]}>
            <Music size={32} color="rgba(255, 255, 255, 0.8)" />
          </Animated.View>
        </View>

        {/* Quick Mood Selector */}
        <View style={styles.quickMoodSection}>
          <Text style={styles.sectionTitle}>Quick Mood Check</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScroll}
          >
            {PREDEFINED_MOODS.slice(0, 6).map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodCard, { backgroundColor: mood.color + '20' }]}
                onPress={() => router.push({
                  pathname: '/home/playlist-result',
                  params: { moodId: mood.id }
                })}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodName}>{mood.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Action Button */}
        <Animated.View style={[styles.mainActionContainer, buttonStyle]}>
          <TouchableOpacity style={styles.mainActionButton} onPress={handleMoodInput}>
            <BlurView intensity={20} style={styles.blurContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.actionGradient}
              >
                <Brain size={32} color="#ffffff" />
                <Text style={styles.actionButtonText}>Analyze My Mood</Text>
                <Text style={styles.actionButtonSubtext}>AI-powered mood detection</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <FeatureCard
            icon={<Heart size={24} color={COLORS.accent[500]} />}
            title="Mood Tracking"
            description="Track your emotional journey"
            color={COLORS.accent[500]}
          />
          <FeatureCard
            icon={<Sparkles size={24} color={COLORS.warning[500]} />}
            title="Smart Playlists"
            description="AI-generated music for any mood"
            color={COLORS.warning[500]}
          />
          <FeatureCard
            icon={<Headphones size={24} color={COLORS.success[500]} />}
            title="Focus Modes"
            description="Music for work, sleep, and more"
            color={COLORS.success[500]}
          />
          <FeatureCard
            icon={<Waves size={24} color={COLORS.primary[500]} />}
            title="Visualizations"
            description="Beautiful animations with your music"
            color={COLORS.primary[500]}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <View style={[styles.featureCard, { borderLeftColor: color }]}>
      <View style={styles.featureIcon}>{icon}</View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
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
    height: height * 1.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  title: {
    fontSize: FONT_SIZE['4xl'],
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 44,
  },
  musicIcon: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickMoodSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  moodScroll: {
    paddingHorizontal: SPACING.sm,
  },
  moodCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 100,
    borderRadius: 16,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  moodName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  mainActionContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  mainActionButton: {
    width: width - SPACING.xl,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginTop: SPACING.sm,
  },
  actionButtonSubtext: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.xs,
  },
  featuresGrid: {
    gap: SPACING.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    marginRight: SPACING.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[800],
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    lineHeight: 20,
  },
});