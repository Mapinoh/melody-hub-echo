
import React from 'react';
import { Search, Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <header className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-white">MAUDIO</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch}>
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

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
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
          className="text-gray-400 hover:text-white"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};
