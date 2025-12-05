'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Wand2, Loader2, Check, Palette, Type, Image } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/store';
import type { ScrapedTheme } from '@/types';

export function StyleScraper() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { scrapedTheme, setScrapedTheme, addToast } = useApp();

  const handleScrape = async () => {
    if (!url) {
      addToast({ type: 'error', message: 'Please enter a valid URL' });
      return;
    }

    setIsLoading(true);
    
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock scraped theme
    const mockTheme: ScrapedTheme = {
      primaryColor: '#2563eb',
      secondaryColor: '#7c3aed',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      logoUrl: 'https://via.placeholder.com/120x40',
      h1Size: '2.5rem',
      h2Size: '2rem',
      borderRadius: '12px',
    };
    
    setScrapedTheme(mockTheme);
    setIsLoading(false);
    setIsComplete(true);
    addToast({ type: 'success', message: 'Website style extracted successfully!' });
    
    // Reset complete state after animation
    setTimeout(() => setIsComplete(false), 2000);
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-50 via-purple-50 to-pink-50 opacity-50" />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25 flex-shrink-0">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Apply my website style automatically
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Enter your website URL and we'll extract your colors, fonts, and brand identity to style your widgets.
            </p>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="https://your-store.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>
              <Button
                onClick={handleScrape}
                loading={isLoading}
                disabled={isComplete}
                leftIcon={isComplete ? <Check className="w-4 h-4" /> : undefined}
              >
                {isComplete ? 'Applied!' : isLoading ? 'Scanning...' : 'Extract Style'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scraped Theme Preview */}
        <AnimatePresence>
          {scrapedTheme && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-200/60"
            >
              <p className="text-sm font-medium text-slate-700 mb-3">Extracted Style</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Colors */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: scrapedTheme.primaryColor }}
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: scrapedTheme.secondaryColor }}
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: scrapedTheme.accentColor }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">Colors</p>
                    <p className="text-xs text-slate-500">3 extracted</p>
                  </div>
                </div>
                
                {/* Fonts */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Type className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">{scrapedTheme.headingFont}</p>
                    <p className="text-xs text-slate-500">{scrapedTheme.bodyFont}</p>
                  </div>
                </div>
                
                {/* Border Radius */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">Rounded</p>
                    <p className="text-xs text-slate-500">{scrapedTheme.borderRadius}</p>
                  </div>
                </div>
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Image className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900">Logo</p>
                    <p className="text-xs text-slate-500">Detected</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

