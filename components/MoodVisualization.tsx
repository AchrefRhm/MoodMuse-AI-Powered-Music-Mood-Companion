import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Mood } from '@/types/mood';
import { MOOD_GRADIENTS } from '@/constants/colors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  interpolate,
  withSequence
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface MoodVisualizationProps {
  mood: Mood;
  isPlaying?: boolean;
  intensity?: number;
}

export default function MoodVisualization({ 
  mood, 
  isPlaying = false, 
  intensity = 0.5 
}: MoodVisualizationProps) {
  const waveAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const particleAnimation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      waveAnimation.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        false
      );
      
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      );
      
      particleAnimation.value = withRepeat(
        withTiming(1, { duration: 3000 }),
        -1,
        false
      );
    } else {
      waveAnimation.value = withTiming(0, { duration: 500 });
      pulseAnimation.value = withTiming(0, { duration: 500 });
      particleAnimation.value = withTiming(0, { duration: 500 });
    }
  }, [isPlaying]);

  const waveStyle = useAnimatedStyle(() => {
    const translateX = interpolate(waveAnimation.value, [0, 1], [0, width]);
    const opacity = interpolate(waveAnimation.value, [0, 0.5, 1], [0.3, 0.8, 0.3]);
    
    return {
      transform: [{ translateX }],
      opacity: opacity * intensity,
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [0.8, 1.2]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.6, 0.2]);
    
    return {
      transform: [{ scale }],
      opacity: opacity * intensity,
    };
  });

  const particleStyle = useAnimatedStyle(() => {
    const translateY = interpolate(particleAnimation.value, [0, 1], [height, -50]);
    const opacity = interpolate(particleAnimation.value, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    
    return {
      transform: [{ translateY }],
      opacity: opacity * intensity,
    };
  });

  const gradientColors = MOOD_GRADIENTS[mood.id as keyof typeof MOOD_GRADIENTS] || ['#667eea', '#764ba2'];

  return (
    <View style={styles.container}>
      {/* Background Waves */}
      <Animated.View style={[styles.wave, waveStyle]}>
        <Svg width={width * 2} height={height} style={styles.svg}>
          <Defs>
            <SvgGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="0.1" />
            </SvgGradient>
          </Defs>
          <Path
            d={`M0,${height * 0.5} Q${width * 0.25},${height * 0.3} ${width * 0.5},${height * 0.5} T${width},${height * 0.5} V${height} H0 Z`}
            fill="url(#waveGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Center Pulse */}
      <Animated.View style={[styles.centerPulse, pulseStyle]}>
        <View style={[styles.pulseCircle, { backgroundColor: gradientColors[0] + '30' }]} />
      </Animated.View>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <Animated.View 
          key={i}
          style={[
            styles.particle, 
            particleStyle,
            {
              left: Math.random() * width,
              backgroundColor: gradientColors[i % 2] + '40',
            }
          ]}
        />
      ))}

      {/* Mood-specific Elements */}
      {renderMoodSpecificElements(mood, isPlaying, intensity)}
    </View>
  );
}

function renderMoodSpecificElements(mood: Mood, isPlaying: boolean, intensity: number) {
  switch (mood.id) {
    case 'energetic':
      return <EnergeticVisualization isPlaying={isPlaying} intensity={intensity} />;
    case 'calm':
      return <CalmVisualization isPlaying={isPlaying} intensity={intensity} />;
    case 'happy':
      return <HappyVisualization isPlaying={isPlaying} intensity={intensity} />;
    default:
      return null;
  }
}

function EnergeticVisualization({ isPlaying, intensity }: { isPlaying: boolean; intensity: number }) {
  const boltAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      boltAnimation.value = withRepeat(
        withTiming(1, { duration: 500 }),
        -1,
        true
      );
    }
  }, [isPlaying]);

  const boltStyle = useAnimatedStyle(() => ({
    opacity: interpolate(boltAnimation.value, [0, 1], [0.3, 1]) * intensity,
    transform: [
      { scale: interpolate(boltAnimation.value, [0, 1], [0.8, 1.2]) }
    ],
  }));

  return (
    <Animated.View style={[styles.energeticContainer, boltStyle]}>
      {[...Array(6)].map((_, i) => (
        <View 
          key={i}
          style={[
            styles.energyBolt,
            {
              top: Math.random() * height,
              left: Math.random() * width,
              transform: [{ rotate: `${Math.random() * 360}deg` }],
            }
          ]}
        />
      ))}
    </Animated.View>
  );
}

function CalmVisualization({ isPlaying, intensity }: { isPlaying: boolean; intensity: number }) {
  const rippleAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      rippleAnimation.value = withRepeat(
        withTiming(1, { duration: 4000 }),
        -1,
        false
      );
    }
  }, [isPlaying]);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(rippleAnimation.value, [0, 1], [0, 2]) }
    ],
    opacity: interpolate(rippleAnimation.value, [0, 0.5, 1], [0.8, 0.4, 0]) * intensity,
  }));

  return (
    <View style={styles.calmContainer}>
      {[...Array(3)].map((_, i) => (
        <Animated.View 
          key={i}
          style={[
            styles.ripple, 
            rippleStyle,
            { 
              animationDelay: i * 1000,
              backgroundColor: '#98FB98' + '20',
            }
          ]}
        />
      ))}
    </View>
  );
}

function HappyVisualization({ isPlaying, intensity }: { isPlaying: boolean; intensity: number }) {
  const sparkleAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (isPlaying) {
      sparkleAnimation.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );
    }
  }, [isPlaying]);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sparkleAnimation.value, [0, 1], [0.2, 1]) * intensity,
    transform: [
      { scale: interpolate(sparkleAnimation.value, [0, 1], [0.5, 1]) }
    ],
  }));

  return (
    <Animated.View style={[styles.happyContainer, sparkleStyle]}>
      {[...Array(12)].map((_, i) => (
        <View 
          key={i}
          style={[
            styles.sparkle,
            {
              top: Math.random() * height,
              left: Math.random() * width,
              backgroundColor: '#FFD700',
            }
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
  },
  svg: {
    position: 'absolute',
  },
  wave: {
    position: 'absolute',
    width: width * 2,
    height,
  },
  centerPulse: {
    position: 'absolute',
    top: height * 0.5 - 50,
    left: width * 0.5 - 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  energeticContainer: {
    position: 'absolute',
    width,
    height,
  },
  energyBolt: {
    position: 'absolute',
    width: 20,
    height: 4,
    backgroundColor: '#FF6347',
    borderRadius: 2,
  },
  calmContainer: {
    position: 'absolute',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#98FB98',
  },
  happyContainer: {
    position: 'absolute',
    width,
    height,
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});