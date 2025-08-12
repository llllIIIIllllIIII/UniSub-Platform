'use client';

import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  showProgress = false, 
  progress = 0,
  className = '' 
}: LoadingSpinnerProps) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (showProgress && progress > currentProgress) {
      const timer = setTimeout(() => {
        setCurrentProgress(prev => Math.min(prev + 1, progress));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentProgress, progress, showProgress]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* 主加載動畫 */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-brand-light-blue/20 dark:border-dark-surface/50 rounded-full animate-spin-slow`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-brand-purple dark:border-t-brand-light-blue rounded-full animate-spin-slow" />
        </div>
        
        {/* 內部光暈效果 */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 rounded-full animate-pulse-slow`} />
      </div>

      {/* 文字 */}
      {text && (
        <p className={`text-brand-dark dark:text-dark-text font-medium ${textSizes[size]} animate-pulse-slow`}>
          {text}
        </p>
      )}

      {/* 進度條 */}
      {showProgress && (
        <div className="w-48 bg-gray-200 dark:bg-dark-surface rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-purple to-brand-blue transition-all duration-300 ease-out rounded-full"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      )}

      {/* 進度百分比 */}
      {showProgress && (
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary font-medium">
          {currentProgress}%
        </p>
      )}
    </div>
  );
}

// 全屏加載組件
export function FullScreenLoader({ text = 'Loading Unisub...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text={text} showProgress={true} progress={100} />
        
        {/* 背景裝飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-brand-light-blue/10 to-brand-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </div>
  );
}

// 按鈕加載狀態
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} text="" />
      <span className="text-sm">Processing...</span>
    </div>
  );
} 