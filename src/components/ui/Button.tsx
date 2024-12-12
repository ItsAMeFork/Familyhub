import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  className?: string;
}

export function Button({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'button';
  const variantClasses = variant === 'primary' ? 'button-primary' : '';
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}