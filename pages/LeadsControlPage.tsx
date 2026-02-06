import React, { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  CircleCheck,
  CircleAlert,
  Clock,
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface BaserowConfig {
  id: number;
  aplicattionUse: string;
  httpMetod: string;
  baseUrl: string;
  headers: string;
  body: string;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
    'Novo': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CircleAlert size={12} /> },
    'Contatado': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} /> },
    'Negociação': { bg: 'bg-purple-100', text: 'text-purple-700', icon: <ArrowUpDown size={12} /> },
    'Fechado': { bg: 'bg-green-100', text: 'text-green-700', icon: <CircleCheck size={12} /> },
    'Perdido': { bg: 'bg-gray-100', text: 'text-gray-700', icon: <CircleAlert size={12} /> },
  };
  const config = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: <CircleAlert size={12} /> };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {status}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const styles: Record<string, { bg: string, text: string }> = {
    'Alta': { bg: 'bg-red-50 text-red-600 border-red-100', text: 'text-red-700' },
    'Média': { bg: 'bg-orange-50 text-orange-600 border-orange-100', text: 'text-orange-700' },
    'Baixa': { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'text-emerald-700' },
  };
  const config = styles[priority] || { bg: 'bg-primary/5 text-primary border-primary/10', text: 'text-primary' };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider font-bold ${config.bg}`}>
      {priority}
    </span>
  );
};

const LeadsControlPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Environment variables
  const configTableId = process.env.CONFIGURATION_TABLE_ID;
  const baserowBase = process.env.BASEROW_BASE_URL;
  const token = process.env.BASEROW_WORKSPACE_TOKEN;

  useEffect(() => {
    fetchLeads();
  }, []);

  const getLeadBaseConfig = async () => {
    if (!configTableId || !baserowBase || !token) {
      console.warn('Missing environment variables for Baserow configuration');
      return null;
    }
    try {
      const configRes = await fetch(`${baserowBase}/api/database/rows/table/${configTableId}/?user_field_names=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (!configRes.ok) return null;
      const configData = await configRes.json();
      return configData.results?.find((r: BaserowConfig) => r.aplicattionUse === 'LEADBASE');
    } catch (err) {
      console.error('Error fetching LeadBase config', err);
      return null;
    }
  };

  const getCleanUrlAndHeaders = (config: BaserowConfig) => {
    if (!config.baseUrl) return { baseUrl: '', headers: {} };

    const cleanUrl = config.baseUrl.split('?')[0];
    const baseUrl = cleanUrl.endsWith('/') ? cleanUrl : `${cleanUrl}/`;

    let headers: Record<string, string> = {};
    if (config.headers && config.headers.trim() !== '') {
      try {
        const parsed = JSON.parse(config.headers);
        if (Array.isArray(parsed)) {
          headers = parsed.reduce((acc: any, h: any) => ({ ...acc, [h.key]: h.value }), {});
        }
      } catch (e) {
        console.warn('Failed to parse headers JSON', e);
      }
    }

    // Process Authorization header to ensure 'Token ' prefix
    const authKey = Object.keys(headers).find(k => k.toLowerCase() === 'authorization');
    if (authKey) {
      let val = headers[authKey];
      if (val && !val.startsWith('Token ') && !val.startsWith('Bearer ') && !val.startsWith('JWT ')) {
        headers[authKey] = `Token ${val}`;
      }
    } else {
      headers['Authorization'] = `Token ${token}`;
    }

    return { baseUrl, headers };
  };

  const fetchLeads = async () => {
    if (!configTableId || !baserowBase || !token) {
      setError('Configuração incompleta no arquivo .env. Verifique CONFIGURATION_TABLE_ID, BASEROW_BASE_URL e BASEROW_WORKSPACE_TOKEN.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const config = await getLeadBaseConfig();
      if (!config) {
        setError('Configuração LEADBASE não encontrada na tabela de configurações.');
        return;
      }

      const { baseUrl, headers } = getCleanUrlAndHeaders(config);
      if (!baseUrl) {
        setError('URL base não configurada para a Base de Leads.');
        return;
      }

      const leadsRes = await fetch(`${baseUrl}?user_field_names=true`, {
        method: config.httpMetod || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      if (!leadsRes.ok) {
        const errorData = await leadsRes.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${leadsRes.status}`);
      }

      const leadsData = await leadsRes.json();
      setLeads(leadsData.results || []);
    } catch (err: any) {
      setError(`Erro ao carregar leads: ${err.message || 'Falha na conexão'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // Capture form before any await
    setLoading(true);
    setError(null);
    try {
      const config = await getLeadBaseConfig();
      if (!config) throw new Error('Configuração LEADBASE não encontrada');

      const { baseUrl, headers } = getCleanUrlAndHeaders(config);
      const formData = new FormData(form);
      const data: any = {};
      formData.forEach((value, key) => { data[key] = value; });

      const url = editMode ? `${baseUrl}${editMode.id}/?user_field_names=true` : `${baseUrl}?user_field_names=true`;

      const res = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${res.status}`);
      }

      setIsModalOpen(false);
      fetchLeads();
    } catch (err: any) {
      setError(`Erro ao salvar lead: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Deseja excluir este lead?')) return;
    setLoading(true);
    setError(null);
    try {
      const config = await getLeadBaseConfig();
      if (!config) throw new Error('Configuração LEADBASE não encontrada');

      const { baseUrl, headers } = getCleanUrlAndHeaders(config);
      const res = await fetch(`${baseUrl}${id}/`, {
        method: 'DELETE',
        headers: {
          ...headers
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${res.status}`);
      }
      fetchLeads();
    } catch (err: any) {
      setError(`Erro ao excluir lead: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Determine columns from first lead
  const columns = leads.length > 0 ? Object.keys(leads[0]).filter(k => !['id', 'order'].includes(k)) : [];

  const filteredLeads = leads.filter(l =>
    Object.values(l).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Controle de Leads</h2>
          <p className="text-sm text-muted-foreground">Gerencie sua lista de leads e acompanhe o funil de vendas.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-sm font-medium hover:bg-accent">
            <Download size={16} />
            Exportar
          </button>
          <button
            onClick={() => { setEditMode(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
          >
            <Plus size={16} />
            Novo Lead
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filtrar por qualquer campo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-input rounded-md py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none text-foreground"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-md text-sm hover:bg-accent">
            <Filter size={14} />
            Status
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading && !leads.length ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-30">
              <Loader2 className="animate-spin" size={40} />
              <p className="text-sm font-medium">Carregando dados reais...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  {columns.map(col => (
                    <th key={col} className="px-6 py-4">{col}</th>
                  ))}
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{lead.id}</td>
                    {columns.map(col => (
                      <td key={col} className="px-6 py-4">
                        {col.toLowerCase() === 'status' ? <StatusBadge status={lead[col]} /> :
                          col.toLowerCase() === 'priority' || col.toLowerCase() === 'prioridade' ? <PriorityBadge priority={lead[col]} /> :
                            String(lead[col] || '-')}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditMode(lead); setIsModalOpen(true); }}
                          className="p-1 rounded-md hover:bg-accent text-primary"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1 rounded-md hover:bg-destructive/10 text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={columns.length + 2} className="px-6 py-12 text-center text-muted-foreground italic">
                      Nenhum lead encontrado. Configure a Base de Leads na página de Configurações.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
          <p>Exibindo {filteredLeads.length} de {leads.length} leads</p>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded border border-border disabled:opacity-50" disabled>Anterior</button>
            <button className="px-2 py-1 rounded bg-primary text-primary-foreground border border-primary">1</button>
            <button className="px-2 py-1 rounded border border-border hover:bg-accent disabled:opacity-50" disabled>Próximo</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fade-in relative text-card-foreground overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <Plus size={24} className="rotate-45" />
            </button>

            <h3 className="text-2xl font-bold mb-6">{editMode ? 'Editar Lead' : 'Novo Lead'}</h3>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              {columns.map(col => (
                <div key={col} className="space-y-2">
                  <label className="text-sm font-medium capitalize">{col}</label>
                  <input
                    name={col}
                    type="text"
                    defaultValue={editMode?.[col] || ''}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none text-foreground"
                    placeholder={`Valor para ${col}...`}
                  />
                </div>
              ))}

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

export default LeadsControlPage;
