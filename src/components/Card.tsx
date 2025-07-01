import React from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false, 
  glass = false 
}) => {
  return (
    <div className={cn(
      'rounded-2xl transition-all duration-300',
      glass 
        ? 'bg-white/40 dark:bg-dark-800/40 backdrop-blur-xl border border-white/20 dark:border-dark-700/30' 
        : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700',
      hover && 'hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1',
      'shadow-lg',
      className
    )}>
      {children}
    </div>
  );
};