import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { mergeIntervals, calculateTotalWatched, type Interval } from '@/lib/interval-utils';
import type { VideoProgress } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface VideoProgressState {
  currentTime: number;
  duration: number;
  watchedIntervals: Interval[];
  totalWatched: number;
  isPlaying: boolean;
  lastPosition: number;
  sessionStats: {
    watchTime: number;
    pauses: number;
    seeks: number;
    playbackRate: number;
  };
}

interface UseVideoProgressProps {
  userId: string;
  videoId: string;
  autoSaveInterval?: number;
}

export function useVideoProgress({ userId, videoId, autoSaveInterval = 5000 }: UseVideoProgressProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const autoSaveRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);
  const watchStartTimeRef = useRef<number>(0);

  const [state, setState] = useState<VideoProgressState>({
    currentTime: 0,
    duration: 0,
    watchedIntervals: [],
    totalWatched: 0,
    isPlaying: false,
    lastPosition: 0,
    sessionStats: {
      watchTime: 0,
      pauses: 0,
      seeks: 0,
      playbackRate: 1,
    },
  });

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Load saved progress
  const { data: savedProgress, isLoading } = useQuery<VideoProgress>({
    queryKey: ['/api/progress', userId, videoId],
    queryFn: async () => {
      const response = await fetch(`/api/progress/${userId}/${videoId}`, {
        credentials: 'include',
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load progress: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!userId && !!videoId,
  });

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<VideoProgress>) => {
      const response = await apiRequest('POST', `/api/progress/${userId}/${videoId}`, progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress', userId, videoId] });
      lastSaveTimeRef.current = Date.now();
    },
    onError: (error) => {
      console.error('Failed to save progress:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save video progress. Will retry automatically.",
        variant: "destructive",
      });
    },
  });

  // Initialize state from saved progress
  useEffect(() => {
    if (savedProgress) {
      setState(prev => ({
        ...prev,
        watchedIntervals: savedProgress.intervals || [],
        totalWatched: savedProgress.totalUniqueSeconds || 0,
        lastPosition: savedProgress.lastPosition || 0,
        duration: savedProgress.duration || 0,
      }));
    }
  }, [savedProgress]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && autoSaveInterval > 0) {
      autoSaveRef.current = setInterval(() => {
        if (state.isPlaying) {
          saveProgress();
        }
      }, autoSaveInterval);

      return () => {
        if (autoSaveRef.current) {
          clearInterval(autoSaveRef.current);
        }
      };
    }
  }, [autoSaveEnabled, autoSaveInterval, state.isPlaying]);

  const trackWatchedSegment = useCallback((start: number, end: number) => {
    if (start >= end || end - start < 0.5) return; // Ignore very short segments

    setState(prev => {
      const newInterval: Interval = [Math.floor(start), Math.ceil(end)];
      const updatedIntervals = mergeIntervals([...prev.watchedIntervals, newInterval]);
      const totalWatched = calculateTotalWatched(updatedIntervals);

      return {
        ...prev,
        watchedIntervals: updatedIntervals,
        totalWatched,
      };
    });
  }, []);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    setState(prev => {
      const newState = { ...prev, currentTime };
      
      // Track continuous watching
      if (prev.isPlaying && watchStartTimeRef.current > 0) {
        const watchDuration = currentTime - watchStartTimeRef.current;
        if (watchDuration > 0.5 && watchDuration < 2) { // Reasonable watch segment
          trackWatchedSegment(watchStartTimeRef.current, currentTime);
        }
      }
      
      watchStartTimeRef.current = currentTime;
      return newState;
    });
  }, [trackWatchedSegment]);

  const handlePlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true,
    }));
    watchStartTimeRef.current = state.currentTime;
  }, [state.currentTime]);

  const handlePause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      sessionStats: {
        ...prev.sessionStats,
        pauses: prev.sessionStats.pauses + 1,
      },
    }));
    
    // Track the segment being watched before pause
    if (watchStartTimeRef.current > 0) {
      trackWatchedSegment(watchStartTimeRef.current, state.currentTime);
    }
    
    // Save progress on pause
    saveProgress();
  }, [state.currentTime, trackWatchedSegment]);

  const handleSeeked = useCallback((newTime: number) => {
    setState(prev => ({
      ...prev,
      currentTime: newTime,
      lastPosition: newTime,
      sessionStats: {
        ...prev.sessionStats,
        seeks: prev.sessionStats.seeks + 1,
      },
    }));
    
    watchStartTimeRef.current = newTime;
    saveProgress();
  }, []);

  const handleLoadedMetadata = useCallback((duration: number) => {
    setState(prev => ({
      ...prev,
      duration,
    }));
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setState(prev => ({
      ...prev,
      sessionStats: {
        ...prev.sessionStats,
        playbackRate: rate,
      },
    }));
  }, []);

  const saveProgress = useCallback(() => {
    const progressData = {
      userId,
      videoId,
      intervals: state.watchedIntervals,
      totalUniqueSeconds: state.totalWatched,
      lastPosition: state.currentTime,
      duration: state.duration,
    };

    saveProgressMutation.mutate(progressData);
  }, [userId, videoId, state, saveProgressMutation]);

  const resetProgress = useCallback(() => {
    setState(prev => ({
      ...prev,
      watchedIntervals: [],
      totalWatched: 0,
      lastPosition: 0,
      sessionStats: {
        watchTime: 0,
        pauses: 0,
        seeks: 0,
        playbackRate: 1,
      },
    }));

    // Delete progress from server
    apiRequest('DELETE', `/api/progress/${userId}/${videoId}`)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/progress', userId, videoId] });
        toast({
          title: "Progress Reset",
          description: "Video progress has been reset successfully.",
        });
      })
      .catch(() => {
        toast({
          title: "Reset Failed",
          description: "Failed to reset progress on server.",
          variant: "destructive",
        });
      });
  }, [userId, videoId, queryClient, toast]);

  return {
    state,
    isLoading,
    autoSaveEnabled,
    setAutoSaveEnabled,
    isSaving: saveProgressMutation.isPending,
    lastSaveTime: lastSaveTimeRef.current,
    handlers: {
      handleTimeUpdate,
      handlePlay,
      handlePause,
      handleSeeked,
      handleLoadedMetadata,
      handlePlaybackRateChange,
    },
    actions: {
      saveProgress,
      resetProgress,
    },
  };
}
