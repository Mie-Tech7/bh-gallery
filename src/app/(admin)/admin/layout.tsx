'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Users,
  Star,
  ClipboardList,
  Mail,
  Palette,
} from 'lucide-react';

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Site Content', href: '/admin/content', icon: FileText },
  { label: 'Artists', href: '/admin/artists', icon: Palette },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Appraisals', href: '/admin/appraisals', icon: ClipboardList },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bhg-cream">
        <p className="text-bhg-gray-400 font-sans">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bhg-cream">
        <div className="text-center">
          <h1 className="text-display-sm font-serif text-bhg-black mb-2">Access Denied</h1>
          <p className="text-bhg-gray-600 font-sans">You need admin access to view this page.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bhg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-bhg-gray-200 fixed top-0 left-0 h-full overflow-y-auto">
        <div className="p-6 border-b border-bhg-gray-200">
          <Link href="/admin" className="font-serif text-heading-md text-bhg-copper">
            BHG Admin
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {adminNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-button text-body-sm font-sans text-bhg-gray-600 hover:bg-bhg-cream hover:text-bhg-black transition-colors"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-bhg-gray-200 mt-auto">
          <Link href="/" className="text-body-sm text-bhg-gray-400 hover:text-bhg-copper transition-colors">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
