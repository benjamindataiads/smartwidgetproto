'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { WidgetPreview } from '@/components/editor/WidgetPreview';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { SaveModal } from '@/components/editor/SaveModal';
import { useApp, getTemplateById } from '@/store';
import type { Widget, WidgetConfig } from '@/types';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportSizes: Record<ViewportSize, { width: string; icon: React.ReactNode }> = {
  desktop: { width: '100%', icon: <Monitor className="w-4 h-4" /> },
  tablet: { width: '768px', icon: <Tablet className="w-4 h-4" /> },
  mobile: { width: '375px', icon: <Smartphone className="w-4 h-4" /> },
};

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const { currentWidget, setCurrentWidget, addWidget, updateWidget, widgets, addToast } = useApp();
  
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (currentWidget && currentWidget.id === params.id) {
      setConfig(currentWidget.config);
      return;
    }
    
    const existingWidget = widgets.find(w => w.id === params.id);
    if (existingWidget) {
      setCurrentWidget(existingWidget);
      setConfig(existingWidget.config);
      return;
    }
    
    router.push('/library');
  }, [params.id, currentWidget, widgets, setCurrentWidget, router]);

  const handleConfigChange = (updates: Partial<WidgetConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
      setHasChanges(true);
    }
  };

  const handleReset = () => {
    if (currentWidget?.templateId) {
      const template = getTemplateById(currentWidget.templateId);
      if (template) {
        setConfig(template.defaultConfig);
        setHasChanges(true);
        addToast({ type: 'info', message: 'Widget reset to template defaults' });
      }
    }
  };

  const handleSave = (name: string) => {
    if (!currentWidget || !config) {
      return;
    }

    const updatedWidget: Widget = {
      ...currentWidget,
      name,
      config,
      updatedAt: new Date().toISOString(),
    };

    const isExisting = widgets.some(w => w.id === currentWidget.id);
    
    if (isExisting) {
      updateWidget(currentWidget.id, { name, config });
    } else {
      addWidget(updatedWidget);
    }

    setShowSaveModal(false);
    setHasChanges(false);
    addToast({ type: 'success', message: 'Widget saved successfully!' });
    router.push('/my-widgets');
  };

  if (!currentWidget || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title="Visual Editor"
        breadcrumbs={[
          { label: 'Library', href: '/library' },
          { label: currentWidget.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleReset}
              disabled={!currentWidget.templateId}
            >
              Reset
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}
              onClick={() => router.push(`/preview/${currentWidget.id}`)}
            >
              Preview
            </Button>
            <Button
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={() => setShowSaveModal(true)}
            >
              Save Widget
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto">
          {/* Viewport Selector */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {(Object.keys(viewportSizes) as ViewportSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setViewport(size)}
                className={`
                  p-2 rounded-lg transition-all
                  ${viewport === size
                    ? 'bg-white shadow-sm text-brand-600'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                  }
                `}
              >
                {viewportSizes[size].icon}
              </button>
            ))}
          </div>
          
          {/* Preview Container */}
          <motion.div
            layout
            className="mx-auto transition-all duration-300"
            style={{ maxWidth: viewportSizes[viewport].width }}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-white rounded-md border border-slate-200 flex items-center px-3 text-xs text-slate-400">
                    your-store.com
                  </div>
                </div>
              </div>
              
              {/* Page Content */}
              <div className="p-8 min-h-[400px] bg-gradient-to-b from-slate-50 to-white">
                <div className="h-8 bg-slate-100 rounded-lg mb-4 w-1/3" />
                <div className="h-4 bg-slate-100 rounded mb-2 w-2/3" />
                <div className="h-4 bg-slate-100 rounded mb-8 w-1/2" />
                
                <WidgetPreview config={config} />
                
                <div className="mt-8 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-4/6" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Editor Panel */}
        <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col">
          <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Widget Settings</h3>
            {hasChanges && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
          </div>
          <EditorPanel config={config} onChange={handleConfigChange} />
        </div>
      </div>
      
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        initialName={currentWidget.name}
      />
    </div>
  );
}

