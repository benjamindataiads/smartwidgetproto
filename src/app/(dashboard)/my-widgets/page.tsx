'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WidgetTable } from '@/components/widgets/WidgetTable';
import { EmptyState } from '@/components/widgets/EmptyState';
import { useApp } from '@/store';

export default function MyWidgetsPage() {
  const { widgets } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredWidgets = widgets.filter((widget) =>
    widget.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasWidgets = widgets.length > 0;

  return (
    <div className="min-h-screen">
      <TopBar
        title="My Widgets"
        subtitle={hasWidgets ? `${widgets.length} widget${widgets.length !== 1 ? 's' : ''} created` : undefined}
        actions={
          <Link href="/library">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Widget
            </Button>
          </Link>
        }
      />
      
      <div className="p-8">
        {hasWidgets ? (
          <>
            {/* Filters Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
                  Filters
                </Button>
                
                <div className="h-6 w-px bg-slate-200" />
                
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-slate-900'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm text-slate-900'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Widget List */}
            {filteredWidgets.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <WidgetTable />
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No results found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search query or filters
                </p>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

