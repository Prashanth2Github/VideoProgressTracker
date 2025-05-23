import { BarChart3, TrendingUp, Clock, Target, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useVideoProgress } from '@/hooks/use-video-progress';
import { formatTime, formatTimeDetailed } from '@/lib/interval-utils';

export default function AnalyticsPage() {
  // In a real app, get these from authentication context
  const userId = 'user123';
  const videoId = 'react-intro-video';

  const { state } = useVideoProgress({
    userId,
    videoId,
    autoSaveInterval: 5000,
  });

  const completionRate = Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100);
  const averageSessionTime = state.totalWatched / Math.max(state.sessionStats.pauses + 1, 1);
  const engagementScore = Math.min(100, Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100 + (state.sessionStats.seeks > 5 ? -10 : 0)));

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">Learning Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your progress and understand your learning patterns</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <p className="text-xs text-gray-600">+5% from last session</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{formatTime(state.totalWatched)}</div>
              <p className="text-xs text-gray-600">Total unique content</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{formatTime(averageSessionTime)}</div>
              <p className="text-xs text-gray-600">Per watching session</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{engagementScore}/100</div>
              <p className="text-xs text-gray-600">Interaction quality</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Learning Progress</span>
              </CardTitle>
              <CardDescription>Your course completion status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">React Components & Props</span>
                  <span className="text-sm text-gray-500">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">State Management</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Hooks & Effects</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Session Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-accent" />
                <span>Session Statistics</span>
              </CardTitle>
              <CardDescription>Your learning behavior insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{state.sessionStats.pauses}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Pauses</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{state.sessionStats.seeks}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Seek Actions</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{state.sessionStats.playbackRate}x</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Playback Speed</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">{state.watchedIntervals.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Watch Segments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Insights</CardTitle>
            <CardDescription>AI-powered recommendations based on your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Great Progress!</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  You've watched {completionRate}% of unique content. Keep up the excellent work!
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Consistent Learning</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your {state.sessionStats.pauses} pause points show thoughtful engagement with the material.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Next Steps</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Continue to the next chapter to build on your React foundations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}