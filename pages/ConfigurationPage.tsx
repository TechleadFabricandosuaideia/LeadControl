import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Trash2,
  Plus,
  Settings2,
  Globe,
  Eye,
  Check,
  ChevronDown,
  Lock,
  Phone,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getBaserowBaseUrl } from '../apiConfig';

interface BaserowUser {
  id: number;
  name: string;
  email: string;
  passsword: string;
}

interface BaserowConfig {
  id: number;
  aplicattionUse: string;
  httpMetod: string;
  baseUrl: string;
  headers: string;
  body: string;
}

const ConfigurationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'users' | 'leads' | 'contact'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Users State
  const [users, setUsers] = useState<BaserowUser[]>([]);

  // API Config State
  const [leadsConfig, setLeadsConfig] = useState<Partial<BaserowConfig>>({
    httpMetod: 'GET',
    baseUrl: '',
    headers: '[]',
    body: '[]'
  });
  const [contactConfig, setContactConfig] = useState<Partial<BaserowConfig>>({
    httpMetod: 'GET',
    baseUrl: '',
    headers: '[]',
    body: '[]'
  });

  const [inputModeLeads, setInputModeLeads] = useState<'structured' | 'raw'>('structured');
  const [inputModeContact, setInputModeContact] = useState<'structured' | 'raw'>('structured');

  const baserowUrl = getBaserowBaseUrl();
  const token = process.env.BASEROW_WORKSPACE_TOKEN;
  const userTableId = process.env.USER_TABLE_ID;
  const configTableId = process.env.CONFIGURATION_TABLE_ID;

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    } else {
      fetchConfigs();
    }
  }, [activeSection]);

  const fetchUsers = async () => {
    if (!baserowUrl || !userTableId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baserowUrl}/api/database/rows/table/${userTableId}/?user_field_names=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await response.json();
      setUsers(data.results || []);
    } catch (err) {
      setError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfigs = async () => {
    if (!baserowUrl || !configTableId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baserowUrl}/api/database/rows/table/${configTableId}/?user_field_names=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await response.json();
      const results = data.results || [];

      const lc = results.find((r: any) => r.aplicattionUse === 'LEADBASE');
      const cc = results.find((r: any) => r.aplicattionUse === 'CONTACT');

      if (lc) setLeadsConfig(lc);
      if (cc) setContactConfig(cc);
    } catch (err) {
      setError('Erro ao carregar configurações de API.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baserowUrl || !userTableId || !token) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email') || '', // Added default since it's used in login
      passsword: formData.get('password'),
    };

    setLoading(true);
    try {
      const url = editMode
        ? `${baserowUrl}/api/database/rows/table/${userTableId}/${editMode.id}/?user_field_names=true`
        : `${baserowUrl}/api/database/rows/table/${userTableId}/?user_field_names=true`;

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
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
    if (!baserowUrl || !userTableId || !token || !confirm('Deseja excluir este usuário?')) return;
    setLoading(true);
    try {
      await fetch(`${baserowUrl}/api/database/rows/table/${userTableId}/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      fetchUsers();
    } catch (err) {
      setError('Erro ao excluir usuário.');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (type: 'LEADBASE' | 'CONTACT') => {
    if (!baserowUrl || !configTableId || !token) return;
    const config = type === 'LEADBASE' ? leadsConfig : contactConfig;

    setLoading(true);
    try {
      const isUpdate = !!config.id;
      const url = isUpdate
        ? `${baserowUrl}/api/database/rows/table/${configTableId}/${config.id}/?user_field_names=true`
        : `${baserowUrl}/api/database/rows/table/${configTableId}/?user_field_names=true`;

      const payload = {
        ...config,
        aplicattionUse: type,
        headers: typeof config.headers === 'string' ? config.headers : JSON.stringify(config.headers),
        body: typeof config.body === 'string' ? config.body : JSON.stringify(config.body)
      };
      delete (payload as any).id;
      delete (payload as any).order;

      const response = await fetch(url, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error();
      fetchConfigs();
      alert('Configuração salva com sucesso!');
    } catch (err) {
      setError('Erro ao salvar configuração.');
    } finally {
      setLoading(false);
    }
  };

  const updateConfigField = (type: 'LEADBASE' | 'CONTACT', field: keyof BaserowConfig, value: any) => {
    if (type === 'LEADBASE') {
      setLeadsConfig(prev => ({ ...prev, [field]: value }));
    } else {
      setContactConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const renderApiConfig = (title: string, type: 'LEADBASE' | 'CONTACT', inputMode: 'structured' | 'raw', setInputMode: (m: 'structured' | 'raw') => void) => {
    const config = type === 'LEADBASE' ? leadsConfig : contactConfig;

    // Parse headers/body for structured view
    let headers: any[] = [];
    let body: any[] = [];
    try {
      headers = JSON.parse(config.headers || '[]');
      if (!Array.isArray(headers)) headers = [];
    } catch { headers = []; }

    try {
      body = JSON.parse(config.body || '[]');
      if (!Array.isArray(body)) body = [];
    } catch { body = []; }

    return (
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-fade-in text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">API {title}</h3>
            <p className="text-sm text-muted-foreground">Configure os parâmetros de integração para a base de {title.toLowerCase()}.</p>
          </div>
          <Globe className="text-muted-foreground" size={24} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-2">
            <label className="text-sm font-medium">Método HTTP</label>
            <div className="relative">
              <select
                value={config.httpMetod}
                onChange={(e) => updateConfigField(type, 'httpMetod', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm appearance-none outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none opacity-50" />
            </div>
          </div>
          <div className="md:col-span-3 space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => updateConfigField(type, 'baseUrl', e.target.value)}
              placeholder="https://api.exemplo.com/v1/..."
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 py-2 border-y border-border">
          <span className="text-sm font-medium">Modo de Entrada:</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setInputMode('structured')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${inputMode === 'structured' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Estruturado
            </button>
            <button
              onClick={() => setInputMode('raw')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${inputMode === 'raw' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Raw JSON
            </button>
          </div>
        </div>

        {inputMode === 'structured' ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Headers</h4>
                <button
                  onClick={() => {
                    const newHeaders = [...headers, { key: '', value: '' }];
                    updateConfigField(type, 'headers', JSON.stringify(newHeaders));
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Adicionar +
                </button>
              </div>
              <div className="space-y-2">
                {headers.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Key"
                      value={h.key}
                      onChange={(e) => {
                        const newHeaders = [...headers];
                        newHeaders[i].key = e.target.value;
                        updateConfigField(type, 'headers', JSON.stringify(newHeaders));
                      }}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                    />
                    <input
                      placeholder="Value"
                      value={h.value}
                      onChange={(e) => {
                        const newHeaders = [...headers];
                        newHeaders[i].value = e.target.value;
                        updateConfigField(type, 'headers', JSON.stringify(newHeaders));
                      }}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                    />
                    <button
                      onClick={() => {
                        const newHeaders = headers.filter((_, idx) => idx !== i);
                        updateConfigField(type, 'headers', JSON.stringify(newHeaders));
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Body (Form-Data)</h4>
                <button
                  onClick={() => {
                    const newBody = [...body, { key: '', value: '' }];
                    updateConfigField(type, 'body', JSON.stringify(newBody));
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Adicionar +
                </button>
              </div>
              <div className="space-y-2">
                {body.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Key"
                      value={b.key}
                      onChange={(e) => {
                        const newBody = [...body];
                        newBody[i].key = e.target.value;
                        updateConfigField(type, 'body', JSON.stringify(newBody));
                      }}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                    />
                    <input
                      placeholder="Value"
                      value={b.value}
                      onChange={(e) => {
                        const newBody = [...body];
                        newBody[i].value = e.target.value;
                        updateConfigField(type, 'body', JSON.stringify(newBody));
                      }}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                    />
                    <button
                      onClick={() => {
                        const newBody = body.filter((_, idx) => idx !== i);
                        updateConfigField(type, 'body', JSON.stringify(newBody));
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Raw</label>
            <textarea
              rows={8}
              value={config.body}
              onChange={(e) => updateConfigField(type, 'body', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-mono outline-none focus:ring-1 focus:ring-primary resize-none text-foreground"
              placeholder={`{\n  "key": "value",\n  "header": "config"\n}`}
            ></textarea>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-all">
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => saveConfig(type)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Salvar e Testar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12 text-foreground">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie usuários da plataforma e integre suas APIs externas.</p>
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
          onClick={() => setActiveSection('leads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'leads' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <Settings2 size={18} /> Base de Leads
        </button>
        <button
          onClick={() => setActiveSection('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'contact' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <Globe size={18} /> Contato
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
                      {/* Role is actually not in the DB shown, but we'll use placeholder or omit */}
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

      {activeSection === 'leads' && renderApiConfig('Base de Leads', 'LEADBASE', inputModeLeads, setInputModeLeads)}
      {activeSection === 'contact' && renderApiConfig('Contato', 'CONTACT', inputModeContact, setInputModeContact)}

      {/* User Modal */}
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
                    defaultValue={editMode?.passsword || ''}
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
