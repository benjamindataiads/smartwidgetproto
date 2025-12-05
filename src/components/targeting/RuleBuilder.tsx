'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { TargetingRule, TargetingCondition } from '@/types';

interface RuleBuilderProps {
  conditions: TargetingCondition[];
  onChange: (conditions: TargetingCondition[]) => void;
  ruleType: 'url' | 'product' | 'custom';
}

const operatorOptions = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'regex', label: 'Matches regex' },
  { value: 'not_contains', label: 'Does not contain' },
];

const urlPlaceholders: Record<string, string> = {
  contains: '/product/',
  equals: '/checkout',
  starts_with: '/category/',
  ends_with: '.html',
  regex: '^/product/[0-9]+$',
  not_contains: '/admin/',
};

const productPlaceholders: Record<string, string> = {
  contains: 'electronics',
  equals: 'SKU12345',
  starts_with: 'PROD-',
  ends_with: '-XL',
  regex: '^[A-Z]{3}-[0-9]{4}$',
  not_contains: 'out-of-stock',
};

const customPlaceholders: Record<string, string> = {
  contains: 'logged_in=true',
  equals: 'utm_source=google',
  starts_with: 'session_',
  ends_with: '_completed',
  regex: 'user_id=[0-9]+',
  not_contains: 'debug=',
};

export function RuleBuilder({ conditions, onChange, ruleType }: RuleBuilderProps) {
  const getPlaceholder = (operator: string) => {
    const placeholders = {
      url: urlPlaceholders,
      product: productPlaceholders,
      custom: customPlaceholders,
    };
    return placeholders[ruleType][operator] || 'Enter value...';
  };

  const addCondition = () => {
    const newCondition: TargetingCondition = {
      id: `cond-${Date.now()}`,
      logic: 'and',
      rules: [
        {
          id: `rule-${Date.now()}`,
          type: ruleType,
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
                  className="flex items-center gap-3"
                >
                  {/* Logic Connector */}
                  {ruleIndex > 0 && (
                    <div className="flex-shrink-0">
                      <select
                        value={condition.logic}
                        onChange={(e) =>
                          updateConditionLogic(condition.id, e.target.value as 'and' | 'or')
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-brand-600 bg-brand-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="and">AND</option>
                        <option value="or">OR</option>
                      </select>
                    </div>
                  )}
                  {ruleIndex === 0 && (
                    <div className="w-[52px] flex-shrink-0 text-center">
                      <span className="text-xs font-medium text-slate-400">IF</span>
                    </div>
                  )}

                  {/* Rule Fields */}
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-40">
                      <Select
                        value={rule.operator}
                        onChange={(e) =>
                          updateRule(condition.id, rule.id, {
                            operator: e.target.value as TargetingRule['operator'],
                          })
                        }
                        options={operatorOptions}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={rule.value}
                        onChange={(e) =>
                          updateRule(condition.id, rule.id, { value: e.target.value })
                        }
                        placeholder={getPlaceholder(rule.operator)}
                      />
                    </div>
                  </div>

                  {/* Toggle + Delete */}
                  <div className="flex items-center gap-1">
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

