'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateCard } from './TemplateCard';
import type { WidgetTemplate } from '@/types';

interface TemplateCarouselProps {
  title: string;
  subtitle?: string;
  templates: WidgetTemplate[];
  onSelectTemplate: (template: WidgetTemplate) => void;
}

export function TemplateCarousel({
  title,
  subtitle,
  templates,
  onSelectTemplate,
}: TemplateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`
              w-9 h-9 rounded-full border flex items-center justify-center transition-all
              ${canScrollLeft
                ? 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`
              w-9 h-9 rounded-full border flex items-center justify-center transition-all
              ${canScrollRight
                ? 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
              }
            `}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-[280px]"
          >
            <TemplateCard
              template={template}
              onClick={() => onSelectTemplate(template)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

