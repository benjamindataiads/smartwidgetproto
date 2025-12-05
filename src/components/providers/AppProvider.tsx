'use client';

import { useState, useCallback, ReactNode } from 'react';
import { AppContext, INITIAL_WIDGETS } from '@/store';
import type { Widget, ScrapedTheme, Toast } from '@/types';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
  const [scrapedTheme, setScrapedThemeState] = useState<ScrapedTheme | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentWidget, setCurrentWidget] = useState<Widget | null>(null);

  const addWidget = useCallback((widget: Widget) => {
    setWidgets(prev => [...prev, widget]);
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
    setWidgets(prev => 
      prev.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w)
    );
  }, []);

  const deleteWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const setScrapedTheme = useCallback((theme: ScrapedTheme | null) => {
    setScrapedThemeState(theme);
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    
    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        widgets,
        scrapedTheme,
        toasts,
        currentWidget,
        addWidget,
        updateWidget,
        deleteWidget,
        setCurrentWidget,
        setScrapedTheme,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

