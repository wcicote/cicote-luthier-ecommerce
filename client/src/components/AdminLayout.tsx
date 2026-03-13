import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { Bell, User, Search } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* Top Bar */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-20">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 mt-16 p-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
