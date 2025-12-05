'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within Tabs');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={clsx(
        'inline-flex p-1 bg-slate-100 rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function TabsTrigger({ value, children, icon }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={clsx(
        'relative px-4 py-2 text-sm font-medium rounded-lg',
        'transition-colors duration-200',
        'flex items-center gap-2',
        isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-lg shadow-sm"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

