import { User, Mail, Calendar, Award, BookOpen, Clock, Target, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatTime } from '@/lib/interval-utils';
import { useVideoProgress } from '@/hooks/use-video-progress';

export default function ProfilePage() {
  const userId = 'user123';
  const videoId = 'react-intro-video';

  const { state } = useVideoProgress({
    userId,
    videoId,
    autoSaveInterval: 5000,
  });

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    avatar: 'JD',
    level: 'Intermediate',
    streak: 7,
    totalWatchTime: state.totalWatched + 1200, // Add some baseline time
    coursesCompleted: 3,
    coursesInProgress: 2,
    achievements: [
      { name: 'First Steps', description: 'Completed your first lesson', icon: '🎯', date: 'Jan 15, 2024' },
      { name: 'Dedicated Learner', description: '7-day learning streak', icon: '🔥', date: 'May 20, 2025' },
      { name: 'React Master', description: 'Completed React fundamentals', icon: '⚛️', date: 'May 15, 2025' },
    ]
  };

  const currentProgress = Math.round((state.totalWatched / Math.max(state.duration, 1)) * 100);

  return (
    <div className="min-h-screen bg-background dark:bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Your learning journey and achievements</p>
        </div>

        {/* Profile Header Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
          <CardContent className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                {userProfile.avatar}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                  <h2 className="text-3xl font-bold text-secondary dark:text-white">{userProfile.name}</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20 w-fit mx-auto md:mx-0">
                    {userProfile.level}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {userProfile.joinDate}</span>
                  </div>
                </div>

                <Button className="mt-4 flex items-center space-x-2">
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft">
                  <div className="text-2xl font-bold text-primary">{userProfile.streak}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
                </div>
                <div className="text-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-soft">
                  <div className="text-2xl font-bold text-accent">{userProfile.coursesCompleted}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">{formatTime(userProfile.totalWatchTime)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Watch Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{userProfile.coursesCompleted}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-500">{userProfile.coursesInProgress}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-500">{userProfile.achievements.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Current Learning Progress</CardTitle>
            <CardDescription>Your progress in ongoing courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">React Components & Props</span>
                <span className="text-sm text-gray-500">{currentProgress}%</span>
              </div>
              <Progress value={currentProgress} className="h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formatTime(state.totalWatched)} watched • {state.watchedIntervals.length} segments completed
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Advanced React Patterns</span>
                <span className="text-sm text-gray-500">25%</span>
              </div>
              <Progress value={25} className="h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">2h 15m watched • 8 segments completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your learning milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userProfile.achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{achievement.description}</p>
                  <p className="text-xs text-gray-500">Earned on {achievement.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
            <CardDescription>Track your learning objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <h4 className="font-medium">Complete React Course</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Master React fundamentals and advanced concepts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">60% Complete</p>
                  <p className="text-xs text-gray-500">3 of 5 modules</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <h4 className="font-medium">Daily Learning Streak</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn something new every day</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">7 Days</p>
                  <p className="text-xs text-gray-500">Current streak</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}