import { Bell, Moon, Sun, Play } from 'lucide-react';
import { formatTime } from '@/lib/interval-utils';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { VideoPlayer } from '@/components/video-player';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { TimelineVisualization } from '@/components/timeline-visualization';
import { APIControls } from '@/components/api-controls';
import { useVideoProgress } from '@/hooks/use-video-progress';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'wouter';

export default function VideoPlayerPage() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
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
    <div className="flex h-screen overflow-hidden bg-background dark:bg-background">
      {/* Desktop Sidebar - Only visible on large screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Professional Header */}
        <header className="bg-surface dark:bg-surface border-b border-gray-100 dark:border-gray-700 shadow-medium relative overflow-hidden">
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10"></div>
          
          <div className="relative z-10 px-4 lg:px-6 py-4 lg:py-6">
            <div className="flex items-center justify-between">
              {/* Left Section - Course Info */}
              <div className="flex items-center space-x-3 lg:space-x-6">
                {/* Mobile Menu Button - Only on mobile */}
                <div className="lg:hidden">
                  <Sidebar />
                </div>
                
                {/* Course Badge & Info */}
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-medium">
                    <Play className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h1 className="text-xl lg:text-2xl font-bold text-secondary dark:text-white truncate">React Components & Props</h1>
                      <div className="px-2 lg:px-3 py-1 bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent rounded-xl text-xs font-bold whitespace-nowrap">
                        PREMIUM
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Chapter 3 of 12</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Intermediate Level</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>1,234 students enrolled</span>
                      </span>
                    </div>
                    <div className="md:hidden text-sm text-gray-600 dark:text-gray-300">
                      <span>Chapter 3 • Intermediate • 1,234 students</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Status & Controls */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Progress Overview Card - Hidden on small screens */}
                <div className="hidden xl:flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-2xl px-4 lg:px-6 py-3 shadow-medium border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 lg:w-12 h-10 lg:h-12">
                      <svg className="w-10 lg:w-12 h-10 lg:h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200 dark:text-gray-700"/>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100)}, 100`} className="text-primary" strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100)}%</span>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Course Progress</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(state.totalWatched)} watched</p>
                    </div>
                  </div>
                </div>

                {/* Mini Progress Badge for Medium Screens */}
                <div className="hidden md:flex xl:hidden items-center space-x-2 bg-white dark:bg-gray-800 rounded-2xl px-3 py-2 shadow-soft border border-gray-100 dark:border-gray-700">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-bold text-primary">{Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100)}%</span>
                </div>

                {/* Connection Status */}
                <div className="hidden sm:flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 shadow-soft">
                  <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs lg:text-sm font-bold text-green-700 dark:text-green-400">Live</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {/* Theme Toggle */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 lg:w-5 h-4 lg:h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Moon className="w-4 lg:w-5 h-4 lg:h-5 text-gray-600" />
                    )}
                  </Button>
                  
                  {/* Notifications */}
                  <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="relative w-10 lg:w-12 h-10 lg:h-12 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Bell className="w-4 lg:w-5 h-4 lg:h-5 text-gray-600 dark:text-gray-300" />
                      <span className="absolute -top-1 -right-1 w-4 lg:w-5 h-4 lg:h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg">2</span>
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <Link href="/profile">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-medium cursor-pointer hover:shadow-lg transition-shadow text-xs lg:text-sm">
                      JD
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background dark:bg-background">
          <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Premium Content Header */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-medium border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Dashboard</h2>
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-xs font-bold">
                      ACTIVE SESSION
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Track your unique video progress and resume seamlessly from where you left off</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{state.watchedIntervals.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Segments</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200 dark:bg-gray-600"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">{formatTime(state.totalWatched)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Watched</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player Section */}
            <VideoPlayer 
              userId={userId}
              videoId={videoId}
              title="React Components & Props"
            />

            {/* Progress Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Timeline Visualization */}
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
              
              <div className="space-y-8">
                {/* Progress Dashboard */}
                <ProgressDashboard
                  watchedIntervals={state.watchedIntervals}
                  totalWatched={state.totalWatched}
                  duration={state.duration}
                  sessionStats={state.sessionStats}
                  lastSaveTime={lastSaveTime}
                  onResetSession={handleResetSession}
                />
              </div>
            </div>

            {/* Learning Insights Footer */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Learning Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Your progress is tracked intelligently, counting only unique content viewed</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-blue-500 mb-1">{state.sessionStats.pauses}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pauses</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-purple-500 mb-1">{state.sessionStats.seeks}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Seeks</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-green-500 mb-1">{state.sessionStats.playbackRate}x</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Speed</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-orange-500 mb-1">{Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100)}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
