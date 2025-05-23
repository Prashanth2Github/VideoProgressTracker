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
      <div className="bg-surface rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-secondary">Watch Progress</h4>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <PieChart className="text-primary text-xl" />
          </div>
        </div>
        
        {/* Progress Circle */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              stroke="#E5E7EB" 
              strokeWidth="8" 
              fill="none"
            />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              stroke="#1976D2" 
              strokeWidth="8" 
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-secondary">{progressPercentage}%</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Unique Content Watched</p>
          <p className="text-lg font-semibold text-secondary">
            {formatTime(totalWatched)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      {/* Intervals Card */}
      <div className="bg-surface rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-secondary">Watched Segments</h4>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Puzzle className="text-accent text-xl" />
          </div>
        </div>
        
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {watchedIntervals.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No segments watched yet</p>
            </div>
          ) : (
            watchedIntervals.map((interval, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Segment {index + 1}
                </span>
                <span className="text-sm text-gray-600">
                  {formatTime(interval[0])} - {formatTime(interval[1])}
                </span>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total Segments: <span className="font-semibold">{watchedIntervals.length}</span>
          </p>
          <p className="text-sm text-gray-600">
            Last Save: <span className="font-semibold">{getLastSaveText()}</span>
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-surface rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-secondary">Session Stats</h4>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Timer className="text-purple-600 text-xl" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Watch Time</span>
            <span className="font-semibold">{formatTimeDetailed(sessionStats.watchTime)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pauses</span>
            <span className="font-semibold">{sessionStats.pauses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Seeks</span>
            <span className="font-semibold">{sessionStats.seeks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Speed</span>
            <span className="font-semibold">{sessionStats.playbackRate}x</span>
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full mt-4"
          onClick={onResetSession}
        >
          Reset Session
        </Button>
      </div>
    </div>
  );
}
