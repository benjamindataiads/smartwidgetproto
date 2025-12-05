'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { WidgetTemplate } from '@/types';

interface TemplateCardProps {
  template: WidgetTemplate;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
        {/* Preview Area */}
        <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">{template.thumbnail}</div>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 text-white text-sm font-medium"
            >
              Use this template
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-brand-600 transition-colors">
            {template.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

