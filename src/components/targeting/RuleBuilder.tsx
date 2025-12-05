'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { TargetingRule, TargetingCondition, UrlField, ProductField, CustomConditionType } from '@/types';

interface RuleBuilderProps {
  conditions: TargetingCondition[];
  onChange: (conditions: TargetingCondition[]) => void;
  ruleType: 'url' | 'product' | 'custom';
}

// URL field options
const urlFieldOptions = [
  { value: 'url', label: 'Full URL' },
  { value: 'domain', label: 'Domain' },
  { value: 'pathname', label: 'Path' },
  { value: 'search', label: 'Query String' },
  { value: 'hash', label: 'Hash' },
];

// Product field options
const productFieldOptions = [
  { value: 'title', label: 'Product Title' },
  { value: 'id', label: 'Product ID' },
  { value: 'sku', label: 'SKU' },
  { value: 'type', label: 'Product Type' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'price', label: 'Price' },
  { value: 'tags', label: 'Tags' },
];

// Custom condition type options
const customTypeOptions = [
  { value: 'javascript_var', label: 'JavaScript Variable' },
  { value: 'cookie', label: 'Cookie' },
  { value: 'js_condition', label: 'JS Condition (returns true/false)' },
];

// Operator options
const stringOperatorOptions = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'regex', label: 'Matches regex' },
  { value: 'not_contains', label: 'Does not contain' },
];

const numericOperatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
];

// Placeholders
const urlPlaceholders: Record<string, Record<string, string>> = {
  url: {
    contains: 'https://example.com/product/',
    equals: 'https://example.com/checkout',
    starts_with: 'https://example.com/',
    ends_with: '/checkout',
    regex: '^https://.*\\.com/product/.*$',
    not_contains: '/admin/',
  },
  domain: {
    contains: 'example',
    equals: 'shop.example.com',
    starts_with: 'shop.',
    ends_with: '.com',
    regex: '^.*\\.example\\.com$',
    not_contains: 'staging',
  },
  pathname: {
    contains: '/product/',
    equals: '/checkout',
    starts_with: '/category/',
    ends_with: '.html',
    regex: '^/product/[0-9]+$',
    not_contains: '/admin/',
  },
  search: {
    contains: 'utm_source=',
    equals: '?ref=homepage',
    starts_with: '?category=',
    ends_with: '&sale=true',
    regex: 'utm_.*=google',
    not_contains: 'debug=',
  },
  hash: {
    contains: 'section',
    equals: '#checkout',
    starts_with: '#product-',
    ends_with: '-details',
    regex: '^#tab-[0-9]+$',
    not_contains: '#admin',
  },
};

const productPlaceholders: Record<string, Record<string, string>> = {
  title: {
    contains: 'Premium',
    equals: 'Blue T-Shirt XL',
    starts_with: 'Nike',
    ends_with: 'Edition',
    regex: '^.*Pro.*$',
    not_contains: 'Refurbished',
  },
  id: {
    contains: '123',
    equals: 'prod_abc123',
    starts_with: 'prod_',
    ends_with: '_v2',
    regex: '^prod_[a-z0-9]+$',
    not_contains: 'test_',
  },
  sku: {
    contains: 'NIKE',
    equals: 'SKU-12345',
    starts_with: 'SKU-',
    ends_with: '-XL',
    regex: '^[A-Z]{3}-[0-9]{5}$',
    not_contains: 'DISC-',
  },
  type: {
    contains: 'shirt',
    equals: 'T-Shirt',
    starts_with: 'Shoe',
    ends_with: 'wear',
    regex: '^(T-Shirt|Polo|Jacket)$',
    not_contains: 'Accessory',
  },
  vendor: {
    contains: 'Nike',
    equals: 'Apple',
    starts_with: 'Sam',
    ends_with: 'Inc.',
    regex: '^(Nike|Adidas|Puma)$',
    not_contains: 'Generic',
  },
  price: {
    equals: '99.99',
    greater_than: '50',
    less_than: '200',
  },
  tags: {
    contains: 'sale',
    equals: 'featured',
    starts_with: 'category:',
    ends_with: ':active',
    regex: '^(sale|featured|new)$',
    not_contains: 'hidden',
  },
};

export function RuleBuilder({ conditions, onChange, ruleType }: RuleBuilderProps) {
  const getDefaultField = () => {
    if (ruleType === 'url') return 'url';
    if (ruleType === 'product') return 'title';
    return 'javascript_var';
  };

  const getPlaceholder = (field: string, operator: string) => {
    if (ruleType === 'url') {
      return urlPlaceholders[field]?.[operator] || 'Enter value...';
    }
    if (ruleType === 'product') {
      return productPlaceholders[field]?.[operator] || 'Enter value...';
    }
    // Custom conditions
    if (field === 'js_condition') {
      return 'window.isLoggedIn === true';
    }
    return 'Enter value...';
  };

  const getOperatorOptions = (field: string) => {
    if (field === 'price') {
      return numericOperatorOptions;
    }
    if (field === 'js_condition') {
      return [{ value: 'equals', label: 'Returns' }];
    }
    return stringOperatorOptions;
  };

  const addCondition = () => {
    const newCondition: TargetingCondition = {
      id: `cond-${Date.now()}`,
      logic: 'and',
      rules: [
        {
          id: `rule-${Date.now()}`,
          type: ruleType,
          field: getDefaultField(),
          operator: 'contains',
          value: '',
          enabled: true,
        },
      ],
    };
    onChange([...conditions, newCondition]);
  };

  const addRule = (conditionId: string) => {
    const newRule: TargetingRule = {
      id: `rule-${Date.now()}`,
      type: ruleType,
      field: getDefaultField(),
      operator: 'contains',
      value: '',
      enabled: true,
    };
    onChange(
      conditions.map((c) =>
        c.id === conditionId ? { ...c, rules: [...c.rules, newRule] } : c
      )
    );
  };

  const updateRule = (conditionId: string, ruleId: string, updates: Partial<TargetingRule>) => {
    onChange(
      conditions.map((c) =>
        c.id === conditionId
          ? {
              ...c,
              rules: c.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
            }
          : c
      )
    );
  };

  const deleteRule = (conditionId: string, ruleId: string) => {
    onChange(
      conditions
        .map((c) =>
          c.id === conditionId
            ? { ...c, rules: c.rules.filter((r) => r.id !== ruleId) }
            : c
        )
        .filter((c) => c.rules.length > 0)
    );
  };

  const deleteCondition = (conditionId: string) => {
    onChange(conditions.filter((c) => c.id !== conditionId));
  };

  const updateConditionLogic = (conditionId: string, logic: 'and' | 'or') => {
    onChange(
      conditions.map((c) => (c.id === conditionId ? { ...c, logic } : c))
    );
  };

  if (conditions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No conditions yet</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          Add targeting conditions to control when and where your widget appears.
        </p>
        <Button onClick={addCondition} leftIcon={<Plus className="w-4 h-4" />}>
          Add Condition
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {conditions.map((condition, conditionIndex) => (
          <motion.div
            key={condition.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            {/* Condition Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                <span className="text-sm font-medium text-slate-700">
                  Condition Group {conditionIndex + 1}
                </span>
              </div>
              <button
                onClick={() => deleteCondition(condition.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Rules */}
            <div className="p-4 space-y-3">
              {condition.rules.map((rule, ruleIndex) => (
                <motion.div
                  key={rule.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {/* Logic Connector */}
                    {ruleIndex > 0 && (
                      <div className="flex-shrink-0 w-14">
                        <select
                          value={condition.logic}
                          onChange={(e) =>
                            updateConditionLogic(condition.id, e.target.value as 'and' | 'or')
                          }
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-brand-600 bg-brand-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="and">AND</option>
                          <option value="or">OR</option>
                        </select>
                      </div>
                    )}
                    {ruleIndex === 0 && (
                      <div className="w-14 flex-shrink-0 text-center">
                        <span className="text-xs font-medium text-slate-400">IF</span>
                      </div>
                    )}

                    {/* URL Conditions */}
                    {ruleType === 'url' && (
                      <>
                        <div className="w-32 flex-shrink-0">
                          <Select
                            value={rule.field || 'url'}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, {
                                field: e.target.value as UrlField,
                              })
                            }
                            options={urlFieldOptions}
                          />
                        </div>
                        <div className="w-36 flex-shrink-0">
                          <Select
                            value={rule.operator}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, {
                                operator: e.target.value as TargetingRule['operator'],
                              })
                            }
                            options={getOperatorOptions(rule.field || 'url')}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={rule.value}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, { value: e.target.value })
                            }
                            placeholder={getPlaceholder(rule.field || 'url', rule.operator)}
                          />
                        </div>
                      </>
                    )}

                    {/* Product Conditions */}
                    {ruleType === 'product' && (
                      <>
                        <div className="w-36 flex-shrink-0">
                          <Select
                            value={rule.field || 'title'}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, {
                                field: e.target.value as ProductField,
                                operator: e.target.value === 'price' ? 'equals' : rule.operator,
                              })
                            }
                            options={productFieldOptions}
                          />
                        </div>
                        <div className="w-36 flex-shrink-0">
                          <Select
                            value={rule.operator}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, {
                                operator: e.target.value as TargetingRule['operator'],
                              })
                            }
                            options={getOperatorOptions(rule.field || 'title')}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={rule.value}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, { value: e.target.value })
                            }
                            placeholder={getPlaceholder(rule.field || 'title', rule.operator)}
                            type={rule.field === 'price' ? 'number' : 'text'}
                          />
                        </div>
                      </>
                    )}

                    {/* Custom Conditions */}
                    {ruleType === 'custom' && (
                      <>
                        <div className="w-44 flex-shrink-0">
                          <Select
                            value={rule.field || 'javascript_var'}
                            onChange={(e) =>
                              updateRule(condition.id, rule.id, {
                                field: e.target.value as CustomConditionType,
                              })
                            }
                            options={customTypeOptions}
                          />
                        </div>
                      </>
                    )}

                    {/* Toggle + Delete */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) =>
                            updateRule(condition.id, rule.id, { enabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500" />
                      </label>
                      <button
                        onClick={() => deleteRule(condition.id, rule.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Custom condition extra fields - second row */}
                  {ruleType === 'custom' && rule.field !== 'js_condition' && (
                    <div className="flex items-center gap-2 ml-14">
                      <div className="w-44 flex-shrink-0">
                        <Input
                          value={rule.fieldName || ''}
                          onChange={(e) =>
                            updateRule(condition.id, rule.id, { fieldName: e.target.value })
                          }
                          placeholder={rule.field === 'cookie' ? 'Cookie name' : 'Variable name (e.g. window.userId)'}
                        />
                      </div>
                      <div className="w-36 flex-shrink-0">
                        <Select
                          value={rule.operator}
                          onChange={(e) =>
                            updateRule(condition.id, rule.id, {
                              operator: e.target.value as TargetingRule['operator'],
                            })
                          }
                          options={stringOperatorOptions}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={rule.value}
                          onChange={(e) =>
                            updateRule(condition.id, rule.id, { value: e.target.value })
                          }
                          placeholder={rule.field === 'cookie' ? 'Cookie value' : 'Variable value'}
                        />
                      </div>
                    </div>
                  )}

                  {/* JS Condition - single input */}
                  {ruleType === 'custom' && rule.field === 'js_condition' && (
                    <div className="flex items-center gap-2 ml-14">
                      <div className="flex-1">
                        <Input
                          value={rule.value}
                          onChange={(e) =>
                            updateRule(condition.id, rule.id, { value: e.target.value })
                          }
                          placeholder="window.isLoggedIn === true && window.cartTotal > 100"
                        />
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        must return <code className="bg-slate-100 px-1 rounded">true</code>
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Add Rule Button */}
              <button
                onClick={() => addRule(condition.id)}
                className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Add rule
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Condition Group */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <Button variant="secondary" size="sm" onClick={addCondition} leftIcon={<Plus className="w-4 h-4" />}>
          Add Condition Group
        </Button>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}
