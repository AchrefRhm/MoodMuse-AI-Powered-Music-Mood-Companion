import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Send, 
  Smile,
  Type,
  Palette
} from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import { PREDEFINED_MOODS } from '@/constants/moods';
import { useMoodAnalysis } from '@/hooks/useMoodAnalysis';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function MoodInputScreen() {
  const router = useRouter();
  const { analyzeMood, isAnalyzing } = useMoodAnalysis();
  const [inputMethod, setInputMethod] = useState<'text' | 'emoji' | 'visual'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const slideAnimation = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    slideAnimation.value = withTiming(1, { duration: 500 });
  }, [inputMethod]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: interpolate(slideAnimation.value, [0, 1], [width, 0])
      }
    ],
    opacity: slideAnimation.value
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const handleSubmit = async () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    let inputValue = '';
    
    switch (inputMethod) {
      case 'text':
        inputValue = textInput;
        break;
      case 'emoji':
        inputValue = selectedEmoji;
        break;
      case 'visual':
        inputValue = selectedMood;
        break;
    }

    if (!inputValue) return;

    const detectedMood = await analyzeMood({
      type: inputMethod,
      value: inputValue,
      timestamp: new Date()
    });

    if (detectedMood) {
      router.push({
        pathname: '/home/playlist-result',
        params: { moodId: detectedMood.id }
      });
    }
  };

  const emojis = ['😊', '😢', '⚡', '🧘', '😰', '💕', '😠', '🌅', '🤔', '😴', '🥳', '😌'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
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
        
        <Text style={styles.headerTitle}>Tell Me Your Mood</Text>
      </View>

      {/* Input Method Selector */}
      <View style={styles.methodSelector}>
        <TouchableOpacity
          style={[styles.methodButton, inputMethod === 'text' && styles.methodButtonActive]}
          onPress={() => {
            setInputMethod('text');
            slideAnimation.value = 0;
          }}
        >
          <Type size={20} color={inputMethod === 'text' ? '#ffffff' : '#666'} />
          <Text style={[styles.methodButtonText, inputMethod === 'text' && styles.methodButtonTextActive]}>
            Text
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.methodButton, inputMethod === 'emoji' && styles.methodButtonActive]}
          onPress={() => {
            setInputMethod('emoji');
            slideAnimation.value = 0;
          }}
        >
          <Smile size={20} color={inputMethod === 'emoji' ? '#ffffff' : '#666'} />
          <Text style={[styles.methodButtonText, inputMethod === 'emoji' && styles.methodButtonTextActive]}>
            Emoji
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.methodButton, inputMethod === 'visual' && styles.methodButtonActive]}
          onPress={() => {
            setInputMethod('visual');
            slideAnimation.value = 0;
          }}
        >
          <Palette size={20} color={inputMethod === 'visual' ? '#ffffff' : '#666'} />
          <Text style={[styles.methodButtonText, inputMethod === 'visual' && styles.methodButtonTextActive]}>
            Visual
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Content */}
      <Animated.View style={[styles.inputContent, slideStyle]}>
        {inputMethod === 'text' && (
          <View style={styles.textInputContainer}>
            <Text style={styles.inputLabel}>Describe how you're feeling...</Text>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="I'm feeling energetic and ready to take on the world!"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              textAlignVertical="top"
            />
          </View>
        )}

        {inputMethod === 'emoji' && (
          <View style={styles.emojiContainer}>
            <Text style={styles.inputLabel}>Choose an emoji that represents your mood</Text>
            <View style={styles.emojiGrid}>
              {emojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    selectedEmoji === emoji && styles.emojiButtonSelected
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {inputMethod === 'visual' && (
          <View style={styles.visualContainer}>
            <Text style={styles.inputLabel}>Select your current mood</Text>
            <View style={styles.moodGrid}>
              {PREDEFINED_MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.visualMoodButton,
                    { backgroundColor: mood.color + '30' },
                    selectedMood === mood.id && styles.visualMoodButtonSelected
                  ]}
                  onPress={() => setSelectedMood(mood.id)}
                >
                  <Text style={styles.visualMoodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.visualMoodName}>{mood.name}</Text>
                  <Text style={styles.visualMoodDescription}>{mood.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>

      {/* Submit Button */}
      <Animated.View style={[styles.submitContainer, buttonStyle]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (textInput || selectedEmoji || selectedMood) && styles.submitButtonActive
          ]}
          onPress={handleSubmit}
          disabled={!textInput && !selectedEmoji && !selectedMood}
        >
          <LinearGradient
            colors={
              textInput || selectedEmoji || selectedMood
                ? [COLORS.accent[500], COLORS.accent[600]]
                : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']
            }
            style={styles.submitGradient}
          >
            {isAnalyzing ? (
              <Text style={styles.submitButtonText}>Analyzing...</Text>
            ) : (
              <>
                <Send size={20} color="#ffffff" />
                <Text style={styles.submitButtonText}>Generate Playlist</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
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
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZE['2xl'],
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: 40,
  },
  methodSelector: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: SPACING.xs,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  methodButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  methodButtonText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  methodButtonTextActive: {
    color: '#ffffff',
  },
  inputContent: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  textInputContainer: {
    flex: 1,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: SPACING.lg,
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emojiContainer: {
    flex: 1,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  emojiText: {
    fontSize: 24,
  },
  visualContainer: {
    flex: 1,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  visualMoodButton: {
    width: (width - SPACING.md * 3) / 2,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  visualMoodButtonSelected: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  visualMoodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  visualMoodName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: SPACING.xs,
  },
  visualMoodDescription: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
  submitContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 40,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  submitButtonActive: {
    // Additional styles for active state
  },
  submitGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  submitButtonText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});