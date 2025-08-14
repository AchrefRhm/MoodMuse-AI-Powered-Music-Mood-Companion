import { useState, useCallback } from 'react';
import { Playlist, PlaylistFeedback } from '@/types/mood';

export function usePlaylistManager() {
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const savePlaylist = useCallback((playlist: Playlist) => {
    const updatedPlaylist = { ...playlist, is_favorite: true };
    setSavedPlaylists(prev => {
      const existingIndex = prev.findIndex(p => p.id === playlist.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedPlaylist;
        return updated;
      }
      return [...prev, updatedPlaylist];
    });
  }, []);

  const removePlaylist = useCallback((playlistId: string) => {
    setSavedPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, []);

  const playPlaylist = useCallback((playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    
    // Update play count
    setSavedPlaylists(prev => prev.map(p => 
      p.id === playlist.id 
        ? { ...p, play_count: p.play_count + 1 }
        : p
    ));
  }, []);

  const pausePlaylist = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumePlaylist = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const nextTrack = useCallback(() => {
    if (currentPlaylist && currentTrackIndex < currentPlaylist.tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  }, [currentPlaylist, currentTrackIndex]);

  const previousTrack = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  }, [currentTrackIndex]);

  const provideFeedback = useCallback((feedback: PlaylistFeedback) => {
    // In a real app, this would send feedback to the backend
    console.log('Playlist feedback received:', feedback);
  }, []);

  return {
    savedPlaylists,
    currentPlaylist,
    isPlaying,
    currentTrackIndex,
    savePlaylist,
    removePlaylist,
    playPlaylist,
    pausePlaylist,
    resumePlaylist,
    nextTrack,
    previousTrack,
    provideFeedback
  };
}