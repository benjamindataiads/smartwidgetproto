export type WidgetCategory = 
  | 'recommendation-slider'
  | 'category-pusher'
  | 'ai-similar'
  | 'product-booster'
  | 'video-widget'
  | 'custom';

export type WidgetStatus = 'active' | 'paused' | 'stopped' | 'draft';

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  thumbnail: string;
  previewImage: string;
  defaultConfig: WidgetConfig;
}

export interface WidgetConfig {
  title: string;
  subtitle?: string;
  itemsToShow: number;
  autoplay: boolean;
  autoplaySpeed: number;
  showArrows: boolean;
  showDots: boolean;
  cardStyle: 'minimal' | 'detailed' | 'overlay';
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
  padding: number;
  customCSS?: string;
}

export type UrlField = 'url' | 'domain' | 'pathname' | 'search' | 'hash';
export type ProductField = 'title' | 'id' | 'sku' | 'type' | 'vendor' | 'price' | 'tags';
export type CustomConditionType = 'javascript_var' | 'cookie' | 'js_condition';

export interface TargetingRule {
  id: string;
  type: 'url' | 'product' | 'custom';
  field?: UrlField | ProductField | CustomConditionType;
  fieldName?: string; // For JS variable name or cookie name
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex' | 'not_contains' | 'greater_than' | 'less_than';
  value: string;
  enabled: boolean;
}

export interface TargetingCondition {
  id: string;
  logic: 'and' | 'or';
  rules: TargetingRule[];
}

export interface DisplayPosition {
  selector: string;
  position: 'before' | 'after' | 'inside-start' | 'inside-end' | 'replace';
}

export interface Widget {
  id: string;
  name: string;
  category: WidgetCategory;
  status: WidgetStatus;
  templateId: string;
  config: WidgetConfig;
  targeting: TargetingCondition[];
  displayPosition?: DisplayPosition;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapedTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  logoUrl?: string;
  h1Size: string;
  h2Size: string;
  borderRadius: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  'recommendation-slider': 'Recommendation Sliders',
  'category-pusher': 'Category Pushers',
  'ai-similar': 'AI Similar Products',
  'product-booster': 'Product Boosters',
  'video-widget': 'Video Widgets',
  'custom': 'Custom Widgets',
};

export const STATUS_LABELS: Record<WidgetStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  stopped: 'Stopped',
  draft: 'Draft',
};

