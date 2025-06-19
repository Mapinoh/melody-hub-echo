import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SharedLayout } from '@/components/SharedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Music, Lock, Globe } from 'lucide-react';

interface Playlist {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  track_count?: number;
}

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks(count)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error: any) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          is_public: formData.is_public,
        });

      if (error) throw error;

      toast.success('Playlist created successfully!');
      setIsCreateOpen(false);
      setFormData({ title: '', description: '', is_public: false });
      fetchPlaylists();
    } catch (error: any) {
      toast.error(`Failed to create playlist: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <SharedLayout showMusicPlayer={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Please log in to view your playlists</div>
        </div>
      </SharedLayout>
    );
  }

  if (loading) {
    return (
      <SharedLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading playlists...</div>
        </div>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <div className="p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">My Playlists</h1>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Playlist</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePlaylist} className="space-y-4">
                  <div>
                    <label className="text-gray-200 text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter playlist title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-200 text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Describe your playlist"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_public"
                      checked={formData.is_public}
                      onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                      className="rounded border-gray-600"
                    />
                    <label htmlFor="is_public" className="text-gray-200 text-sm">
                      Make this playlist public
                    </label>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Create Playlist
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="truncate">{playlist.title}</span>
                      {playlist.is_public ? (
                        <Globe className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {playlist.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {playlist.description}
                      </p>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{playlist.track_count || 0} tracks</span>
                      <span>
                        {new Date(playlist.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No playlists yet</h3>
              <p className="text-gray-500 mb-6">Create your first playlist to organize your favorite tracks</p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </SharedLayout>
  );
};

export default Playlists;
