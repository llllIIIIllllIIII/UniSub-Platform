'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 頁面進入動畫
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`page-transition ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// 路由切換動畫組件
export function RouteTransition({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    };

    // 監聽路由變化
    window.addEventListener('beforeunload', handleRouteChangeStart);
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChangeStart);
    };
  }, []);

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning 
          ? 'opacity-50 scale-95 blur-sm' 
          : 'opacity-100 scale-100 blur-none'
      }`}
    >
      {children}
    </div>
  );
}

// 淡入淡出動畫組件
export function FadeInOut({ 
  children, 
  isVisible, 
  duration = 300 
}: { 
  children: ReactNode; 
  isVisible: boolean; 
  duration?: number;
}) {
  return (
    <div 
      className={`transition-all duration-${duration} ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}

// 滑動動畫組件
export function SlideIn({ 
  children, 
  direction = 'up',
  delay = 0 
}: { 
  children: ReactNode; 
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransformClasses = () => {
    switch (direction) {
      case 'up':
        return isVisible ? 'translate-y-0' : 'translate-y-8';
      case 'down':
        return isVisible ? 'translate-y-0' : '-translate-y-8';
      case 'left':
        return isVisible ? 'translate-x-0' : 'translate-x-8';
      case 'right':
        return isVisible ? 'translate-x-0' : '-translate-x-8';
      default:
        return isVisible ? 'translate-y-0' : 'translate-y-8';
    }
  };

  return (
    <div 
      className={`transition-all duration-700 ease-out ${getTransformClasses()} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
} 