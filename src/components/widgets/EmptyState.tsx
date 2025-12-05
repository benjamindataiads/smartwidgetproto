'use client';

import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center mb-6">
        <Layers className="w-10 h-10 text-brand-500" />
      </div>
      
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        No widgets yet
      </h2>
      <p className="text-slate-500 text-center max-w-md mb-8">
        Start by browsing our template library to create your first personalization widget.
        Choose from recommendation sliders, product boosters, and more.
      </p>
      
      <Link href="/library">
        <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
          Browse Library
        </Button>
      </Link>
      
      {/* Decorative elements */}
      <div className="mt-12 flex gap-4">
        {['🎠', '🤖', '🎬'].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl"
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

