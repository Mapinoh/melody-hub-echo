
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
};
