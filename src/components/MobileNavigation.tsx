
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Library, Upload, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className={cn('md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40', className)}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive 
                  ? 'text-white bg-gray-800' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
