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
  videoUrl = "/static/LectureVideos/sample-lecture.mp4.webm", // updated to .webm with .mp4.webm filename
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !state.lastPosition || isLoading) return;

    if (state.lastPosition > 10) {
      setShowResumeIndicator(true);
      
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
    const link = document.createElement('a');
    link.href = videoUrl;
    // Replace all non-alphanumeric chars with _ and ensure extension is .webm
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlaylistToggle = () => {
    alert('Playlist feature coming soon! This will show related videos and learning materials.');
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
    <div className="bg-surface rounded-2xl shadow-medium overflow-hidden mb-8 border border-gray-100">
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black relative group">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover rounded-t-2xl" 
          controls 
          preload="metadata"
        >
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        
        {showResumeIndicator && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Resume watching</p>
                <p className="text-xs text-gray-600">{formatTimeDetailed(state.lastPosition)}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-600 hover:text-primary p-2 h-auto rounded-lg"
                onClick={handleResumeClick}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-surface-secondary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-secondary mb-1">{title}</h3>
            <p className="text-sm text-gray-600">Learn React fundamentals with hands-on examples</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handlePlaylistToggle}
              className="gradient-primary hover:opacity-90 transition-opacity flex items-center space-x-2 rounded-xl px-4 py-2.5"
            >
              <List className="w-4 h-4" />
              <span className="font-medium">Playlist</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownload}
              className="flex items-center space-x-2 rounded-xl px-4 py-2.5 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Download</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-soft">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-800">{formatTimeDetailed(state.duration)}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-soft">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-gray-600">Views:</span>
            <span className="font-semibold text-gray-800">{videoMetrics.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-soft">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-600">Published:</span>
            <span className="font-semibold text-gray-800">{videoMetrics.publishDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
