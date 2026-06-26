'use client';

import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  FileText,
  Globe,
  BarChart3,
  MessageSquare,
  Target,
  TrendingUp,
  FileBarChart,
  Download,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  Users,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workflow', label: 'Workflow', icon: FileText },
  { href: '/dashboard/candidates', label: 'Candidates', icon: Users },
  { href: '/dashboard/galaxy', label: 'Talent Galaxy', icon: Globe },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/copilot', label: 'AI Copilot', icon: MessageSquare },
  { href: '/dashboard/market', label: 'Market Intel', icon: TrendingUp },
  { href: '/dashboard/insights', label: 'Resume Insights', icon: Target },
  { href: '/dashboard/executive', label: 'Executive', icon: FileBarChart },
  { href: '/dashboard/export', label: 'Export', icon: Download },
];

const sectionBreak: Record<string, string> = {
  '/dashboard': 'OVERVIEW',
  '/dashboard/candidates': 'TALENT',
  '/dashboard/analytics': 'ANALYTICS',
  '/dashboard/market': 'INTELLIGENCE',
  '/dashboard/export': 'OUTPUT',
};

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const { theme, toggleTheme } = useAppStore();
  const pathname = usePathname();
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  const handleNavClick = useCallback(() => {
    if (!isDesktop) onNavigate();
  }, [isDesktop, onNavigate]);

  const sections: { label: string; items: typeof navItems }[] = [];
  let currentItems: typeof navItems = [];

  for (const item of navItems) {
    if (sectionBreak[item.href] && currentItems.length > 0) {
      sections.push({ label: sectionBreak[item.href] || '', items: currentItems });
      currentItems = [];
    }
    currentItems.push(item);
  }
  if (currentItems.length > 0) {
    sections.push({ label: sectionBreak[currentItems[0].href] || '', items: currentItems });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-400 blur-xl opacity-40" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm tracking-[0.15em] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TALENTSPHERE
            </h1>
            <p className="text-[9px] tracking-[0.25em] text-violet-400/70 uppercase">AI Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-4 overflow-y-auto scrollbar-thin">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-[9px] font-semibold tracking-[0.2em] text-gray-500 uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/15 via-purple-500/10 to-cyan-500/10 border border-violet-500/20" />
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-violet-400 to-cyan-400" />
                    )}
                    <item.icon className={cn('w-4 h-4 relative z-10 shrink-0', isActive ? 'text-violet-400' : 'text-gray-600 group-hover:text-gray-400')} />
                    <span className="relative z-10 truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-violet-400/50 relative z-10" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.04]">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] w-full transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400/60" />
          ) : (
            <Moon className="w-4 h-4 text-violet-400/60" />
          )}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => setSidebarOpen(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-[60] p-2.5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl lg:hidden hover:bg-white/10 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop: always-visible sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] z-40 flex-col border-r border-white/[0.06] bg-[#080810]/90 backdrop-blur-2xl">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile: animated sidebar */}
      {typeof window !== 'undefined' && (
        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
}

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[49] lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-[260px] z-[55] border-r border-white/[0.06] bg-[#080810]/95 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </>
  );
}
