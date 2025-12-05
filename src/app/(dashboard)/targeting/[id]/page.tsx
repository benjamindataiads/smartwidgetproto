'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Globe, Package, Code } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RuleBuilder } from '@/components/targeting/RuleBuilder';
import { useApp } from '@/store';
import type { TargetingCondition } from '@/types';

export default function TargetingPage() {
  const router = useRouter();
  const params = useParams();
  const { currentWidget, setCurrentWidget, widgets, updateWidget, addToast } = useApp();
  
  const [urlConditions, setUrlConditions] = useState<TargetingCondition[]>([]);
  const [productConditions, setProductConditions] = useState<TargetingCondition[]>([]);
  const [customConditions, setCustomConditions] = useState<TargetingCondition[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    let widget = currentWidget;
    
    if (!widget || widget.id !== params.id) {
      widget = widgets.find(w => w.id === params.id) || null;
      if (widget) {
        setCurrentWidget(widget);
      }
    }
    
    if (widget) {
      const url = widget.targeting.filter(c => c.rules[0]?.type === 'url');
      const product = widget.targeting.filter(c => c.rules[0]?.type === 'product');
      const custom = widget.targeting.filter(c => c.rules[0]?.type === 'custom');
      
      setUrlConditions(url);
      setProductConditions(product);
      setCustomConditions(custom);
    }
  }, [params.id, currentWidget, widgets, setCurrentWidget]);

  const handleSave = () => {
    if (!currentWidget) {
      return;
    }

    const allConditions = [...urlConditions, ...productConditions, ...customConditions];
    updateWidget(currentWidget.id, { targeting: allConditions });
    setHasChanges(false);
    addToast({ type: 'success', message: 'Targeting rules saved!' });
    router.push('/my-widgets');
  };

  const handleConditionChange = (
    type: 'url' | 'product' | 'custom',
    conditions: TargetingCondition[]
  ) => {
    setHasChanges(true);
    if (type === 'url') {
      setUrlConditions(conditions);
    }
    if (type === 'product') {
      setProductConditions(conditions);
    }
    if (type === 'custom') {
      setCustomConditions(conditions);
    }
  };

  if (!currentWidget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar
        title="Targeting Rules"
        breadcrumbs={[
          { label: 'My Widgets', href: '/my-widgets' },
          { label: currentWidget.name, href: `/editor/${currentWidget.id}` },
          { label: 'Targeting' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Rules
            </Button>
          </div>
        }
      />
      
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Define where your widget appears
                </h3>
                <p className="text-sm text-slate-500">
                  Create targeting rules to control exactly when and where your widget is displayed.
                  Combine multiple conditions to create precise targeting strategies.
                </p>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="url">
            <TabsList className="mb-6">
              <TabsTrigger value="url" icon={<Globe className="w-4 h-4" />}>
                URL Conditions
              </TabsTrigger>
              <TabsTrigger value="product" icon={<Package className="w-4 h-4" />}>
                Product Filters
              </TabsTrigger>
              <TabsTrigger value="custom" icon={<Code className="w-4 h-4" />}>
                Custom Conditions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="mb-4">
                <h3 className="font-medium text-slate-900 mb-1">URL Conditions</h3>
                <p className="text-sm text-slate-500">
                  Target specific pages based on URL patterns. Use contains, equals, or regex matching.
                </p>
              </div>
              <RuleBuilder
                conditions={urlConditions}
                onChange={(c) => handleConditionChange('url', c)}
                ruleType="url"
              />
            </TabsContent>
            
            <TabsContent value="product" className="space-y-4">
              <div className="mb-4">
                <h3 className="font-medium text-slate-900 mb-1">Product Filters</h3>
                <p className="text-sm text-slate-500">
                  Filter based on product attributes like SKU, category, price range, or custom properties.
                </p>
              </div>
              <RuleBuilder
                conditions={productConditions}
                onChange={(c) => handleConditionChange('product', c)}
                ruleType="product"
              />
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div className="mb-4">
                <h3 className="font-medium text-slate-900 mb-1">Custom Conditions</h3>
                <p className="text-sm text-slate-500">
                  Advanced targeting using JavaScript variables, cookies, or query parameters.
                </p>
              </div>
              <RuleBuilder
                conditions={customConditions}
                onChange={(c) => handleConditionChange('custom', c)}
                ruleType="custom"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

