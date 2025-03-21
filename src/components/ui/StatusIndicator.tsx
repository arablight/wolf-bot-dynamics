
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'idle' | 'error';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  idle: 'bg-amber-500',
  error: 'bg-red-500',
};

const statusLabels = {
  online: 'متصل',
  offline: 'غير متصل',
  idle: 'خامل',
  error: 'خطأ',
};

const StatusIndicator = ({ 
  status, 
  label, 
  className,
  size = 'md' 
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn(
        "rounded-full animate-pulse-soft", 
        statusColors[status],
        sizeClasses[size]
      )} />
      {label || (status && statusLabels[status]) ? (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {label || statusLabels[status]}
        </span>
      ) : null}
    </div>
  );
};

export default StatusIndicator;
