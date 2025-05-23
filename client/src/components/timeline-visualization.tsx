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
    <div className="bg-surface rounded-2xl shadow-medium p-6 mb-8 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
      
      <h4 className="text-xl font-bold text-secondary mb-6 flex items-center relative z-10">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-soft">
          <FlagTriangleRight className="w-5 h-5 text-white" />
        </div>
        Watch Timeline
      </h4>
      
      {/* Timeline Bar */}
      <div className="relative h-16 bg-surface-secondary rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-soft">
        {/* Progress segments */}
        {segments.map((segment, index) => (
          <div
            key={index}
            className="absolute top-0 h-full gradient-primary opacity-80 transition-all duration-300"
            style={{
              left: `${segment.left}%`,
              width: `${segment.width}%`,
            }}
          />
        ))}
        
        {/* Current position indicator */}
        <div 
          className="absolute top-0 w-1 h-full bg-red-500 shadow-lg z-10 transition-all duration-200"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-white" />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-white" />
        </div>
      </div>
      
      {/* Timeline Labels */}
      <div className="flex justify-between text-sm text-gray-500 mb-6 px-2">
        {timeLabels.map((label, index) => (
          <div key={index} className="bg-white px-3 py-1 rounded-lg shadow-soft border border-gray-100">
            <span className="font-mono font-medium">{label}</span>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-3 shadow-soft border border-gray-100">
          <div className="w-4 h-4 gradient-primary rounded-md shadow-sm" />
          <span className="text-gray-700 font-medium">Watched Segments</span>
        </div>
        <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-3 shadow-soft border border-gray-100">
          <div className="w-4 h-4 bg-surface-secondary rounded-md border border-gray-200" />
          <span className="text-gray-700 font-medium">Unwatched</span>
        </div>
        <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-3 shadow-soft border border-gray-100">
          <div className="w-2 h-4 bg-red-500 rounded-sm shadow-sm" />
          <span className="text-gray-700 font-medium">Current Position</span>
        </div>
      </div>
    </div>
  );
}
