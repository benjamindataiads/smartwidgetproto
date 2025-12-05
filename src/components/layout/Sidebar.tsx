'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Layers,
  Settings,
  Palette,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Widgets Library',
    href: '/library',
    icon: LayoutGrid,
    badge: '12',
  },
  {
    label: 'My Widgets',
    href: '/my-widgets',
    icon: Layers,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: 'Global Style',
    href: '/style',
    icon: Palette,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/library') {
      return pathname === '/' || pathname.startsWith('/library');
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-slate-900 text-lg tracking-tight">SmartWidgets</h1>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`
                    sidebar-item group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${active 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                    ${active 
                      ? 'bg-brand-100' 
                      : 'bg-slate-100 group-hover:bg-slate-200'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${active ? 'text-brand-600' : ''}`} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      ml-auto text-xs font-medium px-2 py-0.5 rounded-full
                      ${active 
                        ? 'bg-brand-200 text-brand-700' 
                        : 'bg-slate-200 text-slate-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-600 rounded-r-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 mx-3 h-px bg-slate-200" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <p className="px-3 mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Configuration
          </p>
          {secondaryNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 cursor-pointer
                    ${active 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }
                  `}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
            <p className="text-xs text-slate-500 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

