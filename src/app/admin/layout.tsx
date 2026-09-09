'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
        {/* Mobile Admin Header Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-burgundy text-white border-b border-white/10 sticky top-20 z-40">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-saffron" />
            <span className="font-serif font-bold text-sm">Admin Control Panel</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            aria-label="Open admin navigation"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>

        {/* Sidebar (desktop pinned + mobile drawer) */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
