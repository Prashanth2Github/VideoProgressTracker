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
    <div className="flex h-full flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-secondary">LearnTrack</h1>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-primary'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-surface shadow-lg border-r border-gray-200">
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
