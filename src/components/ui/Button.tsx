'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-brand-600 to-brand-500 text-white
    hover:from-brand-700 hover:to-brand-600
    shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30
    active:shadow-sm
  `,
  secondary: `
    bg-white text-slate-700 border border-slate-200
    hover:bg-slate-50 hover:border-slate-300
    shadow-sm hover:shadow
  `,
  ghost: `
    bg-transparent text-slate-600
    hover:bg-slate-100 hover:text-slate-900
  `,
  danger: `
    bg-red-500 text-white
    hover:bg-red-600
    shadow-md shadow-red-500/25
  `,
  success: `
    bg-emerald-500 text-white
    hover:bg-emerald-600
    shadow-md shadow-emerald-500/25
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

