import { useState, useEffect } from 'react';
import { Server, Save, Trash2, Download, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface APICall {
  endpoint: string;
  status: string;
  timestamp: Date;
}

interface APIControlsProps {
  autoSaveEnabled: boolean;
  onAutoSaveToggle: (enabled: boolean) => void;
  onManualSave: () => void;
  onResetProgress: () => void;
  isSaving: boolean;
}

export function APIControls({
  autoSaveEnabled,
  onAutoSaveToggle,
  onManualSave,
  onResetProgress,
  isSaving,
}: APIControlsProps) {
  const { toast } = useToast();
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simulate API call logging
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate periodic API calls
      const endpoints = [
        'GET /api/health',
        'POST /api/progress/user123/react-intro',
        'PATCH /api/progress/user123/react-intro',
      ];
      
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const newCall: APICall = {
        endpoint: randomEndpoint,
        status: '200 OK',
        timestamp: new Date(),
      };

      setApiCalls(prev => [newCall, ...prev.slice(0, 9)]); // Keep last 10 calls
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    // In a real application, this would export the progress data
    const data = {
      userId: 'user123',
      videoId: 'react-intro',
      exportDate: new Date().toISOString(),
      // Include actual progress data here
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-progress.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Progress data has been exported to JSON file.",
    });
  };

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onResetProgress();
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="bg-surface rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-secondary flex items-center">
          <Server className="mr-3 text-primary" />
          API Status & Controls
        </h4>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
            {isConnected ? 'Backend Connected' : 'Connection Lost'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Auto-save Toggle */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Switch
              checked={autoSaveEnabled}
              onCheckedChange={onAutoSaveToggle}
            />
            <div>
              <p className="font-medium text-gray-900">Auto-save</p>
              <p className="text-xs text-gray-500">Every 5 seconds</p>
            </div>
          </div>
        </div>
        
        {/* Manual Save */}
        <Button
          variant="outline"
          className="p-4 h-auto flex-col items-start"
          onClick={onManualSave}
          disabled={isSaving}
        >
          <div className="flex items-center space-x-3 w-full">
            <Save className="text-primary" />
            <div className="text-left">
              <p className="font-medium text-gray-900">
                {isSaving ? 'Saving...' : 'Save Now'}
              </p>
              <p className="text-xs text-gray-500">Manual backup</p>
            </div>
          </div>
        </Button>
        
        {/* Reset Progress */}
        <Button
          variant="outline"
          className="p-4 h-auto flex-col items-start hover:bg-red-50 group"
          onClick={handleResetClick}
        >
          <div className="flex items-center space-x-3 w-full">
            <Trash2 className="text-gray-400 group-hover:text-red-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-red-700">Reset</p>
              <p className="text-xs text-gray-500">Clear all data</p>
            </div>
          </div>
        </Button>
        
        {/* Export Data */}
        <Button
          variant="outline"
          className="p-4 h-auto flex-col items-start"
          onClick={handleExportData}
        >
          <div className="flex items-center space-x-3 w-full">
            <Download className="text-primary" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Export</p>
              <p className="text-xs text-gray-500">Download JSON</p>
            </div>
          </div>
        </Button>
      </div>
      
      {/* Recent API Calls Log */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h5 className="font-medium text-gray-900 mb-3">Recent API Calls</h5>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {apiCalls.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No API calls logged yet</p>
            </div>
          ) : (
            apiCalls.map((call, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="text-gray-600">{call.endpoint}</span>
                <span className="text-green-600 font-medium">{call.status}</span>
                <span className="text-gray-500">{getTimeAgo(call.timestamp)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
