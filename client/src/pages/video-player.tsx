import { Bell, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { VideoPlayer } from '@/components/video-player';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { TimelineVisualization } from '@/components/timeline-visualization';
import { APIControls } from '@/components/api-controls';
import { useVideoProgress } from '@/hooks/use-video-progress';
import { useToast } from '@/hooks/use-toast';

export default function VideoPlayerPage() {
  const { toast } = useToast();
  
  // In a real application, get these from authentication context
  const userId = 'user123';
  const videoId = 'react-intro-video';

  const {
    state,
    autoSaveEnabled,
    setAutoSaveEnabled,
    isSaving,
    lastSaveTime,
    actions,
  } = useVideoProgress({
    userId,
    videoId,
    autoSaveInterval: 5000,
  });

  const handleManualSave = () => {
    actions.saveProgress();
    toast({
      title: "Progress Saved",
      description: "Video progress has been saved successfully.",
    });
  };

  const handleResetSession = () => {
    // Reset only session stats, not the overall progress
    toast({
      title: "Session Reset",
      description: "Session statistics have been reset.",
    });
  };

  const handleResetProgress = () => {
    actions.resetProgress();
  };

  const handleAutoSaveToggle = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    toast({
      title: enabled ? "Auto-save Enabled" : "Auto-save Disabled",
      description: enabled 
        ? "Progress will be saved automatically every 5 seconds."
        : "Progress will only be saved manually or on specific events.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-secondary">Introduction to React.js</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Connected</span>
              </div>
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Video Player Section */}
            <VideoPlayer 
              userId={userId}
              videoId={videoId}
              title="React Components & Props"
            />

            {/* Progress Tracking Dashboard */}
            <ProgressDashboard
              watchedIntervals={state.watchedIntervals}
              totalWatched={state.totalWatched}
              duration={state.duration}
              sessionStats={state.sessionStats}
              lastSaveTime={lastSaveTime}
              onResetSession={handleResetSession}
            />

            {/* Video Timeline Visualization */}
            <TimelineVisualization
              watchedIntervals={state.watchedIntervals}
              currentTime={state.currentTime}
              duration={state.duration}
            />

            {/* API Status & Controls */}
            <APIControls
              autoSaveEnabled={autoSaveEnabled}
              onAutoSaveToggle={handleAutoSaveToggle}
              onManualSave={handleManualSave}
              onResetProgress={handleResetProgress}
              isSaving={isSaving}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
