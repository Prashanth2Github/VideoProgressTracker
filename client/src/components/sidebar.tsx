import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Play, BarChart3, History, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigation = [
  { name: 'Video Player', href: '/', icon: Play },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Watch History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-surface dark:bg-surface">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-medium">
            <Play className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary dark:text-white">LearnTrack</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Smart Video Learning</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center space-x-4 p-4 rounded-2xl font-medium transition-all cursor-pointer group ${
                    isActive
                      ? 'gradient-primary text-white shadow-soft'
                      : 'text-gray-600 hover:bg-surface-secondary hover:shadow-soft'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-white'
                  }`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-surface-secondary border border-gray-100 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-soft">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500">Premium Student</p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-surface dark:bg-surface shadow-medium border-r border-gray-100 dark:border-gray-700">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
