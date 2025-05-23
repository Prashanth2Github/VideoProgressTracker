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
    <div className="bg-surface rounded-2xl shadow-medium p-6 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-5 rounded-full -translate-y-8 translate-x-8"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <h4 className="text-xl font-bold text-secondary flex items-center">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mr-4 shadow-soft">
            <Server className="w-5 h-5 text-white" />
          </div>
          API Status & Controls
        </h4>
        <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-3 shadow-soft border border-gray-100">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className={`text-sm font-bold ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
            {isConnected ? 'Backend Connected' : 'Connection Lost'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Auto-save Toggle */}
        <div className="p-4 bg-surface-secondary border border-gray-100 rounded-2xl shadow-soft hover:shadow-medium transition-shadow">
          <div className="flex items-center space-x-3">
            <Switch
              checked={autoSaveEnabled}
              onCheckedChange={onAutoSaveToggle}
            />
            <div>
              <p className="font-bold text-gray-900">Auto-save</p>
              <p className="text-xs text-gray-500">Every 5 seconds</p>
            </div>
          </div>
        </div>
        
        {/* Manual Save */}
        <Button
          variant="outline"
          className="p-4 h-auto flex-col items-start bg-surface-secondary border-gray-100 rounded-2xl shadow-soft hover:shadow-medium transition-all"
          onClick={onManualSave}
          disabled={isSaving}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Save className="text-white w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">
                {isSaving ? 'Saving...' : 'Save Now'}
              </p>
              <p className="text-xs text-gray-500">Manual backup</p>
            </div>
          </div>
        </Button>
        
        {/* Reset Progress */}
        <Button
          variant="outline"
          className="p-4 h-auto flex-col items-start bg-surface-secondary border-gray-100 rounded-2xl shadow-soft hover:shadow-medium hover:bg-red-50 group transition-all"
          onClick={handleResetClick}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-gray-200 group-hover:bg-red-500 rounded-xl flex items-center justify-center transition-colors">
              <Trash2 className="text-gray-500 group-hover:text-white w-5 h-5 transition-colors" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">Reset</p>
              <p className="text-xs text-gray-500">Clear all data</p>
            </div>
          </div>
        </Button>
        
        {/* Export Data */}
        <Button
          variant="outline"
          className="p-4 h-auto flex-col items-start bg-surface-secondary border-gray-100 rounded-2xl shadow-soft hover:shadow-medium transition-all"
          onClick={handleExportData}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Download className="text-white w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Export</p>
              <p className="text-xs text-gray-500">Download JSON</p>
            </div>
          </div>
        </Button>
      </div>
      
      {/* Recent API Calls Log */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
        <h5 className="font-bold text-gray-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <Wifi className="w-4 h-4 text-white" />
          </div>
          Recent API Calls
        </h5>
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {apiCalls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Server className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm">No API calls logged yet</p>
              <p className="text-xs text-gray-400 mt-1">Activity will appear here</p>
            </div>
          ) : (
            apiCalls.map((call, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-3 bg-surface-secondary rounded-xl border border-gray-100 hover:shadow-soft transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-mono text-xs">{call.endpoint}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">{call.status}</span>
                  <span className="text-gray-500 text-xs">{getTimeAgo(call.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
