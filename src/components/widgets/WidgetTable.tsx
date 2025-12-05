'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Edit3,
  Target,
  Layout,
  Code,
  Eye,
  Play,
  Pause,
  Square,
  MoreHorizontal,
  Trash2,
  Copy,
} from 'lucide-react';
import { WidgetStatusBadge } from './WidgetStatusBadge';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/store';
import type { Widget, WidgetStatus } from '@/types';
import { CATEGORY_LABELS } from '@/types';

interface ActionMenuProps {
  widget: Widget;
  onClose: () => void;
  onEdit: () => void;
  onTargeting: () => void;
  onDisplay: () => void;
  onInstall: () => void;
  onPreview: () => void;
  onStatusChange: (status: WidgetStatus) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function ActionMenu({
  widget,
  onClose,
  onEdit,
  onTargeting,
  onDisplay,
  onInstall,
  onPreview,
  onStatusChange,
  onDelete,
  onDuplicate,
}: ActionMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-10" onClick={onClose} />
      
      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 overflow-hidden"
      >
        <button
          onClick={onEdit}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Edit3 className="w-4 h-4 text-slate-400" />
          Edit Widget
        </button>
        <button
          onClick={onTargeting}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Target className="w-4 h-4 text-slate-400" />
          Targeting
        </button>
        <button
          onClick={onDisplay}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Layout className="w-4 h-4 text-slate-400" />
          Display in Page
        </button>
        <button
          onClick={onInstall}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Code className="w-4 h-4 text-slate-400" />
          Installation
        </button>
        <button
          onClick={onPreview}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Eye className="w-4 h-4 text-slate-400" />
          Preview
        </button>
        
        <div className="h-px bg-slate-100 my-1" />
        
        {widget.status !== 'active' && (
          <button
            onClick={() => onStatusChange('active')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Widget
          </button>
        )}
        {widget.status === 'active' && (
          <button
            onClick={() => onStatusChange('paused')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Pause className="w-4 h-4" />
            Pause Widget
          </button>
        )}
        {widget.status !== 'stopped' && widget.status !== 'draft' && (
          <button
            onClick={() => onStatusChange('stopped')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop Widget
          </button>
        )}
        
        <div className="h-px bg-slate-100 my-1" />
        
        <button
          onClick={onDuplicate}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Copy className="w-4 h-4 text-slate-400" />
          Duplicate
        </button>
        <button
          onClick={onDelete}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </motion.div>
    </>
  );
}

interface WidgetRowProps {
  widget: Widget;
  index: number;
}

function WidgetRow({ widget, index }: WidgetRowProps) {
  const router = useRouter();
  const { setCurrentWidget, updateWidget, deleteWidget, addWidget, addToast } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    setCurrentWidget(widget);
    router.push(`/editor/${widget.id}`);
  };

  const handleTargeting = () => {
    setCurrentWidget(widget);
    router.push(`/targeting/${widget.id}`);
  };

  const handleDisplay = () => {
    setCurrentWidget(widget);
    router.push(`/display/${widget.id}`);
  };

  const handleInstall = () => {
    router.push(`/install/${widget.id}`);
  };

  const handlePreview = () => {
    router.push(`/preview/${widget.id}`);
  };

  const handleStatusChange = (status: WidgetStatus) => {
    updateWidget(widget.id, { status });
    setShowMenu(false);
    addToast({
      type: status === 'active' ? 'success' : 'info',
      message: `Widget ${status === 'active' ? 'started' : status === 'paused' ? 'paused' : 'stopped'}`,
    });
  };

  const handleDelete = () => {
    deleteWidget(widget.id);
    setShowMenu(false);
    addToast({ type: 'success', message: 'Widget deleted' });
  };

  const handleDuplicate = () => {
    const newWidget: Widget = {
      ...widget,
      id: `w-${Date.now()}`,
      name: `${widget.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addWidget(newWidget);
    setShowMenu(false);
    addToast({ type: 'success', message: 'Widget duplicated' });
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'recommendation-slider': '🎠',
      'category-pusher': '🎯',
      'ai-similar': '🤖',
      'product-booster': '💬',
      'video-widget': '🎬',
      'custom': '✨',
    };
    return emojis[category] || '📦';
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group hover:bg-slate-50/50 transition-colors"
    >
      {/* Thumbnail + Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl flex-shrink-0">
            {getCategoryEmoji(widget.category)}
          </div>
          <div>
            <button
              onClick={() => {
                setCurrentWidget(widget);
                router.push(`/widget/${widget.id}`);
              }}
              className="font-medium text-slate-900 hover:text-brand-600 transition-colors text-left"
            >
              {widget.name}
            </button>
            <p className="text-sm text-slate-500">
              Updated {new Date(widget.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </td>
      
      {/* Category */}
      <td className="px-6 py-4">
        <span className="text-sm text-slate-600">
          {CATEGORY_LABELS[widget.category]}
        </span>
      </td>
      
      {/* Status */}
      <td className="px-6 py-4">
        <WidgetStatusBadge status={widget.status} />
      </td>
      
      {/* Quick Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleTargeting}
            className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="Targeting"
          >
            <Target className="w-4 h-4" />
          </button>
          <button
            onClick={handlePreview}
            className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
      
      {/* More Actions */}
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <ActionMenu
                widget={widget}
                onClose={() => setShowMenu(false)}
                onEdit={handleEdit}
                onTargeting={handleTargeting}
                onDisplay={handleDisplay}
                onInstall={handleInstall}
                onPreview={handlePreview}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}

export function WidgetTable() {
  const { widgets } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Widget
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Actions
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {widgets.map((widget, index) => (
            <WidgetRow key={widget.id} widget={widget} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

