'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { StyleScraper } from '@/components/library/StyleScraper';
import { TemplateCarousel } from '@/components/library/TemplateCarousel';
import { getTemplatesByCategory, useApp } from '@/store';
import type { WidgetTemplate, WidgetCategory } from '@/types';
import { CATEGORY_LABELS } from '@/types';

const categoryOrder: WidgetCategory[] = [
  'recommendation-slider',
  'category-pusher',
  'ai-similar',
  'product-booster',
  'video-widget',
];

const categoryIcons: Record<WidgetCategory, string> = {
  'recommendation-slider': '🎠',
  'category-pusher': '🎯',
  'ai-similar': '🤖',
  'product-booster': '💬',
  'video-widget': '🎬',
  'custom': '✨',
};

export default function LibraryPage() {
  const router = useRouter();
  const { setCurrentWidget } = useApp();

  const handleSelectTemplate = (template: WidgetTemplate) => {
    const newWidget = {
      id: `new-${Date.now()}`,
      name: `New ${template.name}`,
      category: template.category,
      status: 'draft' as const,
      templateId: template.id,
      config: { ...template.defaultConfig },
      targeting: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentWidget(newWidget);
    router.push(`/editor/${newWidget.id}`);
  };

  const handleCreateFromScratch = () => {
    const newWidget = {
      id: `new-${Date.now()}`,
      name: 'Custom Widget',
      category: 'custom' as const,
      status: 'draft' as const,
      templateId: '',
      config: {
        title: 'My Widget',
        itemsToShow: 4,
        autoplay: false,
        autoplaySpeed: 5000,
        showArrows: true,
        showDots: true,
        cardStyle: 'detailed' as const,
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        accentColor: '#5a78f2',
        borderRadius: 12,
        padding: 24,
      },
      targeting: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentWidget(newWidget);
    router.push(`/editor/${newWidget.id}`);
  };

  return (
    <div className="min-h-screen">
      <TopBar
        title="Widgets Library"
        subtitle="Choose a template to get started or create from scratch"
        actions={
          <Button
            variant="secondary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreateFromScratch}
          >
            Create from Scratch
          </Button>
        }
      />
      
      <div className="p-8 space-y-10">
        {/* Style Scraper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StyleScraper />
        </motion.div>
        
        {/* Template Carousels */}
        {categoryOrder.map((category, index) => {
          const templates = getTemplatesByCategory(category);
          if (templates.length === 0) {
            return null;
          }
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.1 }}
            >
              <TemplateCarousel
                title={`${categoryIcons[category]} ${CATEGORY_LABELS[category]}`}
                templates={templates}
                onSelectTemplate={handleSelectTemplate}
              />
            </motion.div>
          );
        })}
        
        {/* Create from Scratch CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center py-12"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Need something custom?
            </h3>
            <p className="text-sm text-slate-500 mb-4 max-w-sm">
              Start with a blank canvas and build your perfect widget from scratch.
            </p>
            <Button
              variant="secondary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleCreateFromScratch}
            >
              Create from Scratch
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

