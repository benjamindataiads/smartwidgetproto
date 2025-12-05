'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Type,
  Palette,
  Layout,
  Settings,
  Image,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { WidgetConfig } from '@/types';

interface EditorPanelProps {
  config: WidgetConfig;
  onChange: (updates: Partial<WidgetConfig>) => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          {icon}
        </div>
        <span className="font-medium text-slate-900 text-sm flex-1 text-left">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 space-y-4">{children}</div>
      </motion.div>
    </div>
  );
}

export function EditorPanel({ config, onChange }: EditorPanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Content Section */}
      <CollapsibleSection title="Content" icon={<Type className="w-4 h-4" />}>
        <Input
          label="Title"
          value={config.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Widget title"
        />
        <Input
          label="Subtitle"
          value={config.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Optional subtitle"
        />
      </CollapsibleSection>

      {/* Layout Section */}
      <CollapsibleSection title="Layout" icon={<Layout className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Items to Show"
            type="number"
            min={1}
            max={6}
            value={config.itemsToShow}
            onChange={(e) => onChange({ itemsToShow: parseInt(e.target.value) || 4 })}
          />
          <Input
            label="Padding (px)"
            type="number"
            min={0}
            max={64}
            value={config.padding}
            onChange={(e) => onChange({ padding: parseInt(e.target.value) || 24 })}
          />
        </div>
        <Input
          label="Border Radius (px)"
          type="number"
          min={0}
          max={48}
          value={config.borderRadius}
          onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) || 12 })}
        />
        <Select
          label="Card Style"
          value={config.cardStyle}
          onChange={(e) => onChange({ cardStyle: e.target.value as 'minimal' | 'detailed' | 'overlay' })}
          options={[
            { value: 'minimal', label: 'Minimal' },
            { value: 'detailed', label: 'Detailed' },
            { value: 'overlay', label: 'Overlay' },
          ]}
        />
      </CollapsibleSection>

      {/* Colors Section */}
      <CollapsibleSection title="Colors" icon={<Palette className="w-4 h-4" />}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Background Color
            </label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                style={{ backgroundColor: config.backgroundColor }}
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Text Color
            </label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                style={{ backgroundColor: config.textColor }}
              />
              <Input
                value={config.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Accent Color
            </label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                style={{ backgroundColor: config.accentColor }}
              />
              <Input
                value={config.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        {/* Color presets */}
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 mb-2">Quick Presets</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { bg: '#ffffff', text: '#0f172a', accent: '#5a78f2' },
              { bg: '#0f172a', text: '#ffffff', accent: '#10b981' },
              { bg: '#fef3c7', text: '#78350f', accent: '#d97706' },
              { bg: '#fdf4ff', text: '#701a75', accent: '#d946ef' },
              { bg: '#ecfdf5', text: '#065f46', accent: '#10b981' },
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() =>
                  onChange({
                    backgroundColor: preset.bg,
                    textColor: preset.text,
                    accentColor: preset.accent,
                  })
                }
                className="w-8 h-8 rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-colors overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${preset.bg} 50%, ${preset.accent} 50%)`,
                }}
              />
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Behavior Section */}
      <CollapsibleSection title="Behavior" icon={<Sliders className="w-4 h-4" />}>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoplay}
              onChange={(e) => onChange({ autoplay: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-slate-700">Enable Autoplay</span>
          </label>
          
          {config.autoplay && (
            <Input
              label="Autoplay Speed (ms)"
              type="number"
              min={1000}
              max={10000}
              step={500}
              value={config.autoplaySpeed}
              onChange={(e) => onChange({ autoplaySpeed: parseInt(e.target.value) || 5000 })}
            />
          )}
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showArrows}
              onChange={(e) => onChange({ showArrows: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-slate-700">Show Navigation Arrows</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showDots}
              onChange={(e) => onChange({ showDots: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-slate-700">Show Dot Indicators</span>
          </label>
        </div>
      </CollapsibleSection>

      {/* Advanced Section */}
      <CollapsibleSection
        title="Advanced"
        icon={<Settings className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Custom CSS
            </label>
            <textarea
              value={config.customCSS || ''}
              onChange={(e) => onChange({ customCSS: e.target.value })}
              placeholder=".widget-container { /* your styles */ }"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono text-xs"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

