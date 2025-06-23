
import React from 'react';
import { useUserRoles, UserRole } from '@/hooks/useUserRoles';
import { Shield } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRole, 
  fallback 
}) => {
  const { hasRole, isLoading } = useUserRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">
            You need the {requiredRole.replace('_', ' ')} role to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
