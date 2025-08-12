'use client';

import { ReactNode, useState } from 'react';
import { ButtonLoader } from './LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingText?: string;
}

export function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button',
  loading = false,
  loadingText = 'Loading...'
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (loading || isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      if (onClick) {
        await onClick();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading || isLoading}
      className={`btn-primary ${disabled || loading || isLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} ${className}`}
    >
      {(loading || isLoading) ? (
        <ButtonLoader size="sm" />
      ) : (
        children
      )}
    </button>
  );
}

export function SecondaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button',
  loading = false,
  loadingText = 'Loading...'
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (loading || isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      if (onClick) {
        await onClick();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading || isLoading}
      className={`btn-secondary ${disabled || loading || isLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} ${className}`}
    >
      {(loading || isLoading) ? (
        <ButtonLoader size="sm" />
      ) : (
        children
      )}
    </button>
  );
}

interface LinkButtonProps extends ButtonProps {
  href: string;
  external?: boolean;
}

export function LinkButton({ 
  children, 
  href, 
  external = false, 
  className = '',
  loading = false
}: LinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (loading || isLoading) return;
    
    setIsLoading(true);
    try {
      if (external) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || isLoading}
      className={`btn-primary ${loading || isLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} ${className}`}
    >
      {(loading || isLoading) ? (
        <ButtonLoader size="sm" />
      ) : (
        children
      )}
    </button>
  );
}

// 新的玻璃效果按鈕
export function GlassButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button',
  loading = false
}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (loading || isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      if (onClick) {
        await onClick();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading || isLoading}
      className={`glass-effect text-brand-dark dark:text-dark-text hover:text-brand-purple dark:hover:text-brand-light-blue font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 transform ${disabled || loading || isLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} ${className}`}
    >
      {(loading || isLoading) ? (
        <ButtonLoader size="sm" />
      ) : (
        children
      )}
    </button>
  );
}