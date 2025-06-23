
import React from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { RoleGuard } from '@/components/RoleGuard';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, TrendingUp, Users, Upload, BarChart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArtistDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Tracks', value: '12', icon: Music, trend: '+2 this month' },
    { label: 'Total Plays', value: '45.2K', icon: TrendingUp, trend: '+15% this week' },
    { label: 'Followers', value: '892', icon: Users, trend: '+24 new' },
    { label: 'Monthly Listeners', value: '3.1K', icon: Eye, trend: '+8% growth' },
  ];

  return (
    <SharedLayout>
      <RoleGuard requiredRole="artist">
        <ResponsiveContainer className="py-4 md:py-6 pb-24">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Artist Studio</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Manage your music, track analytics, and engage with fans
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">{stat.label}</CardTitle>
                    <Icon className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-green-400 mt-1">{stat.trend}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription>Manage your music and profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/upload')} className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Track
                </Button>
                <Button variant="outline" onClick={() => navigate('/profile')} className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Edit Artist Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription>Latest updates on your music</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div>
                      <p className="text-white text-sm">New follower</p>
                      <p className="text-gray-400 text-xs">2 hours ago</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div>
                      <p className="text-white text-sm">Track reached 1K plays</p>
                      <p className="text-gray-400 text-xs">1 day ago</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div>
                      <p className="text-white text-sm">Profile verified</p>
                      <p className="text-gray-400 text-xs">3 days ago</p>
                    </div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ResponsiveContainer>
      </RoleGuard>
    </SharedLayout>
  );
};

export default ArtistDashboard;
