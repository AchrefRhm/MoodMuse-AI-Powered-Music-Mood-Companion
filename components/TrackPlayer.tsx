import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Heart,
  Share,
  Volume2,
  Shuffle,
  Repeat
} from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import { Track } from '@/types/mood';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  withRepeat
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface TrackPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function TrackPlayer({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onLike,
  isLiked = false
}: TrackPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [volume, setVolume] = useState(0.8);

  const scaleAnimation = useSharedValue(1);
  const progressAnimation = useSharedValue(0);
  const waveAnimation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      // Simulate playback progress
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const newProgress = newTime / track.duration;
          setProgress(newProgress);
          progressAnimation.value = newProgress;
          return newTime;
        });
      }, 1000);

      // Start wave animation
      waveAnimation.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );

      return () => clearInterval(interval);
    } else {
      waveAnimation.value = withTiming(0, { duration: 300 });
    }
  }, [isPlaying, track.duration]);

  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnimation.value * 100}%`
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(waveAnimation.value, [0, 1], [0.3, 0.8]),
    transform: [
      { scaleY: interpolate(waveAnimation.value, [0, 1], [0.5, 1.5]) }
    ]
  }));

  const handlePlayPause = () => {
    scaleAnimation.value = withSpring(0.9, {}, () => {
      scaleAnimation.value = withSpring(1);
    });
    onPlayPause();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.container}>
      <BlurView intensity={95} style={styles.blurContainer}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
          style={styles.playerGradient}
        >
          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Image
              source={{ 
                uri: imageError 
                  ? 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=300' 
                  : track.cover_url 
              }}
              style={styles.trackCover}
              onError={() => setImageError(true)}
            />
            
            <View style={styles.trackDetails}>
              <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
              <Text style={styles.trackAlbum} numberOfLines={1}>{track.album}</Text>
            </View>

            <TouchableOpacity 
              style={styles.likeButton}
              onPress={onLike}
            >
              <Heart 
                size={24} 
                color={isLiked ? COLORS.accent[500] : COLORS.neutral[400]}
                fill={isLiked ? COLORS.accent[500] : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            
            <View style={styles.progressBar}>
              <View style={styles.progressTrack} />
              <Animated.View style={[styles.progressFill, progressStyle]} />
              <View style={styles.progressThumb} />
            </View>
            
            <Text style={styles.timeText}>{formatTime(track.duration)}</Text>
          </View>

          {/* Wave Visualization */}
          <View style={styles.waveContainer}>
            {[...Array(20)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.waveBars,
                  waveStyle,
                  {
                    height: Math.random() * 40 + 10,
                    animationDelay: i * 50,
                  }
                ]}
              />
            ))}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle 
                size={20} 
                color={isShuffled ? COLORS.primary[600] : COLORS.neutral[400]} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
              <SkipBack size={24} color={COLORS.neutral[700]} />
            </TouchableOpacity>

            <Animated.View style={playButtonStyle}>
              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                <LinearGradient
                  colors={[COLORS.primary[500], COLORS.primary[600]]}
                  style={styles.playButtonGradient}
                >
                  {isPlaying ? (
                    <Pause size={32} color="#ffffff" />
                  ) : (
                    <Play size={32} color="#ffffff" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.controlButton} onPress={onNext}>
              <SkipForward size={24} color={COLORS.neutral[700]} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => {
                const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
                const currentIndex = modes.indexOf(repeatMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setRepeatMode(nextMode);
              }}
            >
              <Repeat 
                size={20} 
                color={repeatMode !== 'none' ? COLORS.primary[600] : COLORS.neutral[400]} 
              />
            </TouchableOpacity>
          </View>

          {/* Secondary Controls */}
          <View style={styles.secondaryControls}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Share size={18} color={COLORS.neutral[500]} />
            </TouchableOpacity>
            
            <View style={styles.volumeContainer}>
              <Volume2 size={18} color={COLORS.neutral[500]} />
              <View style={styles.volumeSlider}>
                <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

function CalmVisualization({ isPlaying, intensity }: { isPlaying: boolean; intensity: number }) {
  const breathAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      breathAnimation.value = withRepeat(
        withTiming(1, { duration: 4000 }),
        -1,
        true
      );
    }
  }, [isPlaying]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(breathAnimation.value, [0, 1], [0.8, 1.2]) }
    ],
    opacity: interpolate(breathAnimation.value, [0, 1], [0.3, 0.7]) * intensity,
  }));

  return (
    <View style={styles.breathContainer}>
      {[...Array(5)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.breathCircle,
            breathStyle,
            {
              width: 50 + i * 20,
              height: 50 + i * 20,
              borderRadius: (50 + i * 20) / 2,
              borderColor: '#98FB98' + Math.round(255 * (0.8 - i * 0.15)).toString(16),
            }
          ]}
        />
      ))}
    </View>
  );
}

function HappyVisualization({ isPlaying, intensity }: { isPlaying: boolean; intensity: number }) {
  const bounceAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      bounceAnimation.value = withRepeat(
        withTiming(1, { duration: 800 }),
        -1,
        true
      );
    }
  }, [isPlaying]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(bounceAnimation.value, [0, 1], [0, -20]) }
    ],
    opacity: intensity,
  }));

  return (
    <View style={styles.happyContainer}>
      {[...Array(8)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.happyDot,
            bounceStyle,
            {
              top: Math.random() * (height * 0.6) + height * 0.2,
              left: Math.random() * (width * 0.8) + width * 0.1,
              backgroundColor: ['#FFD700', '#FFA500', '#FF69B4'][i % 3],
              animationDelay: i * 100,
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: SPACING.md,
    right: SPACING.md,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 24,
  },
  playerGradient: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  trackCover: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: SPACING.md,
    backgroundColor: COLORS.neutral[200],
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.neutral[600],
    marginBottom: 2,
  },
  trackAlbum: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  timeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.neutral[300],
    borderRadius: 2,
    position: 'relative',
  },
  progressTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.neutral[300],
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    right: -6,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary[600],
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginBottom: SPACING.lg,
    gap: 2,
  },
  waveBars: {
    width: 3,
    backgroundColor: COLORS.primary[400],
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.lg,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  playButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  volumeSlider: {
    width: 80,
    height: 4,
    backgroundColor: COLORS.neutral[300],
    borderRadius: 2,
    position: 'relative',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 2,
  },
  // Visualization styles
  energeticContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  energyBolt: {
    position: 'absolute',
    width: 20,
    height: 4,
    backgroundColor: '#FF6347',
    borderRadius: 2,
  },
  breathContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircle: {
    position: 'absolute',
    borderWidth: 1,
  },
  happyContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  happyDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});