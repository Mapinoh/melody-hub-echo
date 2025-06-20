
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
      {/* Mobile sidebar trigger and logo */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="md:hidden text-white" />
        <div className="md:hidden">
          <h1 className="text-xl font-bold text-white">MAUDIO</h1>
        </div>
      </div>

      {/* Search Bar - hidden on mobile, full width on desktop */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              name="search"
              placeholder="What do you want to listen to?"
              className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-700"
            />
          </div>
        </form>
      </div>

      {/* Mobile search button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white"
          onClick={() => navigate('/search')}
        >
          <Search size={18} />
        </Button>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hidden md:flex">
          <Bell size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white"
          onClick={() => navigate('/profile')}
        >
          <User size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hidden md:flex"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};
