'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Code,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useApp } from '@/store';

export default function InstallPage() {
  const router = useRouter();
  const params = useParams();
  const { currentWidget, setCurrentWidget, widgets, addToast } = useApp();
  
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedIndividual, setCopiedIndividual] = useState(false);

  useEffect(() => {
    let widget = currentWidget;
    
    if (!widget || widget.id !== params.id) {
      widget = widgets.find(w => w.id === params.id) || null;
      if (widget) {
        setCurrentWidget(widget);
      }
    }
  }, [params.id, currentWidget, widgets, setCurrentWidget]);

  const masterTag = `<!-- SmartWidgets Master Tag -->
<script>
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s);
    j.async=true;
    j.src='https://cdn.smartwidgets.io/v1/loader.js?id='+i;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','swLayer','YOUR_ACCOUNT_ID');
</script>
<!-- End SmartWidgets Master Tag -->`;

  const individualTag = currentWidget
    ? `<!-- SmartWidgets: ${currentWidget.name} -->
<div 
  data-sw-widget="${currentWidget.id}"
  data-sw-template="${currentWidget.templateId}"
></div>
<script>
  if(window.SmartWidgets) {
    SmartWidgets.render('${currentWidget.id}');
  }
</script>
<!-- End SmartWidgets Widget -->`
    : '';

  const handleCopy = async (code: string, type: 'master' | 'individual') => {
    try {
      await navigator.clipboard.writeText(code);
      if (type === 'master') {
        setCopiedMaster(true);
        setTimeout(() => setCopiedMaster(false), 2000);
      } else {
        setCopiedIndividual(true);
        setTimeout(() => setCopiedIndividual(false), 2000);
      }
      addToast({ type: 'success', message: 'Copied to clipboard!' });
    } catch {
      addToast({ type: 'error', message: 'Failed to copy' });
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
        title="Installation"
        breadcrumbs={[
          { label: 'My Widgets', href: '/my-widgets' },
          { label: currentWidget.name },
          { label: 'Installation' },
        ]}
        actions={
          <Button variant="secondary" onClick={() => router.push('/my-widgets')}>
            Done
          </Button>
        }
      />
      
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Install SmartWidgets on your website
                </h3>
                <p className="text-sm text-slate-500">
                  Add the master tag once to your site, and all your widgets will automatically load
                  based on their targeting rules. Alternatively, use individual tags for specific placements.
                </p>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Lightning Fast',
                description: 'Async loading, no blocking',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Secure',
                description: 'HTTPS, CSP compliant',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: 'Always Updated',
                description: 'Changes reflect instantly',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
                  {benefit.icon}
                </div>
                <h4 className="font-medium text-slate-900 text-sm">{benefit.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          <Tabs defaultValue="master">
            <TabsList className="mb-6">
              <TabsTrigger value="master">
                Master Tag (Recommended)
              </TabsTrigger>
              <TabsTrigger value="individual">
                Individual Widget Tag
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="master">
              <Card padding="none">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Master Tag</h4>
                    <p className="text-sm text-slate-500">
                      Add this once to your &lt;head&gt; section
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={copiedMaster ? 'success' : 'secondary'}
                    leftIcon={copiedMaster ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={() => handleCopy(masterTag, 'master')}
                  >
                    {copiedMaster ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                <div className="p-4 bg-slate-900 overflow-x-auto">
                  <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                    {masterTag}
                  </pre>
                </div>
              </Card>
              
              <div className="mt-6 p-6 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-900 mb-4">How it works</h4>
                <div className="space-y-3">
                  {[
                    "The master tag loads asynchronously and won't slow down your page",
                    'It automatically detects which widgets should display based on targeting rules',
                    'Widget statuses (active/paused/stopped) are respected in real-time',
                    'Any changes you make in the dashboard reflect instantly on your site',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-brand-600">{index + 1}</span>
                      </div>
                      <p className="text-sm text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="individual">
              <Card padding="none">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Individual Widget Tag</h4>
                    <p className="text-sm text-slate-500">
                      For manual placement of this specific widget
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={copiedIndividual ? 'success' : 'secondary'}
                    leftIcon={copiedIndividual ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={() => handleCopy(individualTag, 'individual')}
                  >
                    {copiedIndividual ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                <div className="p-4 bg-slate-900 overflow-x-auto">
                  <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                    {individualTag}
                  </pre>
                </div>
              </Card>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Individual tags still require the master tag to be present on the page.
                  Use this method when you need precise control over widget placement in your HTML.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Card className="bg-gradient-to-br from-brand-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900 mb-1">Need help with installation?</h4>
                <p className="text-sm text-slate-500">
                  Check our documentation or contact support for assistance.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  View Docs
                </Button>
                <Button onClick={() => router.push(`/preview/${currentWidget.id}`)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Preview Widget
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

