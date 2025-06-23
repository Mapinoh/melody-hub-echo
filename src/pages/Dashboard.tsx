
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useSupabaseTracks } from '@/hooks/useSupabaseTracks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Music, Heart, Upload, Users, TrendingUp, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isArtist, isAdmin, isEditorialPlaylister, userRoles } = useUserRoles();
  const { tracks } = useSupabaseTracks();

  const getRoleBasedContent = () => {
    if (isAdmin) {
      return {
        title: 'Admin Dashboard',
        description: 'Manage users, content, and system settings',
        primaryAction: () => navigate('/admin'),
        primaryActionText: 'Go to Admin Panel',
        stats: [
          { label: 'Total Tracks', value: tracks.length, icon: Music },
          { label: 'Active Users', value: '1.2K', icon: Users },
          { label: 'Growth', value: '+12%', icon: TrendingUp },
        ]
      };
    }

    if (isArtist) {
      return {
        title: 'Artist Studio',
        description: 'Manage your music, analytics, and fan engagement',
        primaryAction: () => navigate('/upload'),
        primaryActionText: 'Upload New Track',
        stats: [
          { label: 'Your Tracks', value: '12', icon: Music },
          { label: 'Total Plays', value: '45.2K', icon: Play },
          { label: 'Followers', value: '892', icon: Heart },
        ]
      };
    }

    if (isEditorialPlaylister) {
      return {
        title: 'Editorial Dashboard',
        description: 'Curate playlists and discover new music',
        primaryAction: () => navigate('/playlists'),
        primaryActionText: 'Manage Playlists',
        stats: [
          { label: 'Your Playlists', value: '24', icon: Music },
          { label: 'Total Followers', value: '5.8K', icon: Users },
          { label: 'New Submissions', value: '18', icon: Upload },
        ]
      };
    }

    return {
      title: 'Music Dashboard',
      description: 'Your personalized music experience',
      primaryAction: () => navigate('/discover'),
      primaryActionText: 'Discover Music',
      stats: [
        { label: 'Liked Songs', value: '156', icon: Heart },
        { label: 'Playlists', value: '8', icon: Music },
        { label: 'Hours Listened', value: '42', icon: Play },
      ]
    };
  };

  const content = getRoleBasedContent();

  return (
    <SharedLayout>
      <ResponsiveContainer className="py-4 md:py-6 pb-24">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{content.title}</h1>
          <p className="text-gray-400 text-sm md:text-base">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {content.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.label}</CardTitle>
                  <Icon className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={content.primaryAction} className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                {content.primaryActionText}
              </Button>
              <Button variant="outline" onClick={() => navigate('/library')} className="w-full justify-start">
                <Music className="mr-2 h-4 w-4" />
                View Your Library
              </Button>
              <Button variant="outline" onClick={() => navigate('/discover')} className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Discover New Music
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Roles</CardTitle>
              <CardDescription>Current permissions and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userRoles.map((role) => (
                  <div key={role} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-white capitalize">
                      {role.replace('_', ' ')}
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
                {userRoles.length === 0 && (
                  <p className="text-gray-400 text-sm">No roles assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ResponsiveContainer>
    </SharedLayout>
  );
};

export default Dashboard;
