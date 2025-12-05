'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Package, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { RuleBuilder } from '@/components/targeting/RuleBuilder';
import { useApp } from '@/store';
import type { Widget, TargetingCondition } from '@/types';

interface TargetingTabContentProps {
  widget: Widget;
}

export function TargetingTabContent({ widget }: TargetingTabContentProps) {
  const { updateWidget, addToast } = useApp();
  
  const [urlConditions, setUrlConditions] = useState<TargetingCondition[]>([]);
  const [productConditions, setProductConditions] = useState<TargetingCondition[]>([]);
  const [customConditions, setCustomConditions] = useState<TargetingCondition[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const url = widget.targeting.filter(c => c.rules[0]?.type === 'url');
    const product = widget.targeting.filter(c => c.rules[0]?.type === 'product');
    const custom = widget.targeting.filter(c => c.rules[0]?.type === 'custom');
    
    setUrlConditions(url);
    setProductConditions(product);
    setCustomConditions(custom);
  }, [widget.targeting]);

  const handleSave = () => {
    const allConditions = [...urlConditions, ...productConditions, ...customConditions];
    updateWidget(widget.id, { targeting: allConditions });
    setHasChanges(false);
    addToast({ type: 'success', message: 'Targeting rules saved!' });
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

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header with Save */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Targeting Rules</h2>
              <p className="text-sm text-slate-500">
                Define when and where your widget appears
              </p>
            </div>
            <Button
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Rules
            </Button>
          </div>
          
          {/* Introduction */}
          <Card className="mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Control your widget visibility
                </h3>
                <p className="text-sm text-slate-500">
                  Create targeting rules to control exactly when and where your widget is displayed.
                  Combine multiple conditions to create precise targeting strategies.
                </p>
              </div>
            </div>
          </Card>
          
          {/* Tabs */}
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
                  Target specific pages based on URL patterns.
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
                  Filter based on product attributes.
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
                  Advanced targeting using JavaScript variables, cookies, or custom conditions.
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

