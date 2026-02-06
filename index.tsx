import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  LayoutDashboard,
  Bell,
  Search,
  LogOut,
  Menu,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Activity,
  Plus,
  Users,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Send,
  Layers,
  Calendar,
  Phone,
  MessageSquare,
  FileText,
  Settings,
  Trash2,
  Edit2,
  Globe,
  Database,
  Code,
  Save,
  X
} from 'lucide-react';

/**
 * DEFINIÇÃO DO TEMA
 * Injeção das variáveis OKLCH fornecidas.
 */
const ThemeStyles = () => (
  <style>{`
    :root {
      --radius: 0.65rem;
      --background: oklch(1 0 0);
      --foreground: oklch(0.141 0.005 285.823);
      --card: oklch(1 0 0);
      --card-foreground: oklch(0.141 0.005 285.823);
      --popover: oklch(1 0 0);
      --popover-foreground: oklch(0.141 0.005 285.823);
      --primary: oklch(0.852 0.199 91.936);
      --primary-foreground: oklch(0.421 0.095 57.708);
      --secondary: oklch(0.967 0.001 286.375);
      --secondary-foreground: oklch(0.21 0.006 285.885);
      --muted: oklch(0.967 0.001 286.375);
      --muted-foreground: oklch(0.552 0.016 285.938);
      --accent: oklch(0.967 0.001 286.375);
      --accent-foreground: oklch(0.21 0.006 285.885);
      --destructive: oklch(0.577 0.245 27.325);
      --border: oklch(0.92 0.004 286.32);
      --input: oklch(0.92 0.004 286.32);
      --ring: oklch(0.852 0.199 91.936);
      --chart-1: oklch(0.905 0.182 98.111);
      --chart-2: oklch(0.795 0.184 86.047);
      --chart-3: oklch(0.681 0.162 75.834);
      --chart-4: oklch(0.554 0.135 66.442);
      --chart-5: oklch(0.476 0.114 61.907);
      --sidebar: oklch(0.985 0 0);
      --sidebar-foreground: oklch(0.141 0.005 285.823);
      --sidebar-primary: oklch(0.681 0.162 75.834);
      --sidebar-primary-foreground: oklch(0.987 0.026 102.212);
      --sidebar-accent: oklch(0.967 0.001 286.375);
      --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
      --sidebar-border: oklch(0.92 0.004 286.32);
      --sidebar-ring: oklch(0.852 0.199 91.936);
    }

    .dark {
      --background: oklch(0.141 0.005 285.823);
      --foreground: oklch(0.985 0 0);
      --card: oklch(0.21 0.006 285.885);
      --card-foreground: oklch(0.985 0 0);
      --popover: oklch(0.21 0.006 285.885);
      --popover-foreground: oklch(0.985 0 0);
      --primary: oklch(0.795 0.184 86.047);
      --primary-foreground: oklch(0.421 0.095 57.708);
      --secondary: oklch(0.274 0.006 286.033);
      --secondary-foreground: oklch(0.985 0 0);
      --muted: oklch(0.274 0.006 286.033);
      --muted-foreground: oklch(0.705 0.015 286.067);
      --accent: oklch(0.274 0.006 286.033);
      --accent-foreground: oklch(0.985 0 0);
      --destructive: oklch(0.704 0.191 22.216);
      --border: oklch(1 0 0 / 10%);
      --input: oklch(1 0 0 / 15%);
      --ring: oklch(0.421 0.095 57.708);
      --sidebar: oklch(0.21 0.006 285.885);
      --sidebar-foreground: oklch(0.985 0 0);
      --sidebar-primary: oklch(0.795 0.184 86.047);
      --sidebar-primary-foreground: oklch(0.987 0.026 102.212);
      --sidebar-accent: oklch(0.274 0.006 286.033);
      --sidebar-accent-foreground: oklch(0.985 0 0);
      --sidebar-border: oklch(1 0 0 / 10%);
      --sidebar-ring: oklch(0.421 0.095 57.708);
    }

    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: 'Inter', system-ui, sans-serif;
    }
  `}</style>
);

// --- Componentes Atômicos ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "px-4 py-2 rounded-[var(--radius)] font-medium transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-95 shadow-sm",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:brightness-95 shadow-sm",
    outline: "border border-[var(--border)] bg-transparent hover:bg-[var(--accent)] text-[var(--foreground)]",
    ghost: "bg-transparent hover:bg-[var(--accent)] text-[var(--foreground)]",
    destructive: "bg-[var(--destructive)] text-white hover:brightness-90 shadow-sm",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, icon: Icon, type = 'text', ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">{label}</label>}
    <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />}
      <input
        type={type}
        className={`w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-2 ${Icon ? 'pl-10' : 'px-4'} pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all placeholder:text-[var(--muted-foreground)]/50 text-sm`}
        {...props}
      />
    </div>
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants: any = {
    default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
    success: "bg-[var(--chart-2)]/20 text-[var(--chart-2)]",
    warning: "bg-[var(--chart-3)]/20 text-[var(--chart-3)]",
    error: "bg-[var(--destructive)]/20 text-[var(--destructive)]",
    info: "bg-[var(--chart-4)]/20 text-[var(--chart-4)]",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Switch = ({ checked, onChange, label }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div 
      onClick={onChange}
      className={`relative w-11 h-6 transition-colors rounded-full ${checked ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`}
    >
      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
    {label && <span className="text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{label}</span>}
  </label>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-[var(--card)] w-full max-w-md border border-[var(--border)] rounded-[calc(var(--radius)*2)] shadow-2xl relative z-10 animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-[var(--accent)] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Componentes da Estrutura ---

const Sidebar = ({ activeTab, onTabChange, onLogout }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Controle de Leads', icon: Users },
    { id: 'contact', label: 'Contato', icon: Send },
    { id: 'configuration', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
          <LogIn className="w-5 h-5 text-[var(--primary-foreground)]" />
        </div>
        <span className="font-bold text-xl tracking-tight text-[var(--sidebar-foreground)]">DevApp</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] shadow-sm'
                : 'text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)]/50 hover:text-[var(--sidebar-foreground)]'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--sidebar-border)]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
};

const Header = () => (
  <header className="h-16 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
    <div className="flex items-center gap-4 flex-1">
      <button className="lg:hidden p-2 text-[var(--muted-foreground)]">
        <Menu className="w-6 h-6" />
      </button>
      <div className="relative max-w-md w-full hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Buscar no sistema..."
          className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button className="p-2 relative text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] rounded-full transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--card)]"></span>
      </button>
      <div className="h-8 w-[1px] bg-[var(--border)] mx-1"></div>
      <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-[var(--accent)] rounded-[var(--radius)] transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--chart-2)] p-0.5">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Avatar" 
            className="w-full h-full rounded-full bg-white"
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-bold leading-none">Felix Sampaio</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">Administrador</p>
        </div>
      </button>
    </div>
  </header>
);

// --- Componentes Específicos da Página ---

const ApiConfigForm = ({ title, description, icon: Icon }: any) => {
  const [isRaw, setIsRaw] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--primary)] rounded-xl text-[var(--primary-foreground)]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
          </div>
        </div>
        <Switch 
          checked={isRaw} 
          onChange={() => setIsRaw(!isRaw)} 
          label={isRaw ? "Modo Raw JSON" : "Modo Estruturado"} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-1.5">
          <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">Método HTTP</label>
          <select className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all text-sm appearance-none">
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <Input label="Base URL" placeholder="https://api.exemplo.com/v1/resource" icon={Globe} />
        </div>
      </div>

      {!isRaw ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
                <Code className="w-3.5 h-3.5" /> Headers
              </h4>
              <button className="text-[10px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> ADICIONAR HEADER
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Key (ex: Content-Type)" />
              <Input placeholder="Value (ex: application/json)" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> Body Params
              </h4>
              <button className="text-[10px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> ADICIONAR PARAM
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Key" />
              <Input placeholder="Value" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-300">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] ml-1">JSON Payload</label>
          <textarea 
            placeholder='{ "key": "value" }'
            rows={8}
            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
          ></textarea>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button variant="outline" className="h-10 px-6">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button className="h-10 px-8">
          <Save className="w-4 h-4" />
          Salvar e Testar
        </Button>
      </div>
    </div>
  );
};

// --- Páginas ---

const ConfigurationContent = () => {
  const [activeSection, setActiveSection] = useState<'users' | 'leads' | 'contact'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const users = [
    { id: 1, name: 'Felix Sampaio', role: 'Administrador', phone: '(11) 98888-7777', email: 'felix@empresa.com' },
    { id: 2, name: 'Beatriz Lima', role: 'Gestor de Leads', phone: '(11) 97777-6666', email: 'beatriz@empresa.com' },
    { id: 3, name: 'Carlos Augusto', role: 'Suporte', phone: '(11) 96666-5555', email: 'carlos@empresa.com' },
  ];

  const sections = [
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'leads', label: 'Base de Leads', icon: Database },
    { id: 'contact', label: 'Contato', icon: Globe },
  ];

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Configurações do Sistema</h1>
        <p className="text-[var(--muted-foreground)]">Ajuste as preferências, gerencie acessos e configure integrações de API.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral de Configurações */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
            <div className="p-4 bg-[var(--muted)]/20 border-b border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Navegação</span>
            </div>
            <nav className="p-2 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[calc(var(--radius)-4px)] text-sm font-bold transition-all ${
                    activeSection === section.id
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Área de Conteúdo da Seção */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] shadow-sm p-8 min-h-[500px]">
            
            {activeSection === 'users' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Gestão de Usuários</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">Controle quem tem acesso à plataforma e seus níveis de permissão.</p>
                  </div>
                  <Button onClick={handleAdd} className="h-10 text-xs">
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 border border-[var(--border)] rounded-[var(--radius)] hover:border-[var(--primary)]/50 transition-all group flex items-start justify-between bg-[var(--background)]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--primary)] font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-sm leading-none">{user.name}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 font-medium">
                            <Badge variant="default" className="scale-90 origin-left">{user.role}</Badge>
                          </p>
                          <p className="text-[11px] text-[var(--muted-foreground)] font-medium">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(user)} className="p-2 hover:bg-[var(--accent)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-[var(--destructive)]/10 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'leads' && (
              <ApiConfigForm 
                title="API de Base de Leads" 
                description="Configure como o sistema deve consultar sua base externa de Leads."
                icon={Database}
              />
            )}

            {activeSection === 'contact' && (
              <ApiConfigForm 
                title="API de Contato" 
                description="Configure a integração para disparo de mensagens e contatos automáticos."
                icon={Globe}
              />
            )}

          </div>
        </div>
      </div>

      {/* Modais Visuais */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? "Editar Usuário" : "Novo Usuário"}
      >
        <div className="space-y-4">
          <Input label="Nome Completo" placeholder="Ex: João Silva" icon={Users} defaultValue={editingUser?.name} />
          <Input label="Número de Contato" placeholder="(11) 99999-9999" icon={Phone} defaultValue={editingUser?.phone} />
          <div className="relative">
             <Input label="Senha de Acesso" type="password" placeholder="••••••••" icon={Lock} />
             <Eye className="absolute right-3 bottom-2.5 w-4 h-4 text-[var(--muted-foreground)]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">Nível de Acesso</label>
            <select className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all text-sm appearance-none" defaultValue={editingUser?.role || 'Suporte'}>
              <option>Administrador</option>
              <option>Gestor de Leads</option>
              <option>Suporte</option>
            </select>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <Button variant="outline" className="flex-1 h-11" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1 h-11" onClick={() => setIsModalOpen(false)}>Salvar Dados</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// --- Páginas de Login, Dashboard e Leads Control (Mantidas do estado anterior) ---

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-[var(--primary)]/20">
            <LogIn className="w-6 h-6 text-[var(--primary-foreground)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Bem-vindo de volta</h1>
          <p className="text-[var(--muted-foreground)] text-sm">Acesse sua área administrativa de forma segura</p>
        </div>

        <div className="bg-[var(--card)] p-8 rounded-[calc(var(--radius)*2)] border border-[var(--border)] shadow-xl shadow-black/5 space-y-6">
          <div className="space-y-4">
            <Input 
              label="E-mail" 
              placeholder="seu@email.com" 
              icon={Mail} 
            />
            <div className="relative">
              <Input 
                label="Senha" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                icon={Lock} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-[var(--border)] bg-[var(--input)] text-[var(--primary)] focus:ring-[var(--ring)]" />
              <span className="text-[var(--muted-foreground)] font-medium">Lembrar acesso</span>
            </label>
            <a href="#" className="text-[var(--primary)] font-bold hover:underline">Esqueceu a senha?</a>
          </div>

          <Button className="w-full h-11" onClick={onLogin}>
            Entrar no Sistema
          </Button>
        </div>

        <p className="text-center text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-bold">
          &copy; {new Date().getFullYear()} Plataforma de Gestão Corporativa
        </p>
      </div>
    </div>
  );
};

const DashboardContent = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-700">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-[var(--muted-foreground)]">Acompanhe o desempenho do seu projeto em tempo real.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-10">Exportar Dados</Button>
        <Button className="h-10">
          <Plus className="w-4 h-4" />
          Novo Registro
        </Button>
      </div>
    </div>

    {/* Cards de Métricas */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: 'Receita Total', value: 'R$ 45.231', trend: '+20.1%', icon: CreditCard, color: 'var(--chart-1)' },
        { title: 'Usuários Ativos', value: '2.350', trend: '+180.1%', icon: Activity, color: 'var(--chart-2)' },
        { title: 'Vendas', value: '+12.234', trend: '+19%', icon: TrendingUp, color: 'var(--chart-3)' },
        { title: 'Atividade', value: '573', trend: '+201', icon: Activity, color: 'var(--chart-4)' },
      ].map((card, i) => (
        <div key={i} className="bg-[var(--card)] p-6 rounded-[var(--radius)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">{card.title}</span>
            <card.icon className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">{card.value}</span>
            <span className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center gap-1">
              {card.trend} <span className="text-[var(--muted-foreground)] font-normal uppercase tracking-tighter">em relação ao mês anterior</span>
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Conteúdo Principal de Exemplo */}
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <div className="lg:col-span-4 bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="font-bold text-lg">Gráfico de Performance</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Indicadores de progresso semanais.</p>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-full h-48 bg-[var(--muted)]/30 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] flex items-center justify-center">
            <p className="text-[var(--muted-foreground)] italic text-sm">Área reservada para visualização de dados</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="font-bold text-lg">Atividades Recentes</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Últimas 5 ações registradas no sistema.</p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-4 flex items-center justify-between hover:bg-[var(--accent)]/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[var(--accent)]`}>
                  <Activity className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Usuário #{item} cadastrado</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1">há {item * 10} minutos</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
            </div>
          ))}
        </div>
        <div className="p-4 bg-[var(--muted)]/10 text-center">
          <button className="text-xs font-bold text-[var(--primary)] hover:underline uppercase tracking-widest">Ver Histórico Completo</button>
        </div>
      </div>
    </div>
  </div>
);

const LeadsControlContent = () => {
  const leads = [
    { id: 'LEAD-7821', name: 'João Silva Oliveira', email: 'joao.silva@exemplo.com', status: 'Novo', source: 'Instagram', date: '12/05/2024' },
    { id: 'LEAD-3214', name: 'Maria Fernanda Santos', email: 'mfer.santos@gmail.com', status: 'Em Negociação', source: 'Google Ads', date: '11/05/2024' },
    { id: 'LEAD-9902', name: 'Ricardo Pereira Lima', email: 'ricardo.lima@outlook.com', status: 'Convertido', source: 'Site Institucional', date: '10/05/2024' },
    { id: 'LEAD-4451', name: 'Ana Beatriz Souza', email: 'ana.souza@empresa.com.br', status: 'Perdido', source: 'Indicação', date: '09/05/2024' },
    { id: 'LEAD-6732', name: 'Marcos Vinícius', email: 'mvinicius@uol.com.br', status: 'Novo', source: 'Facebook', date: '08/05/2024' },
    { id: 'LEAD-1123', name: 'Cláudia Regina', email: 'claudia.regina@exemplo.com', status: 'Em Negociação', source: 'WhatsApp', date: '08/05/2024' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Novo': return <Badge variant="info" className="flex items-center gap-1"><Clock className="w-3 h-3"/> Novo</Badge>;
      case 'Em Negociação': return <Badge variant="warning" className="flex items-center gap-1"><Activity className="w-3 h-3"/> Em Negociação</Badge>;
      case 'Convertido': return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Convertido</Badge>;
      case 'Perdido': return <Badge variant="error" className="flex items-center gap-1"><XCircle className="w-3 h-3"/> Perdido</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Controle de Leads</h1>
          <p className="text-[var(--muted-foreground)]">Gerencie seus potenciais clientes e acompanhe o funil de vendas.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-xs h-9">
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </Button>
          <Button className="text-xs h-9">
            <Plus className="w-3.5 h-3.5" />
            Novo Lead
          </Button>
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-[var(--radius)] border border-[var(--border)] shadow-sm">
        {/* Filtros e Busca */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--muted)]/5">
          <div className="flex flex-1 w-full max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input 
              placeholder="Pesquisar por nome ou email..." 
              className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] pl-10 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button variant="outline" className="h-8 text-[10px] uppercase font-bold tracking-wider">
              <Filter className="w-3 h-3" /> Status
            </Button>
            <Button variant="outline" className="h-8 text-[10px] uppercase font-bold tracking-wider">
              <ArrowUpDown className="w-3 h-3" /> Origem
            </Button>
            <div className="h-6 w-[1px] bg-[var(--border)] mx-1 hidden md:block"></div>
            <Button variant="ghost" className="h-8 text-[10px] text-[var(--muted-foreground)] uppercase font-bold tracking-wider">Limpar</Button>
          </div>
        </div>

        {/* Tabela de Leads */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[var(--muted)]/20 border-b border-[var(--border)]">
                <th className="px-6 py-4 font-semibold text-[var(--muted-foreground)] flex items-center gap-2">Código <ArrowUpDown className="w-3 h-3"/></th>
                <th className="px-6 py-4 font-semibold text-[var(--muted-foreground)]">Nome do Lead</th>
                <th className="px-6 py-4 font-semibold text-[var(--muted-foreground)]">Status</th>
                <th className="px-6 py-4 font-semibold text-[var(--muted-foreground)]">Origem</th>
                <th className="px-6 py-4 font-semibold text-[var(--muted-foreground)]">Data</th>
                <th className="px-6 py-4 font-semibold text-[var(--muted-foreground)] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[var(--accent)]/40 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] font-bold text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors">{lead.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[var(--foreground)]">{lead.name}</span>
                      <span className="text-[11px] text-[var(--muted-foreground)]">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--background)]">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)] text-xs">
                    {lead.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-[var(--accent)] rounded-[var(--radius)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--muted)]/5">
          <span className="text-xs text-[var(--muted-foreground)]">
            Mostrando <span className="font-bold text-[var(--foreground)]">6</span> de <span className="font-bold text-[var(--foreground)]">128</span> leads
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 px-3 text-xs" disabled>Anterior</Button>
            <div className="flex items-center gap-1">
              <Button variant="primary" className="h-8 w-8 p-0 text-xs">1</Button>
              <Button variant="ghost" className="h-8 w-8 p-0 text-xs">2</Button>
              <Button variant="ghost" className="h-8 w-8 p-0 text-xs">3</Button>
            </div>
            <Button variant="outline" className="h-8 px-3 text-xs">Próximo</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactContent = () => {
  const [activeSubTab, setActiveSubTab] = useState<'manual' | 'base'>('manual');

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Contato com Leads</h1>
        <p className="text-[var(--muted-foreground)]">Inicie comunicações individuais ou em massa com sua base de contatos.</p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden shadow-sm">
        <div className="flex border-b border-[var(--border)] bg-[var(--muted)]/20 p-1">
          <button 
            onClick={() => setActiveSubTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all rounded-[calc(var(--radius)-4px)] ${
              activeSubTab === 'manual' 
              ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' 
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Envio Manual
          </button>
          <button 
            onClick={() => setActiveSubTab('base')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all rounded-[calc(var(--radius)-4px)] ${
              activeSubTab === 'base' 
              ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' 
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Envio para Base
          </button>
        </div>

        <div className="p-8">
          {activeSubTab === 'manual' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" placeholder="Ex: João da Silva" icon={Users} />
                <Input label="Número de Telefone" placeholder="(00) 00000-0000" icon={Phone} />
              </div>
              <Input label="E-mail" placeholder="contato@exemplo.com" icon={Mail} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">Motivo do Contato</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <textarea 
                    placeholder="Descreva brevemente o motivo do contato..."
                    rows={4}
                    className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all placeholder:text-[var(--muted-foreground)]/50 resize-none text-sm"
                  ></textarea>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button className="w-full sm:w-auto px-12 h-11">
                  Confirmar Envio
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Data de Contato" type="date" icon={Calendar} />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">Base de Leads</label>
                  <div className="relative group">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                    <select className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all text-sm appearance-none">
                      <option>Selecione uma base...</option>
                      <option>Clientes Inativos (Abril/2024)</option>
                      <option>Leads Orgânicos - Instagram</option>
                      <option>Base Geral - Google Ads</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--muted-foreground)] ml-1">Motivo do Contato</label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <textarea 
                    placeholder="Descreva a finalidade desta campanha de contato..."
                    rows={4}
                    className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all placeholder:text-[var(--muted-foreground)]/50 resize-none text-sm"
                  ></textarea>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button className="w-full sm:w-auto px-12 h-11">
                  Programar Contato em Massa
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ activeTab, onLogout }: { activeTab: string, onLogout: () => void }) => {
  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'leads' && <LeadsControlContent />}
          {activeTab === 'contact' && <ContactContent />}
          {activeTab === 'configuration' && <ConfigurationContent />}
        </main>
      </div>
    </div>
  );
};

// --- App Principal ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'contact' | 'configuration'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => setCurrentPage('dashboard');
  const handleLogout = () => {
    setCurrentPage('login');
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab: 'dashboard' | 'leads' | 'contact' | 'configuration') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen text-[var(--foreground)] transition-colors duration-300">
      <ThemeStyles />
      
      {/* Alternador de Tema flutuante */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-xl"
        title="Alternar Tema"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {currentPage === 'login' ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="flex min-h-screen">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            onLogout={handleLogout} 
          />
          <DashboardPage activeTab={activeTab} onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
