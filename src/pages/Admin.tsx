
import React, { useState } from 'react';
import { SharedLayout } from '@/components/SharedLayout';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Activity, Settings } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const { isAdmin, allUsersWithRoles, assignRole, removeRole } = useUserRoles();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'artist' | 'editorial_playlister' | 'listener'>('listener');

  if (!isAdmin) {
    return (
      <SharedLayout>
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400">You don't have admin privileges to access this page.</p>
          </div>
        </div>
      </SharedLayout>
    );
  }

  const handleAssignRole = () => {
    if (!selectedUserId || !selectedRole) {
      toast.error('Please select a user and role');
      return;
    }
    assignRole({ userId: selectedUserId, role: selectedRole });
  };

  const handleRemoveRole = (userId: string, role: string) => {
    removeRole({ userId, role: role as any });
  };

  // Group users by user_id to show all roles per user
  const userRoleMap = allUsersWithRoles.reduce((acc, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = {
        profile: item.profiles,
        roles: []
      };
    }
    acc[item.user_id].roles.push(item.role);
    return acc;
  }, {} as Record<string, { profile: any; roles: string[] }>);

  return (
    <SharedLayout>
      <div className="p-4 md:p-6 pb-24 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, roles, and system settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">
                {Object.keys(userRoleMap).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Artists</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">
                {Object.values(userRoleMap).filter(user => user.roles.includes('artist')).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Admins</CardTitle>
              <Shield className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-white">
                {Object.values(userRoleMap).filter(user => user.roles.includes('admin')).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Role Assignment */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Assign Role</CardTitle>
              <CardDescription>Assign roles to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">User ID</label>
                <Input
                  placeholder="Enter user ID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Role</label>
                <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listener">Listener</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="editorial_playlister">Editorial Playlister</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignRole} className="w-full">
                Assign Role
              </Button>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Users & Roles</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(userRoleMap).map(([userId, userData]) => (
                  <div key={userId} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {userData.profile?.full_name || userData.profile?.username || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{userId}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {userData.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-red-600"
                            onClick={() => handleRemoveRole(userId, role)}
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SharedLayout>
  );
};

export default Admin;
