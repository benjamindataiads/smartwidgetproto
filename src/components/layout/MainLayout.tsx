'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '../ui/Toaster';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

