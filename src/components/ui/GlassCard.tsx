
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ children, className, hoverEffect = true }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-effect rounded-xl p-6 animate-blur-in",
        hoverEffect && "hover-card",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
