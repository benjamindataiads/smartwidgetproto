'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Type,
  Sparkles,
  Save,
  RotateCcw,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/store';
import type { ScrapedTheme } from '@/types';

export default function StylePage() {
  const { scrapedTheme, setScrapedTheme, addToast } = useApp();
  
  const [theme, setTheme] = useState<ScrapedTheme>(scrapedTheme || {
    primaryColor: '#5a78f2',
    secondaryColor: '#a855f7',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    headingFont: 'Poppins',
    bodyFont: 'Inter',
    logoUrl: '',
    h1Size: '2.5rem',
    h2Size: '2rem',
    borderRadius: '12px',
  });

  const handleSave = () => {
    setScrapedTheme(theme);
    addToast({ type: 'success', message: 'Global style saved!' });
  };

  const handleReset = () => {
    setTheme({
      primaryColor: '#5a78f2',
      secondaryColor: '#a855f7',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      logoUrl: '',
      h1Size: '2.5rem',
      h2Size: '2rem',
      borderRadius: '12px',
    });
    addToast({ type: 'info', message: 'Style reset to defaults' });
  };

  const fontOptions = [
    'Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Source Sans Pro', 'Raleway', 'Playfair Display', 'Merriweather',
  ];

  return (
    <div className="min-h-screen">
      <TopBar
        title="Global Style"
        subtitle="Define your brand's visual identity for all widgets"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={handleReset}>
              Reset
            </Button>
            <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
              Save Style
            </Button>
          </div>
        }
      />
      
      <div className="p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Brand Colors</h3>
                    <p className="text-sm text-slate-500">Your primary brand colors for widgets</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'primaryColor', label: 'Primary Color' },
                    { key: 'secondaryColor', label: 'Secondary Color' },
                    { key: 'accentColor', label: 'Accent Color' },
                    { key: 'textColor', label: 'Text Color' },
                  ].map((color) => (
                    <div key={color.key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {color.label}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={theme[color.key as keyof ScrapedTheme] as string}
                          onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                          className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <Input
                          value={theme[color.key as keyof ScrapedTheme] as string}
                          onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Type className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Typography</h3>
                    <p className="text-sm text-slate-500">Font families and sizes</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Heading Font
                    </label>
                    <select
                      value={theme.headingFont}
                      onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Body Font
                    </label>
                    <select
                      value={theme.bodyFont}
                      onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="H1 Size"
                    value={theme.h1Size}
                    onChange={(e) => setTheme({ ...theme, h1Size: e.target.value })}
                    placeholder="2.5rem"
                  />
                  <Input
                    label="H2 Size"
                    value={theme.h2Size}
                    onChange={(e) => setTheme({ ...theme, h2Size: e.target.value })}
                    placeholder="2rem"
                  />
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Effects</h3>
                    <p className="text-sm text-slate-500">Border radius and visual effects</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Border Radius"
                    value={theme.borderRadius}
                    onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                    placeholder="12px"
                    hint="Applied to cards and buttons"
                  />
                  <Input
                    label="Logo URL"
                    value={theme.logoUrl || ''}
                    onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </Card>
            </motion.div>
          </div>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">Preview</h3>
                
                <div className="flex gap-2 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl shadow-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl shadow-sm"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl shadow-sm"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
                
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    borderRadius: theme.borderRadius,
                    border: `1px solid ${theme.textColor}15`,
                  }}
                >
                  <h4
                    className="font-bold mb-1"
                    style={{
                      color: theme.textColor,
                      fontFamily: theme.headingFont,
                      fontSize: '1.25rem',
                    }}
                  >
                    Trending Products
                  </h4>
                  <p
                    className="text-sm mb-4"
                    style={{
                      color: `${theme.textColor}99`,
                      fontFamily: theme.bodyFont,
                    }}
                  >
                    Check out what's popular
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg overflow-hidden"
                        style={{ borderRadius: `calc(${theme.borderRadius} * 0.6)` }}
                      >
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl">
                          {i === 1 ? '👟' : '👕'}
                        </div>
                        <div className="p-2" style={{ backgroundColor: theme.backgroundColor }}>
                          <div className="text-xs font-medium truncate" style={{ color: theme.textColor }}>
                            Product {i}
                          </div>
                          <div className="text-sm font-bold" style={{ color: theme.accentColor }}>
                            $99.00
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className="w-full mt-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: theme.primaryColor,
                      borderRadius: theme.borderRadius,
                    }}
                  >
                    View All
                  </button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

