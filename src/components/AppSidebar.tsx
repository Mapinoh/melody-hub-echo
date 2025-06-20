
import React from 'react';
import { Home, Search, Library, Plus, Heart, Music, Podcast, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const playlistNavItems = [
    { icon: Plus, label: 'Create Playlist', path: '/playlists' },
    { icon: Heart, label: 'Liked Songs', path: '/liked' },
    { icon: Sparkles, label: 'AI Discover', path: '/discover' },
    { icon: Music, label: 'Music', path: '/music' },
    { icon: Podcast, label: 'Podcasts', path: '/podcasts' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-white">MAUDIO</h1>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={isActive(item.path)}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 data-[active=true]:text-white data-[active=true]:bg-gray-800"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 uppercase tracking-wider text-xs font-semibold">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlistNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={isActive(item.path)}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800 data-[active=true]:text-white data-[active=true]:bg-gray-800"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-500">© 2024 MAUDIO</p>
      </SidebarFooter>
    </Sidebar>
  );
}
