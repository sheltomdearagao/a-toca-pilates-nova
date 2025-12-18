import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const NotificationBadge = ({
  count,
  maxCount = 99,
  variant = 'destructive',
  size = 'md',
  className,
  children
}: NotificationBadgeProps) => {
  if (count === 0) return <>{children}</>;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 min-w-[16px] h-4',
    md: 'text-xs px-2 py-1 min-w-[20px] h-5',
    lg: 'text-sm px-2.5 py-1 min-w-[24px] h-6'
  };

  return (
    <div className="relative inline-block">
      {children}
      <Badge
        variant={variant}
        className={cn(
          "absolute -top-2 -right-2 rounded-full border-2 border-background animate-pulse-glow",
          sizeClasses[size],
          className
        )}
      >
        {displayCount}
      </Badge>
    </div>
  );
};

export default NotificationBadge;