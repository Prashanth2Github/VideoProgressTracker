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
        <header className="bg-surface border-b border-gray-100 px-6 py-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="lg:hidden">
                <Sidebar />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary">React Components & Props</h2>
                <p className="text-sm text-gray-600 mt-1">Master the fundamentals of React development</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-green-50 border border-green-200 shadow-soft">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-green-700">Backend Connected</span>
              </div>
              {/* Progress Indicator */}
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-surface-secondary border border-gray-100 shadow-soft">
                <div className="w-3 h-3 gradient-primary rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100)}% Complete
                </span>
              </div>
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative rounded-2xl">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">2</span>
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
