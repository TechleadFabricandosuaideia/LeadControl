
import React, { useState } from 'react';
import { 
  User, 
  Trash2, 
  Plus, 
  Settings2, 
  Globe, 
  Eye, 
  Save, 
  Check,
  ChevronDown,
  Lock,
  Phone
} from 'lucide-react';

const ConfigurationPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'users' | 'leads' | 'contact'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<any>(null);
  const [inputModeLeads, setInputModeLeads] = useState<'structured' | 'raw'>('structured');
  const [inputModeContact, setInputModeContact] = useState<'structured' | 'raw'>('structured');

  const users = [
    { id: 1, name: 'Admin Principal', phone: '+55 11 99999-9999', role: 'Administrador' },
    { id: 2, name: 'João Supervisor', phone: '+55 11 98888-8888', role: 'Supervisor' },
    { id: 3, name: 'Maria Operadora', phone: '+55 11 97777-7777', role: 'Operador' },
  ];

  const renderApiConfig = (title: string, inputMode: 'structured' | 'raw', setInputMode: (m: 'structured' | 'raw') => void) => (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-fade-in">
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
            <select className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm appearance-none outline-none focus:ring-1 focus:ring-primary">
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
            placeholder="https://api.exemplo.com/v1/..."
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-1 focus:ring-primary"
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
              <button className="text-[10px] font-bold text-primary hover:underline">Adicionar +</button>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input placeholder="Key" className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm" />
                <input placeholder="Value" className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm" />
                <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Body (Form-Data)</h4>
               <button className="text-[10px] font-bold text-primary hover:underline">Adicionar +</button>
             </div>
             <div className="space-y-2">
               <div className="flex gap-2">
                 <input placeholder="Key" className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm" />
                 <input placeholder="Value" className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm" />
                 <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md"><Trash2 size={16} /></button>
               </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">JSON Raw</label>
          <textarea 
            rows={8}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-mono outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder={`{\n  "key": "value",\n  "header": "config"\n}`}
          ></textarea>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-all">
          <Eye size={16} />
          Preview
        </button>
        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-sm">
          <Check size={16} />
          Salvar e Testar
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie usuários da plataforma e integre suas APIs externas.</p>
      </div>

      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        <button 
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === 'users' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <User size={18} /> Usuários
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
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90"
            >
              <Plus size={18} /> Novo Usuário
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => (
              <div key={u.id} className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{u.name}</h4>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                    <p className="text-sm mt-2 text-foreground/80 flex items-center gap-1.5">
                      <Phone size={14} className="opacity-60" /> {u.phone}
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
                  <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'leads' && renderApiConfig('Base de Leads', inputModeLeads, setInputModeLeads)}
      {activeSection === 'contact' && renderApiConfig('Contato', inputModeContact, setInputModeContact)}

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fade-in relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <Plus size={24} className="rotate-45" />
            </button>
            
            <h3 className="text-2xl font-bold mb-6">{editMode ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <input 
                  type="text" 
                  defaultValue={editMode?.name || ''}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Número</label>
                <input 
                  type="tel" 
                  defaultValue={editMode?.phone || ''}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none" 
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
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-md"
                >
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
