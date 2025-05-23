import { Settings, User, Bell, Shield, Palette, Download, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    emailUpdates: false,
    playbackSpeed: 1,
    quality: 'auto',
    subtitles: false,
    username: 'John Doe',
    email: 'john.doe@example.com'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      theme
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learntrack-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // In a real app, this would clear user data from backend
      toast({
        title: "Data Cleared",
        description: "All your data has been removed.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Customize your learning experience</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Profile Settings</span>
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  value={settings.username}
                  onChange={(e) => handleSettingChange('username', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Learning Preferences</span>
            </CardTitle>
            <CardDescription>Customize your learning experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-save Progress</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save your watching progress</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Subtitles</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Show captions when available</p>
              </div>
              <Switch
                checked={settings.subtitles}
                onCheckedChange={(checked) => handleSettingChange('subtitles', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="playback-speed">Default Playback Speed</Label>
              <select 
                id="playback-speed"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                value={settings.playbackSpeed}
                onChange={(e) => handleSettingChange('playbackSpeed', parseFloat(e.target.value))}
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x (Normal)</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-quality">Video Quality</Label>
              <select 
                id="video-quality"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                value={settings.quality}
                onChange={(e) => handleSettingChange('quality', e.target.value)}
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications in your browser</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive course updates via email</p>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={(checked) => handleSettingChange('emailUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Data Management</span>
            </CardTitle>
            <CardDescription>Export or delete your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </Button>
              
              <Button variant="outline" onClick={handleExportData} className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleClearData}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About LearnTrack</CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Version</p>
                <p className="text-gray-600 dark:text-gray-400">1.0.0</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Last Updated</p>
                <p className="text-gray-600 dark:text-gray-400">May 2025</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Developer</p>
                <p className="text-gray-600 dark:text-gray-400">SDE Intern Project</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">License</p>
                <p className="text-gray-600 dark:text-gray-400">MIT License</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}