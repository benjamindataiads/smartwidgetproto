'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Key,
  Trash2,
  Save,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/store';

export default function SettingsPage() {
  const { addToast } = useApp();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Store',
    website: 'https://acme-store.com',
  });

  const handleSave = () => {
    addToast({ type: 'success', message: 'Settings saved successfully!' });
  };

  return (
    <div className="min-h-screen">
      <TopBar
        title="Settings"
        subtitle="Manage your account and preferences"
        actions={
          <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
            Save Changes
          </Button>
        }
      />
      
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Profile</h3>
                <p className="text-sm text-slate-500">Your personal information and account details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                label="Company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
              <Input
                label="Website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              />
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Notifications</h3>
                <p className="text-sm text-slate-500">Configure how you receive updates and alerts</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Email notifications for widget performance', checked: true },
                { label: 'Weekly analytics summary', checked: true },
                { label: 'Alert when widget has errors', checked: true },
                { label: 'Marketing emails and product updates', checked: false },
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                <Key className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">API Keys</h3>
                <p className="text-sm text-slate-500">Manage your API keys for integrations</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Production API Key</p>
                  <code className="text-xs text-slate-500">sw_prod_****************************1234</code>
                </div>
                <Button variant="secondary" size="sm">
                  Regenerate
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-red-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Danger Zone</h3>
                <p className="text-sm text-slate-500">Irreversible and destructive actions</p>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">Delete Account</p>
                <p className="text-xs text-red-600">Once deleted, all your data will be permanently removed.</p>
              </div>
              <Button variant="danger" size="sm">
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

