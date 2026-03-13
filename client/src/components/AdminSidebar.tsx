import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function AdminSidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (path: string) => location === path;

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin'
    },
    {
      label: 'Produtos',
      icon: Package,
      submenu: [
        { label: 'Listar Produtos', href: '/admin/products' },
        { label: 'Novo Produto', href: '/admin/products/new' },
        { label: 'Categorias', href: '/admin/categories' }
      ]
    },
    {
      label: 'Estoque',
      icon: ShoppingCart,
      href: '/admin/inventory'
    },
    {
      label: 'Promoções',
      icon: Tag,
      submenu: [
        { label: 'Descontos', href: '/admin/promotions' },
        { label: 'Cupons', href: '/admin/coupons' }
      ]
    },
    {
      label: 'Configurações',
      icon: Settings,
      submenu: [
        { label: 'Informações do Site', href: '/admin/settings/site' },
        { label: 'Layout', href: '/admin/settings/layout' },
        { label: 'Usuários', href: '/admin/settings/users' },
        { label: 'Preferências', href: '/admin/settings/preferences' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary text-primary-foreground rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30 ${
          isOpen ? 'w-64' : 'w-20'
        } md:w-64`}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isOpen && 'md:flex'} hidden`}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold">C</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-sm">Cicote</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:block p-1 hover:bg-sidebar-accent rounded"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${!isOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedMenu(expandedMenu === item.label ? null : item.label)
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      expandedMenu === item.label
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`flex-1 text-left text-sm font-medium ${!isOpen && 'md:hidden'}`}>
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${!isOpen && 'md:hidden'} ${
                        expandedMenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedMenu === item.label && (
                    <div className={`ml-4 space-y-1 ${!isOpen && 'md:hidden'}`}>
                      {item.submenu.map((subitem) => (
                        <Link key={subitem.href} href={subitem.href}>
                          <a
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                              isActive(subitem.href)
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                            }`}
                          >
                            {subitem.label}
                          </a>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href!}>
                  <a
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href!)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`text-sm font-medium ${!isOpen && 'md:hidden'}`}>
                      {item.label}
                    </span>
                  </a>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`text-sm font-medium ${!isOpen && 'md:hidden'}`}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
        {/* Content will go here */}
      </div>
    </>
  );
}
