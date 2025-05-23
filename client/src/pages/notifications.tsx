import { Bell, CheckCircle, Info, AlertTriangle, X, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Course Progress Saved',
      message: 'Your progress in React Components & Props has been automatically saved.',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Course Available',
      message: 'Advanced React Patterns is now available in your learning path.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Learning Streak Alert',
      message: 'Keep up your 7-day learning streak! Complete a lesson today.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You\'ve earned the "Dedicated Learner" badge.',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      type: 'info',
      title: 'System Update',
      message: 'LearnTrack has been updated with new features and improvements.',
      time: '2 days ago',
      read: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-orange-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-300">Stay updated with your learning progress</p>
          </div>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {unreadCount} unread
              </Badge>
            )}
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Recent Notifications</span>
            </CardTitle>
            <CardDescription>Your latest updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-400">You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-2xl border-l-4 transition-all duration-200 ${
                      notification.read 
                        ? 'bg-gray-50 dark:bg-gray-800/50' 
                        : 'bg-white dark:bg-gray-800 shadow-soft'
                    } ${getBorderColor(notification.type)}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              notification.read 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`mt-1 text-sm ${
                              notification.read 
                                ? 'text-gray-500 dark:text-gray-400' 
                                : 'text-gray-600 dark:text-gray-300'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs"
                              >
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              className="w-8 h-8 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Customize what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Learning Updates</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span className="text-sm">Progress saved notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span className="text-sm">Course completion alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span className="text-sm">Achievement notifications</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">System Updates</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span className="text-sm">New course announcements</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Platform updates</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Weekly progress reports</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}