'use client';

import { AppProvider } from '@/components/providers/AppProvider';
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <MainLayout>{children}</MainLayout>
    </AppProvider>
  );
}

