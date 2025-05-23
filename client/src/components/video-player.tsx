import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Download, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoProgress } from '@/hooks/use-video-progress';
import { formatTimeDetailed } from '@/lib/interval-utils';

interface VideoPlayerProps {
  userId: string;
  videoId: string;
  videoUrl?: string;
  title?: string;
}

export function VideoPlayer({ 
  userId, 
  videoId, 
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  title = "Introduction to React.js"
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showResumeIndicator, setShowResumeIndicator] = useState(false);
  const [videoMetrics, setVideoMetrics] = useState({
    views: 1234,
    publishDate: "Jan 15, 2024"
  });

  const { state, handlers, actions, isLoading } = useVideoProgress({
    userId,
    videoId,
    autoSaveInterval: 5000,
  });

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      handlers.handleTimeUpdate(video.currentTime);
    };

    const handlePlay = () => {
      handlers.handlePlay();
    };

    const handlePause = () => {
      handlers.handlePause();
    };

    const handleSeeked = () => {
      handlers.handleSeeked(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      handlers.handleLoadedMetadata(video.duration);
    };

    const handleRateChange = () => {
      handlers.handlePlaybackRateChange(video.playbackRate);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ratechange', handleRateChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ratechange', handleRateChange);
    };
  }, [handlers]);

  // Handle resume from last position
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !state.lastPosition || isLoading) return;

    // Show resume indicator if last position is more than 10 seconds
    if (state.lastPosition > 10) {
      setShowResumeIndicator(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowResumeIndicator(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.lastPosition, isLoading]);

  const handleResumeClick = () => {
    const video = videoRef.current;
    if (video && state.lastPosition) {
      video.currentTime = state.lastPosition;
      setShowResumeIndicator(false);
    }
  };

  const handleDownload = () => {
    // In a real application, this would trigger a download
    console.log('Download video requested');
  };

  const handlePlaylistToggle = () => {
    // In a real application, this would toggle playlist view
    console.log('Playlist toggle requested');
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="aspect-video bg-black flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="aspect-video bg-black relative group">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover" 
          controls 
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Resume Position Indicator */}
        {showResumeIndicator && (
          <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Resume from {formatTimeDetailed(state.lastPosition)}</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-gray-200 p-1 h-auto"
                onClick={handleResumeClick}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Controls Bar */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary">{title}</h3>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handlePlaylistToggle}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>Playlist</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
        
        {/* Video Metadata */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <span>Duration:</span>
            <span className="font-medium">{formatTimeDetailed(state.duration)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>Views:</span>
            <span className="font-medium">{videoMetrics.views.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>Published:</span>
            <span className="font-medium">{videoMetrics.publishDate}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
