
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  show?: boolean;
  animation?: 'fade' | 'scale' | 'slide';
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  show = true,
  animation = 'fade'
}) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
    if (!show) {
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!render) return null;

  const animationClass = {
    fade: show ? 'animate-fade-in' : 'animate-fade-out',
    scale: show ? 'animate-scale-in' : 'animate-fade-out',
    slide: show ? 'animate-slide-in' : 'animate-fade-out',
  }[animation];

  return (
    <div className={cn(animationClass, className)}>
      {children}
    </div>
  );
};

export default AnimatedTransition;
