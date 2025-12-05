'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface TopBarProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
}

export function TopBar({ title, subtitle, breadcrumbs, actions }: TopBarProps) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex flex-col">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <motion.span
                  key={crumb.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-1"
                >
                  {index > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-slate-500 hover:text-brand-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-900 font-medium">{crumb.label}</span>
                  )}
                </motion.span>
              ))}
            </nav>
          )}
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-slate-900"
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-slate-500"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </header>
  );
}

