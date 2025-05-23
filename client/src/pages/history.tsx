import { History, Clock, Play, CheckCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTime, formatTimeDetailed } from '@/lib/interval-utils';
import { useVideoProgress } from '@/hooks/use-video-progress';

export default function HistoryPage() {
  const userId = 'user123';
  const videoId = 'react-intro-video';

  const { state } = useVideoProgress({
    userId,
    videoId,
    autoSaveInterval: 5000,
  });

  // Mock history data - in a real app, this would come from the backend
  const watchHistory = [
    {
      id: 1,
      title: "React Components & Props",
      progress: Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100),
      watchTime: state.totalWatched,
      totalDuration: state.duration,
      lastWatched: new Date(),
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
      status: state.totalWatched > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 2,
      title: "Introduction to React Hooks",
      progress: 85,
      watchTime: 420,
      totalDuration: 500,
      lastWatched: new Date(Date.now() - 86400000), // Yesterday
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      status: 'in-progress'
    },
    {
      id: 3,
      title: "State Management with Redux",
      progress: 100,
      watchTime: 720,
      totalDuration: 720,
      lastWatched: new Date(Date.now() - 172800000), // 2 days ago
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      status: 'completed'
    },
    {
      id: 4,
      title: "Building Forms in React",
      progress: 45,
      watchTime: 180,
      totalDuration: 400,
      lastWatched: new Date(Date.now() - 259200000), // 3 days ago
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop",
      status: 'in-progress'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Not Started</Badge>;
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays - 1} days ago`;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">Watch History</h1>
          <p className="text-gray-600 dark:text-gray-300">Review your learning journey and continue where you left off</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{watchHistory.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">
                    {formatTime(watchHistory.reduce((total, video) => total + video.watchTime, 0))}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Watch Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {watchHistory.filter(v => v.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video History List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Continue watching from where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchHistory.map((video) => (
                <div key={video.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-medium transition-shadow">
                  {/* Video Thumbnail */}
                  <div className="relative w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{video.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatTimeDetailed(video.watchTime)} watched</span>
                      <span>•</span>
                      <span>{formatTimeDetailed(video.totalDuration)} total</span>
                      <span>•</span>
                      <span>{getRelativeTime(video.lastWatched)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{video.progress}% complete</span>
                        {getStatusBadge(video.status)}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span className="hidden sm:inline">Continue</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Streak</CardTitle>
            <CardDescription>Keep up your daily learning habit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Day streak</p>
              </div>
              <div className="flex space-x-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}