
'use client';
import type { ReactNode } from 'react';
import Header from './Header';
import AdminHeader from './AdminHeader'; 
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen">
      {isAdminPage ? <AdminHeader /> : <Header />}
      
      <main className={`flex-grow ${isAdminPage ? '' : 'container mx-auto px-4 pt-12 pb-8'}`}> {/* Increased pt-12 */}
        {children}
      </main>
      
      {!isAdminPage && (
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} Clothora. All rights reserved.
        </footer>
      )}
    </div>
  );
}
