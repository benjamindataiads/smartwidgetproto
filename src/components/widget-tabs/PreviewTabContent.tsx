'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WidgetPreview } from '@/components/editor/WidgetPreview';
import { useApp } from '@/store';
import type { Widget } from '@/types';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportConfig: Record<ViewportSize, { width: string; label: string }> = {
  desktop: { width: '100%', label: 'Desktop' },
  tablet: { width: '768px', label: 'Tablet' },
  mobile: { width: '375px', label: 'Mobile' },
};

interface PreviewTabContentProps {
  widget: Widget;
}

export function PreviewTabContent({ widget }: PreviewTabContentProps) {
  const { addToast } = useApp();
  
  const [url, setUrl] = useState('https://example-store.com/product/leather-jacket');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoadPreview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({ type: 'success', message: 'Preview loaded' });
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Controls Bar */}
      <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center gap-6 flex-shrink-0">
        {/* URL Input */}
        <div className="flex-1 max-w-xl flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL..."
            leftIcon={<Globe className="w-4 h-4" />}
          />
          <Button variant="secondary" onClick={handleLoadPreview}>
            Load
          </Button>
        </div>
        
        {/* Viewport Selector */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {([
            { size: 'desktop' as const, icon: <Monitor className="w-4 h-4" /> },
            { size: 'tablet' as const, icon: <Tablet className="w-4 h-4" /> },
            { size: 'mobile' as const, icon: <Smartphone className="w-4 h-4" /> },
          ]).map(({ size, icon }) => (
            <button
              key={size}
              onClick={() => setViewport(size)}
              className={`
                p-2 rounded-md transition-all
                ${viewport === size
                  ? 'bg-white shadow-sm text-brand-600'
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}
              title={viewportConfig[size].label}
            >
              {icon}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefresh}
            loading={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            Open in New Tab
          </Button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 bg-slate-100 p-6 overflow-hidden flex items-start justify-center">
        <motion.div
          layout
          className="transition-all duration-300"
          style={{
            width: viewportConfig[viewport].width,
            maxWidth: viewportConfig[viewport].width,
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-220px)]">
            {/* Browser Chrome */}
            <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="h-6 bg-white rounded-md border border-slate-200 flex items-center px-3 text-xs text-slate-500">
                  {url}
                </div>
              </div>
            </div>
            
            {/* Page Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-sm text-slate-500">Loading preview...</p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* Mock Header */}
                  <div className="h-14 bg-slate-800 rounded-lg mb-6 flex items-center justify-between px-4">
                    <div className="w-24 h-6 bg-slate-600 rounded" />
                    <div className="flex gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-16 h-4 bg-slate-600 rounded" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Product Section */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-8xl">
                      🧥
                    </div>
                    
                    <div className="space-y-4">
                      <div className="h-8 bg-slate-200 rounded w-3/4" />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-5 h-5 bg-yellow-400 rounded" />
                        ))}
                        <span className="text-sm text-slate-500 ml-2">(128 reviews)</span>
                      </div>
                      <div className="h-10 bg-slate-800 rounded w-32 flex items-center justify-center text-white font-bold">
                        $299.00
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                        <div className="h-4 bg-slate-100 rounded w-5/6" />
                        <div className="h-4 bg-slate-100 rounded w-4/6" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <div className="h-12 bg-brand-500 rounded-xl flex-1 flex items-center justify-center text-white font-medium">
                          Add to Cart
                        </div>
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center">
                          ♡
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Widget Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
                        ✨ Your Widget
                      </span>
                    </div>
                    <WidgetPreview config={widget.config} />
                  </motion.div>
                  
                  {/* Mock Footer */}
                  <div className="h-32 bg-slate-800 rounded-lg mt-12" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

