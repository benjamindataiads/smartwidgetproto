'use client';

import { createContext, useContext } from 'react';
import type { Widget, WidgetTemplate, ScrapedTheme, Toast, WidgetCategory } from '@/types';

// Mock widget templates
export const WIDGET_TEMPLATES: WidgetTemplate[] = [
  // Recommendation Sliders
  {
    id: 'rec-slider-1',
    name: 'Trending Products',
    description: 'Display your best-selling products in an elegant carousel',
    category: 'recommendation-slider',
    thumbnail: '🔥',
    previewImage: '/templates/trending.png',
    defaultConfig: {
      title: 'Trending Now',
      subtitle: 'Our most popular picks',
      itemsToShow: 4,
      autoplay: true,
      autoplaySpeed: 5000,
      showArrows: true,
      showDots: true,
      cardStyle: 'detailed',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#5a78f2',
      borderRadius: 12,
      padding: 24,
    },
  },
  {
    id: 'rec-slider-2',
    name: 'Recently Viewed',
    description: 'Show products the visitor has recently browsed',
    category: 'recommendation-slider',
    thumbnail: '👀',
    previewImage: '/templates/recently-viewed.png',
    defaultConfig: {
      title: 'Recently Viewed',
      subtitle: 'Pick up where you left off',
      itemsToShow: 5,
      autoplay: false,
      autoplaySpeed: 5000,
      showArrows: true,
      showDots: false,
      cardStyle: 'minimal',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      accentColor: '#10b981',
      borderRadius: 8,
      padding: 20,
    },
  },
  {
    id: 'rec-slider-3',
    name: 'Personalized For You',
    description: 'AI-powered recommendations based on browsing history',
    category: 'recommendation-slider',
    thumbnail: '✨',
    previewImage: '/templates/personalized.png',
    defaultConfig: {
      title: 'Picked For You',
      subtitle: 'Based on your preferences',
      itemsToShow: 4,
      autoplay: true,
      autoplaySpeed: 4000,
      showArrows: true,
      showDots: true,
      cardStyle: 'overlay',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#a855f7',
      borderRadius: 16,
      padding: 24,
    },
  },
  // Category Pushers
  {
    id: 'cat-push-1',
    name: 'Category Spotlight',
    description: 'Highlight a specific category with featured products',
    category: 'category-pusher',
    thumbnail: '🎯',
    previewImage: '/templates/category-spotlight.png',
    defaultConfig: {
      title: 'Shop by Category',
      subtitle: 'Explore our collections',
      itemsToShow: 3,
      autoplay: false,
      autoplaySpeed: 5000,
      showArrows: false,
      showDots: false,
      cardStyle: 'overlay',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#f59e0b',
      borderRadius: 20,
      padding: 32,
    },
  },
  {
    id: 'cat-push-2',
    name: 'New Arrivals',
    description: 'Showcase the latest additions to your catalog',
    category: 'category-pusher',
    thumbnail: '🆕',
    previewImage: '/templates/new-arrivals.png',
    defaultConfig: {
      title: 'New Arrivals',
      subtitle: 'Fresh from our collection',
      itemsToShow: 4,
      autoplay: true,
      autoplaySpeed: 6000,
      showArrows: true,
      showDots: true,
      cardStyle: 'detailed',
      backgroundColor: '#fef3c7',
      textColor: '#78350f',
      accentColor: '#d97706',
      borderRadius: 12,
      padding: 24,
    },
  },
  // AI Similar Products
  {
    id: 'ai-sim-1',
    name: 'Visually Similar',
    description: 'Show products that look similar using AI vision',
    category: 'ai-similar',
    thumbnail: '🤖',
    previewImage: '/templates/visually-similar.png',
    defaultConfig: {
      title: 'You May Also Like',
      subtitle: 'Visually similar products',
      itemsToShow: 4,
      autoplay: false,
      autoplaySpeed: 5000,
      showArrows: true,
      showDots: false,
      cardStyle: 'minimal',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#06b6d4',
      borderRadius: 8,
      padding: 20,
    },
  },
  {
    id: 'ai-sim-2',
    name: 'Complete The Look',
    description: 'AI-powered outfit and style recommendations',
    category: 'ai-similar',
    thumbnail: '👗',
    previewImage: '/templates/complete-look.png',
    defaultConfig: {
      title: 'Complete The Look',
      subtitle: 'Style it your way',
      itemsToShow: 3,
      autoplay: false,
      autoplaySpeed: 5000,
      showArrows: true,
      showDots: false,
      cardStyle: 'overlay',
      backgroundColor: '#fdf4ff',
      textColor: '#701a75',
      accentColor: '#d946ef',
      borderRadius: 16,
      padding: 24,
    },
  },
  // Product Boosters
  {
    id: 'boost-1',
    name: 'Social Proof Banner',
    description: 'Show live purchase notifications and reviews',
    category: 'product-booster',
    thumbnail: '💬',
    previewImage: '/templates/social-proof.png',
    defaultConfig: {
      title: 'Customers Love This',
      subtitle: '★★★★★ 4.9/5 based on 2,341 reviews',
      itemsToShow: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      showArrows: false,
      showDots: false,
      cardStyle: 'detailed',
      backgroundColor: '#ecfdf5',
      textColor: '#065f46',
      accentColor: '#10b981',
      borderRadius: 8,
      padding: 16,
    },
  },
  {
    id: 'boost-2',
    name: 'Urgency Timer',
    description: 'Create urgency with countdown timers and stock levels',
    category: 'product-booster',
    thumbnail: '⏰',
    previewImage: '/templates/urgency.png',
    defaultConfig: {
      title: 'Limited Time Offer',
      subtitle: 'Only 3 left in stock!',
      itemsToShow: 1,
      autoplay: false,
      autoplaySpeed: 5000,
      showArrows: false,
      showDots: false,
      cardStyle: 'minimal',
      backgroundColor: '#fef2f2',
      textColor: '#991b1b',
      accentColor: '#ef4444',
      borderRadius: 8,
      padding: 16,
    },
  },
  // Video Widgets
  {
    id: 'video-1',
    name: 'Product Video Gallery',
    description: 'Showcase product videos in an engaging gallery',
    category: 'video-widget',
    thumbnail: '🎬',
    previewImage: '/templates/video-gallery.png',
    defaultConfig: {
      title: 'See It In Action',
      subtitle: 'Watch our product videos',
      itemsToShow: 3,
      autoplay: false,
      autoplaySpeed: 5000,
      showArrows: true,
      showDots: true,
      cardStyle: 'overlay',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#ef4444',
      borderRadius: 12,
      padding: 24,
    },
  },
  {
    id: 'video-2',
    name: 'UGC Stories',
    description: 'Display user-generated content in a stories format',
    category: 'video-widget',
    thumbnail: '📱',
    previewImage: '/templates/ugc-stories.png',
    defaultConfig: {
      title: 'Real Customer Stories',
      subtitle: 'See what others are saying',
      itemsToShow: 5,
      autoplay: true,
      autoplaySpeed: 4000,
      showArrows: false,
      showDots: true,
      cardStyle: 'overlay',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#ec4899',
      borderRadius: 24,
      padding: 16,
    },
  },
];

// Initial mock widgets
export const INITIAL_WIDGETS: Widget[] = [
  {
    id: 'w1',
    name: 'Homepage Recommendations',
    category: 'recommendation-slider',
    status: 'active',
    templateId: 'rec-slider-1',
    config: WIDGET_TEMPLATES[0].defaultConfig,
    targeting: [
      {
        id: 't1',
        logic: 'and',
        rules: [
          { id: 'r1', type: 'url', operator: 'equals', value: '/', enabled: true },
        ],
      },
    ],
    displayPosition: {
      selector: '.homepage-hero',
      position: 'after',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'w2',
    name: 'Product Page Similar Items',
    category: 'ai-similar',
    status: 'active',
    templateId: 'ai-sim-1',
    config: WIDGET_TEMPLATES[5].defaultConfig,
    targeting: [
      {
        id: 't2',
        logic: 'and',
        rules: [
          { id: 'r2', type: 'url', operator: 'contains', value: '/product/', enabled: true },
        ],
      },
    ],
    displayPosition: {
      selector: '.product-description',
      position: 'after',
    },
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    id: 'w3',
    name: 'Cart Upsell',
    category: 'recommendation-slider',
    status: 'paused',
    templateId: 'rec-slider-3',
    config: WIDGET_TEMPLATES[2].defaultConfig,
    targeting: [
      {
        id: 't3',
        logic: 'and',
        rules: [
          { id: 'r3', type: 'url', operator: 'contains', value: '/cart', enabled: true },
        ],
      },
    ],
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
];

export interface AppState {
  widgets: Widget[];
  scrapedTheme: ScrapedTheme | null;
  toasts: Toast[];
  currentWidget: Widget | null;
}

export interface AppContextType extends AppState {
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
  setCurrentWidget: (widget: Widget | null) => void;
  setScrapedTheme: (theme: ScrapedTheme | null) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function getTemplatesByCategory(category: WidgetCategory): WidgetTemplate[] {
  return WIDGET_TEMPLATES.filter(t => t.category === category);
}

export function getTemplateById(id: string): WidgetTemplate | undefined {
  return WIDGET_TEMPLATES.find(t => t.id === id);
}

