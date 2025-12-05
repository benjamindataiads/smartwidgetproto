'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Edit3,
  Target,
  Layout,
  Eye,
  Code,
  Play,
  Pause,
  Square,
  ArrowLeft,
  MoreHorizontal,
  Copy,
  Trash2,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/store';
import { WidgetStatusBadge } from '@/components/widgets/WidgetStatusBadge';
import type { WidgetStatus } from '@/types';

// Import tab content components
import { EditorTabContent } from '@/components/widget-tabs/EditorTabContent';
import { TargetingTabContent } from '@/components/widget-tabs/TargetingTabContent';
import { DisplayTabContent } from '@/components/widget-tabs/DisplayTabContent';
import { PreviewTabContent } from '@/components/widget-tabs/PreviewTabContent';
import { InstallationTabContent } from '@/components/widget-tabs/InstallationTabContent';

type TabId = 'edit' | 'targeting' | 'display' | 'preview' | 'installation';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'edit', label: 'Edit', icon: <Edit3 className="w-4 h-4" /> },
  { id: 'targeting', label: 'Targeting', icon: <Target className="w-4 h-4" /> },
  { id: 'display', label: 'Display', icon: <Layout className="w-4 h-4" /> },
  { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
  { id: 'installation', label: 'Installation', icon: <Code className="w-4 h-4" /> },
];

export default function WidgetMasterPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { currentWidget, setCurrentWidget, widgets, updateWidget, deleteWidget, addWidget, addToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<TabId>('edit');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    // Get tab from URL if present
    const tabParam = searchParams.get('tab') as TabId | null;
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let widget = currentWidget;
    
    if (!widget || widget.id !== params.id) {
      widget = widgets.find(w => w.id === params.id) || null;
      if (widget) {
        setCurrentWidget(widget);
      }
    }
    
    if (!widget) {
      router.push('/my-widgets');
    }
  }, [params.id, currentWidget, widgets, setCurrentWidget, router]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url.toString());
  };

  const handleStatusChange = (status: WidgetStatus) => {
    if (currentWidget) {
      updateWidget(currentWidget.id, { status });
      setShowStatusMenu(false);
      addToast({
        type: status === 'active' ? 'success' : 'info',
        message: `Widget ${status === 'active' ? 'started' : status === 'paused' ? 'paused' : 'stopped'}`,
      });
    }
  };

  const handleDuplicate = () => {
    if (currentWidget) {
      const newWidget = {
        ...currentWidget,
        id: `w-${Date.now()}`,
        name: `${currentWidget.name} (Copy)`,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addWidget(newWidget);
      addToast({ type: 'success', message: 'Widget duplicated' });
      router.push(`/widget/${newWidget.id}`);
    }
  };

  const handleDelete = () => {
    if (currentWidget) {
      deleteWidget(currentWidget.id);
      addToast({ type: 'success', message: 'Widget deleted' });
      router.push('/my-widgets');
    }
  };

  if (!currentWidget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'recommendation-slider': '🎠',
      'category-pusher': '🎯',
      'ai-similar': '🤖',
      'product-booster': '💬',
      'video-widget': '🎬',
      'custom': '✨',
    };
    return emojis[category] || '📦';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/my-widgets')}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">
                  {getCategoryEmoji(currentWidget.category)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">{currentWidget.name}</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <WidgetStatusBadge status={currentWidget.status} />
                    <span className="text-sm text-slate-500">
                      Updated {new Date(currentWidget.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {/* Status buttons */}
              {currentWidget.status !== 'active' && (
                <Button
                  variant="success"
                  size="sm"
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => handleStatusChange('active')}
                >
                  Start
                </Button>
              )}
              {currentWidget.status === 'active' && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Pause className="w-4 h-4" />}
                  onClick={() => handleStatusChange('paused')}
                >
                  Pause
                </Button>
              )}
              {currentWidget.status !== 'stopped' && currentWidget.status !== 'draft' && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Square className="w-4 h-4" />}
                  onClick={() => handleStatusChange('stopped')}
                >
                  Stop
                </Button>
              )}
              
              <div className="h-6 w-px bg-slate-200 mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Copy className="w-4 h-4" />}
                onClick={handleDuplicate}
              >
                Duplicate
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-3 text-sm font-medium
                  transition-colors border-b-2 -mb-px
                  ${activeTab === tab.id
                    ? 'text-brand-600 border-brand-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === 'edit' && <EditorTabContent widget={currentWidget} />}
          {activeTab === 'targeting' && <TargetingTabContent widget={currentWidget} />}
          {activeTab === 'display' && <DisplayTabContent widget={currentWidget} />}
          {activeTab === 'preview' && <PreviewTabContent widget={currentWidget} />}
          {activeTab === 'installation' && <InstallationTabContent widget={currentWidget} />}
        </motion.div>
      </div>
    </div>
  );
}

