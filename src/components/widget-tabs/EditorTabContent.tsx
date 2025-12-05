'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Save, RotateCcw } from 'lucide-react';
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

interface EditorTabContentProps {
  widget: Widget;
}

export function EditorTabContent({ widget }: EditorTabContentProps) {
  const { updateWidget, addToast } = useApp();
  
  const [config, setConfig] = useState<WidgetConfig>(widget.config);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (updates: Partial<WidgetConfig>) => {
    setConfig({ ...config, ...updates });
    setHasChanges(true);
  };

  const handleReset = () => {
    if (widget.templateId) {
      const template = getTemplateById(widget.templateId);
      if (template) {
        setConfig(template.defaultConfig);
        setHasChanges(true);
        addToast({ type: 'info', message: 'Widget reset to template defaults' });
      }
    }
  };

  const handleSave = (name: string) => {
    updateWidget(widget.id, { name, config });
    setShowSaveModal(false);
    setHasChanges(false);
    addToast({ type: 'success', message: 'Widget saved successfully!' });
  };

  const handleQuickSave = () => {
    updateWidget(widget.id, { config });
    setHasChanges(false);
    addToast({ type: 'success', message: 'Changes saved!' });
  };

  return (
    <div className="h-full flex">
      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 p-8 overflow-y-auto">
        {/* Viewport Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={handleReset}
              disabled={!widget.templateId}
            >
              Reset
            </Button>
            {hasChanges && (
              <Button
                size="sm"
                leftIcon={<Save className="w-4 h-4" />}
                onClick={handleQuickSave}
              >
                Save Changes
              </Button>
            )}
          </div>
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
      
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        initialName={widget.name}
      />
    </div>
  );
}

