'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WidgetPreview } from '@/components/editor/WidgetPreview';
import { useApp } from '@/store';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportConfig: Record<ViewportSize, { width: string; height: string; label: string }> = {
  desktop: { width: '100%', height: '100%', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet' },
  mobile: { width: '375px', height: '812px', label: 'Mobile' },
};

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { currentWidget, setCurrentWidget, widgets, addToast } = useApp();
  
  const [url, setUrl] = useState('https://example-store.com/product/leather-jacket');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let widget = currentWidget;
    
    if (!widget || widget.id !== params.id) {
      widget = widgets.find(w => w.id === params.id) || null;
      if (widget) {
        setCurrentWidget(widget);
      }
    }
  }, [params.id, currentWidget, widgets, setCurrentWidget]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        title="Widget Preview"
        breadcrumbs={[
          { label: 'My Widgets', href: '/my-widgets' },
          { label: currentWidget.name },
          { label: 'Preview' },
        ]}
        actions={
          <div className="flex items-center gap-3">
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
              leftIcon={<Maximize2 className="w-4 h-4" />}
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            <Button variant="secondary" onClick={() => router.push('/my-widgets')}>
              Close
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center gap-6">
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
          
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            Open in New Tab
          </Button>
        </div>
        
        <div className="flex-1 bg-slate-100 p-6 overflow-hidden flex items-start justify-center">
          <motion.div
            layout
            className={`
              transition-all duration-300
              ${isFullscreen ? 'fixed inset-0 z-50 p-0' : ''}
            `}
            style={{
              width: isFullscreen ? '100%' : viewportConfig[viewport].width,
              maxWidth: isFullscreen ? '100%' : viewportConfig[viewport].width,
            }}
          >
            <div className={`
              bg-white shadow-xl overflow-hidden flex flex-col
              ${isFullscreen ? 'h-screen' : 'rounded-2xl h-[calc(100vh-200px)]'}
            `}>
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
                    <div className="h-14 bg-slate-800 rounded-lg mb-6 flex items-center justify-between px-4">
                      <div className="w-24 h-6 bg-slate-600 rounded" />
                      <div className="flex gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-16 h-4 bg-slate-600 rounded" />
                        ))}
                      </div>
                    </div>
                    
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
                        <span className="text-xs text-slate-400">
                          {currentWidget.displayPosition?.selector || '.product-description'} → {currentWidget.displayPosition?.position || 'after'}
                        </span>
                      </div>
                      <WidgetPreview config={currentWidget.config} />
                    </motion.div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="h-6 bg-slate-200 rounded w-48 mb-3" />
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-100 rounded w-full" />
                          <div className="h-4 bg-slate-100 rounded w-full" />
                          <div className="h-4 bg-slate-100 rounded w-3/4" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="aspect-square bg-slate-100 rounded-xl" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-32 bg-slate-800 rounded-lg mt-12" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

