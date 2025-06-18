
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Edit, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
  });

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(formData);
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-6 h-6" />
                My Profile
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-300 hover:text-white"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-200 text-sm font-medium">Email</label>
                <Input
                  value={user.email || ''}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-400"
                />
              </div>

              <div>
                <label className="text-gray-200 text-sm font-medium">Full Name</label>
                {isEditing ? (
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <Input
                    value={formData.full_name || 'Not set'}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-300"
                  />
                )}
              </div>

              <div>
                <label className="text-gray-200 text-sm font-medium">Username</label>
                {isEditing ? (
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Choose a username"
                  />
                ) : (
                  <Input
                    value={formData.username || 'Not set'}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-300"
                  />
                )}
              </div>

              <div>
                <label className="text-gray-200 text-sm font-medium">Bio</label>
                {isEditing ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                ) : (
                  <Textarea
                    value={formData.bio || 'No bio added yet'}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-300"
                    rows={4}
                  />
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
