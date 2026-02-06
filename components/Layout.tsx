
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';

const SidebarItem: React.FC<{ 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
}> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-primary text-primary-foreground font-medium' 
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
    {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
  </Link>
);

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/leadsControl', label: 'Controle de Leads', icon: <Users size={20} /> },
    { to: '/contact', label: 'Contato', icon: <MessageSquare size={20} /> },
    { to: '/configuration', label: 'Configuração', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                LC
              </div>
              LeadConnect
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu Principal</p>
            {navItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
              />
            ))}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-sidebar-border space-y-4">
            <div className="flex items-center gap-3 px-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Users size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Admin User</span>
                <span className="text-xs text-muted-foreground truncate">admin@example.com</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md hidden md:block">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <input 
                 type="search" 
                 placeholder="Procurar leads..." 
                 className="w-full bg-muted border-none rounded-md py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
               />
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md hover:bg-accent relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-border mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium">Workspace</p>
                <p className="text-[10px] text-muted-foreground">Premium Plan</p>
              </div>
              <div className="w-8 h-8 rounded bg-accent"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
