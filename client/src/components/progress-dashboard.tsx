import { PieChart, Puzzle, Timer } from 'lucide-react';
import { formatTime, formatTimeDetailed, getProgressPercentage } from '@/lib/interval-utils';
import { Button } from '@/components/ui/button';

interface ProgressDashboardProps {
  watchedIntervals: [number, number][];
  totalWatched: number;
  duration: number;
  sessionStats: {
    watchTime: number;
    pauses: number;
    seeks: number;
    playbackRate: number;
  };
  lastSaveTime: number;
  onResetSession: () => void;
}

export function ProgressDashboard({
  watchedIntervals,
  totalWatched,
  duration,
  sessionStats,
  lastSaveTime,
  onResetSession,
}: ProgressDashboardProps) {
  const progressPercentage = getProgressPercentage(totalWatched, duration);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const getLastSaveText = () => {
    if (lastSaveTime === 0) return 'Never';
    const secondsAgo = Math.floor((Date.now() - lastSaveTime) / 1000);
    if (secondsAgo < 5) return 'Just now';
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Progress Card */}
      <div className="bg-surface rounded-2xl shadow-medium p-6 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 gradient-primary opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h4 className="text-lg font-bold text-secondary">Watch Progress</h4>
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
            <PieChart className="text-white w-6 h-6" />
          </div>
        </div>
        
        {/* Progress Circle */}
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              stroke="hsl(var(--muted))" 
              strokeWidth="6" 
              fill="none"
            />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              stroke="url(#progressGradient)" 
              strokeWidth="6" 
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out drop-shadow-sm"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{progressPercentage}%</span>
              <p className="text-xs text-gray-500 mt-1">Complete</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Unique Content Watched</p>
          <div className="bg-surface-secondary rounded-lg px-4 py-2">
            <p className="text-lg font-bold text-secondary">
              {formatTime(totalWatched)} <span className="text-gray-400 font-normal">/ {formatTime(duration)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Intervals Card */}
      <div className="bg-surface rounded-2xl shadow-medium p-6 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-accent opacity-10 rounded-full -translate-y-6 translate-x-6"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h4 className="text-lg font-bold text-secondary">Watched Segments</h4>
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-soft">
            <Puzzle className="text-white w-6 h-6" />
          </div>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {watchedIntervals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Puzzle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm">No segments watched yet</p>
              <p className="text-xs text-gray-400 mt-1">Start watching to see progress</p>
            </div>
          ) : (
            watchedIntervals.map((interval, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-gray-100 hover:shadow-soft transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Segment {index + 1}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded">
                    {formatTime(interval[0])} - {formatTime(interval[1])}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 text-center shadow-soft">
            <p className="text-xs text-gray-500 mb-1">Total Segments</p>
            <p className="text-lg font-bold text-accent">{watchedIntervals.length}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow-soft">
            <p className="text-xs text-gray-500 mb-1">Last Save</p>
            <p className="text-sm font-semibold text-gray-700">{getLastSaveText()}</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-surface rounded-2xl shadow-medium p-6 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-10 rounded-full -translate-y-6 translate-x-6"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h4 className="text-lg font-bold text-secondary">Session Stats</h4>
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-soft">
            <Timer className="text-white w-6 h-6" />
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 bg-surface-secondary rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Watch Time</span>
            </div>
            <span className="font-bold text-gray-800">{formatTimeDetailed(sessionStats.watchTime)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-surface-secondary rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Pauses</span>
            </div>
            <span className="font-bold text-gray-800">{sessionStats.pauses}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-surface-secondary rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Seeks</span>
            </div>
            <span className="font-bold text-gray-800">{sessionStats.seeks}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-surface-secondary rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Speed</span>
            </div>
            <span className="font-bold text-gray-800">{sessionStats.playbackRate}x</span>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full rounded-xl border-gray-200 hover:bg-gray-50 transition-colors font-medium"
          onClick={onResetSession}
        >
          Reset Session
        </Button>
      </div>
    </div>
  );
}
