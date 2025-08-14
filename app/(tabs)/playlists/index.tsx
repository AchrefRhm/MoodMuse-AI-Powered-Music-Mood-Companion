import React, { useState } from 'react';
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
  Search, 
  Play, 
  Heart,
  Clock,
  Music,
  Plus
} from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/spacing';
import { usePlaylistManager } from '@/hooks/usePlaylistManager';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PlaylistsScreen() {
  const { savedPlaylists, playPlaylist } = usePlaylistManager();
  const [searchQuery, setSearchQuery] = useState('');
  
  const scaleAnimation = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }]
  }));

  const handlePlaylistPress = (playlist: any) => {
    scaleAnimation.value = withSpring(0.98, {}, () => {
      scaleAnimation.value = withSpring(1);
    });
    playPlaylist(playlist);
  };

  const filteredPlaylists = savedPlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.mood.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <LinearGradient
        colors={[COLORS.neutral[50], COLORS.neutral[100]]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Playlists</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.neutral[400]} />
          <Text style={styles.searchInput}>Search playlists...</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {savedPlaylists.length === 0 ? (
          <View style={styles.emptyState}>
            <Music size={48} color={COLORS.neutral[400]} />
            <Text style={styles.emptyTitle}>No Playlists Yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first mood playlist by analyzing your current emotional state!
            </Text>
            <TouchableOpacity style={styles.createButton}>
              <LinearGradient
                colors={[COLORS.primary[500], COLORS.primary[600]]}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Create Playlist</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.playlistGrid}>
            {filteredPlaylists.map((playlist) => (
              <Animated.View key={playlist.id} style={animatedStyle}>
                <PlaylistCard 
                  playlist={playlist} 
                  onPress={() => handlePlaylistPress(playlist)}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function PlaylistCard({ playlist, onPress }: { playlist: any; onPress: () => void }) {
  const totalDuration = playlist.tracks.reduce((acc: number, track: any) => acc + track.duration, 0);
  
  return (
    <TouchableOpacity style={styles.playlistCard} onPress={onPress}>
      <LinearGradient
        colors={[playlist.mood.color + '20', playlist.mood.color + '10']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardEmoji}>{playlist.mood.emoji}</Text>
          <TouchableOpacity style={styles.cardHeartButton}>
            <Heart size={16} color={COLORS.accent[500]} fill={COLORS.accent[500]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{playlist.name}</Text>
          <Text style={styles.cardMood}>{playlist.mood.name} mood</Text>
          
          <View style={styles.cardMeta}>
            <View style={styles.cardMetaItem}>
              <Clock size={12} color={COLORS.neutral[500]} />
              <Text style={styles.cardMetaText}>
                {Math.round(totalDuration / 60)}m
              </Text>
            </View>
            <View style={styles.cardMetaItem}>
              <Music size={12} color={COLORS.neutral[500]} />
              <Text style={styles.cardMetaText}>{playlist.tracks.length}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.cardPlayButton}>
          <Play size={18} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>
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
  title: {
    fontSize: FONT_SIZE['3xl'],
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[400],
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[700],
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZE.base,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  createButton: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  createButtonText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  playlistGrid: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  playlistCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  cardGradient: {
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardHeartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: 'Inter-Bold',
    color: COLORS.neutral[900],
    marginBottom: SPACING.xs,
    lineHeight: 24,
  },
  cardMood: {
    fontSize: FONT_SIZE.sm,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[600],
    marginBottom: SPACING.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  cardMetaText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: 'Inter-Regular',
    color: COLORS.neutral[500],
  },
  cardPlayButton: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});