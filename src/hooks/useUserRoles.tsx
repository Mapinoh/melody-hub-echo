
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'artist' | 'editorial_playlister' | 'listener';

export const useUserRoles = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get current user's roles
  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(item => item.role as UserRole);
    },
    enabled: !!user,
  });

  // Check if user has specific role
  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  // Get all users with roles (admin only)
  const { data: allUsersWithRoles = [] } = useQuery({
    queryKey: ['all-users-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          assigned_at,
          profiles!user_roles_user_id_fkey (
            full_name,
            username,
            avatar_url
          )
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: hasRole('admin'),
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role, assigned_by: user?.id });
      
      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          action_type: 'assign_role',
          target_type: 'user',
          target_id: userId,
          details: { role }
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      toast.success('Role assigned successfully');
    },
    onError: (error) => {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          action_type: 'remove_role',
          target_type: 'user',
          target_id: userId,
          details: { role }
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  });

  return {
    userRoles,
    isLoading,
    hasRole,
    allUsersWithRoles,
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAdmin: hasRole('admin'),
    isArtist: hasRole('artist'),
    isEditorialPlaylister: hasRole('editorial_playlister'),
    isListener: hasRole('listener'),
  };
};
