import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Trash2,
  Plus,
  Check,
  Lock,
  Loader2,
  AlertCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface InternalUser {
  id: number;
  name: string;
  email: string;
}

const ConfigurationPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'users' | 'theme'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<InternalUser[]>([]);

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/users');
      const data = await response.json();
      setUsers(data || []);
    } catch (err) {
      setError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email') || '',
      password: formData.get('password'),
    };

    setLoading(true);
    try {
      const url = editMode
        ? `/api/auth/users/${editMode.id}`
        : '/api/auth/users';

      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error();
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Erro ao salvar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Deseja excluir este usuário?')) return;
    setLoading(true);
    try {
      await fetch(`/api/auth/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      setError('Erro ao excluir usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12 text-foreground">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie usuários da plataforma e preferências de tema.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        <button
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'users' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <UserIcon size={18} /> Usuários
        </button>
        <button
          onClick={() => setActiveSection('theme')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'theme' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <Sun size={18} /> Tema
        </button>
      </div>

      {activeSection === 'users' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Gerenciamento de Usuários</h3>
            <button
              onClick={() => { setEditMode(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 shadow-sm"
            >
              <Plus size={18} /> Novo Usuário
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading && !users.length ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-primary opacity-20" />
              </div>
            ) : users.map((u) => (
              <div key={u.id} className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold truncate" title={u.name}>{u.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <p className="text-sm mt-2 text-foreground/80 flex items-center gap-1.5 font-mono">
                      <span className="inline-block w-2.4 h-2.4 rounded-full bg-emerald-500 mr-1" /> Online
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end gap-2">
                  <button
                    onClick={() => { setEditMode(u); setIsModalOpen(true); }}
                    className="p-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'theme' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-fade-in text-card-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Preferência de Tema</h3>
              <p className="text-sm text-muted-foreground">Escolha como você prefere visualizar a aplicação.</p>
            </div>
            <Sun className="text-muted-foreground" size={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Sun size={32} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
              <div className="text-center">
                <p className="font-semibold text-foreground">Claro</p>
                <p className="text-xs text-muted-foreground">Tema claro</p>
              </div>
              {theme === 'light' && (
                <div className="mt-2 flex items-center gap-1 text-primary">
                  <Check size={16} />
                  <span className="text-xs font-medium">Ativo</span>
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Moon size={32} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
              <div className="text-center">
                <p className="font-semibold text-foreground">Escuro</p>
                <p className="text-xs text-muted-foreground">Tema escuro</p>
              </div>
              {theme === 'dark' && (
                <div className="mt-2 flex items-center gap-1 text-primary">
                  <Check size={16} />
                  <span className="text-xs font-medium">Ativo</span>
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                theme === 'system'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Monitor size={32} className={theme === 'system' ? 'text-primary' : 'text-muted-foreground'} />
              <div className="text-center">
                <p className="font-semibold text-foreground">Sistema</p>
                <p className="text-xs text-muted-foreground">Padrão do sistema</p>
              </div>
              {theme === 'system' && (
                <div className="mt-2 flex items-center gap-1 text-primary">
                  <Check size={16} />
                  <span className="text-xs font-medium">Ativo</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fade-in relative text-card-foreground">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <Plus size={24} className="rotate-45" />
            </button>

            <h3 className="text-2xl font-bold mb-6">{editMode ? 'Editar Usuário' : 'Novo Usuário'}</h3>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={editMode?.name || ''}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none text-foreground"
                  placeholder="Ex: admin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={editMode?.email || ''}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none text-foreground"
                  placeholder="teste@Teste.com.br"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    required
                    defaultValue={''}
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none text-foreground"
                    placeholder="••••••••"
                  />
                  <Lock size={16} className="absolute right-3 top-3 opacity-40" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-accent transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPage;
