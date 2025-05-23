import { FlagTriangleRight } from 'lucide-react';
import { formatTime } from '@/lib/interval-utils';

interface TimelineVisualizationProps {
  watchedIntervals: [number, number][];
  currentTime: number;
  duration: number;
}

export function TimelineVisualization({
  watchedIntervals,
  currentTime,
  duration,
}: TimelineVisualizationProps) {
  const getTimelineSegments = () => {
    if (duration === 0) return [];
    
    return watchedIntervals.map(([start, end]) => ({
      left: (start / duration) * 100,
      width: ((end - start) / duration) * 100,
    }));
  };

  const getCurrentPosition = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  const getTimeLabels = () => {
    const labels = [];
    const stepCount = 4;
    const step = duration / stepCount;
    
    for (let i = 0; i <= stepCount; i++) {
      labels.push(formatTime(i * step));
    }
    
    return labels;
  };

  const segments = getTimelineSegments();
  const currentPosition = getCurrentPosition();
  const timeLabels = getTimeLabels();

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6 mb-8">
      <h4 className="text-lg font-semibold text-secondary mb-6 flex items-center">
        <FlagTriangleRight className="mr-3 text-primary" />
        Watch FlagTriangleRight
      </h4>
      
      {/* FlagTriangleRight Bar */}
      <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden mb-4">
        {/* Progress segments */}
        {segments.map((segment, index) => (
          <div
            key={index}
            className="absolute top-0 h-full bg-gradient-to-r from-primary to-blue-400"
            style={{
              left: `${segment.left}%`,
              width: `${segment.width}%`,
            }}
          />
        ))}
        
        {/* Current position indicator */}
        <div 
          className="absolute top-0 w-1 h-full bg-red-500 shadow-lg z-10"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>
      
      {/* FlagTriangleRight Labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        {timeLabels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-primary to-blue-400 rounded" />
          <span className="text-gray-600">Watched</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <span className="text-gray-600">Unwatched</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-4 bg-red-500 rounded" />
          <span className="text-gray-600">Current Position</span>
        </div>
      </div>
    </div>
  );
}
