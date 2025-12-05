'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  Globe,
  MousePointer,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/store';
import type { DisplayPosition } from '@/types';

type Position = DisplayPosition['position'];

const positionOptions: { value: Position; label: string; icon: React.ReactNode }[] = [
  { value: 'before', label: 'Before element', icon: <ArrowUp className="w-4 h-4" /> },
  { value: 'after', label: 'After element', icon: <ArrowDown className="w-4 h-4" /> },
  { value: 'inside-start', label: 'Inside (start)', icon: <ChevronUp className="w-4 h-4" /> },
  { value: 'inside-end', label: 'Inside (end)', icon: <ChevronDown className="w-4 h-4" /> },
  { value: 'replace', label: 'Replace element', icon: <RefreshCw className="w-4 h-4" /> },
];

export default function DisplayPage() {
  const router = useRouter();
  const params = useParams();
  const { currentWidget, setCurrentWidget, widgets, updateWidget, addToast } = useApp();
  
  const [url, setUrl] = useState('https://example-store.com/product/leather-jacket');
  const [selector, setSelector] = useState('');
  const [position, setPosition] = useState<Position>('after');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let widget = currentWidget;
    
    if (!widget || widget.id !== params.id) {
      widget = widgets.find(w => w.id === params.id) || null;
      if (widget) {
        setCurrentWidget(widget);
      }
    }
    
    if (widget?.displayPosition) {
      setSelector(widget.displayPosition.selector);
      setPosition(widget.displayPosition.position);
    }
  }, [params.id, currentWidget, widgets, setCurrentWidget]);

  const handleLoadPage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({ type: 'success', message: 'Page loaded successfully' });
    }, 1500);
  };

  const handleElementSelect = (elementSelector: string) => {
    setSelector(elementSelector);
    setHasChanges(true);
    addToast({ type: 'info', message: `Selected: ${elementSelector}` });
  };

  const handleSave = () => {
    if (!currentWidget) {
      return;
    }

    updateWidget(currentWidget.id, {
      displayPosition: { selector, position },
    });
    setHasChanges(false);
    addToast({ type: 'success', message: 'Display settings saved!' });
    router.push('/my-widgets');
  };

  const mockElements = [
    { selector: '.product-hero', label: 'Product Hero Section' },
    { selector: '.product-description', label: 'Product Description' },
    { selector: '.product-reviews', label: 'Reviews Section' },
    { selector: '.related-products', label: 'Related Products' },
    { selector: '#add-to-cart', label: 'Add to Cart Button' },
    { selector: '.product-gallery', label: 'Image Gallery' },
  ];

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
    <div className="min-h-screen">
      <TopBar
        title="Display in Page"
        breadcrumbs={[
          { label: 'My Widgets', href: '/my-widgets' },
          { label: currentWidget.name, href: `/editor/${currentWidget.id}` },
          { label: 'Display' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              disabled={!selector || !hasChanges}
            >
              Save Settings
            </Button>
          </div>
        }
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel */}
        <div className="w-[400px] border-r border-slate-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            <Card className="bg-gradient-to-br from-brand-50 to-purple-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MousePointer className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    Choose where to display
                  </h3>
                  <p className="text-xs text-slate-600">
                    Enter your page URL, then click on the preview to select an element
                    where your widget will appear.
                  </p>
                </div>
              </div>
            </Card>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Page URL
              </label>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-store.com/page"
                  leftIcon={<Globe className="w-4 h-4" />}
                />
                <Button
                  variant="secondary"
                  onClick={handleLoadPage}
                  loading={isLoading}
                >
                  Load
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                CSS Selector
              </label>
              <Input
                value={selector}
                onChange={(e) => {
                  setSelector(e.target.value);
                  setHasChanges(true);
                }}
                placeholder=".product-description"
                hint="Click an element in the preview or enter a CSS selector manually"
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Position
              </label>
              <div className="grid grid-cols-1 gap-2">
                {positionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setPosition(opt.value);
                      setHasChanges(true);
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                      ${position === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${position === opt.value ? 'bg-brand-100' : 'bg-slate-100'}
                    `}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700">
                Quick Select Elements
              </label>
              <div className="space-y-2">
                {mockElements.map((el) => (
                  <button
                    key={el.selector}
                    onClick={() => handleElementSelect(el.selector)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all
                      ${selector === el.selector
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span className="text-sm text-slate-700">{el.label}</span>
                    <code className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {el.selector}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Preview */}
        <div className="flex-1 bg-slate-100 p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="h-7 bg-white rounded-md border border-slate-200 flex items-center px-3 text-sm text-slate-500">
                  {url}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-slate-500">Loading page preview...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-12 bg-slate-800 rounded-lg" />
                  
                  <div
                    className={`
                      h-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl p-4
                      ${selector === '.product-hero' ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
                      cursor-pointer hover:ring-2 hover:ring-brand-300 hover:ring-offset-2 transition-all
                    `}
                    onClick={() => handleElementSelect('.product-hero')}
                  >
                    <div className="text-xs text-slate-500">.product-hero</div>
                  </div>
                  
                  {selector === '.product-hero' && position === 'after' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-brand-50 border-2 border-dashed border-brand-300 rounded-xl p-4"
                    >
                      <p className="text-sm text-brand-600 font-medium text-center">
                        ✨ Your widget will appear here
                      </p>
                    </motion.div>
                  )}
                  
                  <div
                    className={`
                      bg-slate-100 rounded-xl p-4 space-y-2
                      ${selector === '.product-description' ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
                      cursor-pointer hover:ring-2 hover:ring-brand-300 hover:ring-offset-2 transition-all
                    `}
                    onClick={() => handleElementSelect('.product-description')}
                  >
                    <div className="text-xs text-slate-500">.product-description</div>
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                  </div>
                  
                  {selector === '.product-description' && position === 'after' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-brand-50 border-2 border-dashed border-brand-300 rounded-xl p-4"
                    >
                      <p className="text-sm text-brand-600 font-medium text-center">
                        ✨ Your widget will appear here
                      </p>
                    </motion.div>
                  )}
                  
                  <div
                    className={`
                      bg-slate-100 rounded-xl p-4
                      ${selector === '.product-reviews' ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
                      cursor-pointer hover:ring-2 hover:ring-brand-300 hover:ring-offset-2 transition-all
                    `}
                    onClick={() => handleElementSelect('.product-reviews')}
                  >
                    <div className="text-xs text-slate-500 mb-2">.product-reviews</div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-5 h-5 bg-yellow-300 rounded" />
                      ))}
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  
                  <div className="h-20 bg-slate-800 rounded-lg mt-8" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

