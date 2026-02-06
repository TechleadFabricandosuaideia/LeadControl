
import React from 'react';
import { 
  MoreHorizontal, 
  Search, 
  Plus, 
  Download, 
  Filter, 
  ArrowUpDown,
  CircleCheck,
  CircleAlert,
  Clock
} from 'lucide-react';

const mockLeads = [
  { id: 'LD-1234', name: 'João Silva', email: 'joao.silva@email.com', source: 'Google Ads', status: 'Novo', priority: 'Alta' },
  { id: 'LD-1235', name: 'Maria Santos', email: 'maria.s@company.com', source: 'Facebook', status: 'Contatado', priority: 'Média' },
  { id: 'LD-1236', name: 'Pedro Lima', email: 'pedro.lima@site.com', source: 'Indicação', status: 'Negociação', priority: 'Alta' },
  { id: 'LD-1237', name: 'Ana Oliveira', email: 'ana.oli@email.com', source: 'Google Ads', status: 'Fechado', priority: 'Baixa' },
  { id: 'LD-1238', name: 'Ricardo Costa', email: 'ricardo@startup.io', source: 'Direct', status: 'Novo', priority: 'Média' },
  { id: 'LD-1239', name: 'Beatriz Almeida', email: 'bea.almeida@gmail.com', source: 'LinkedIn', status: 'Contatado', priority: 'Alta' },
  { id: 'LD-1240', name: 'Lucas Ferreira', email: 'lucas.f@email.com', source: 'Facebook', status: 'Perdido', priority: 'Baixa' },
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
    'Novo': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CircleAlert size={12} /> },
    'Contatado': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} /> },
    'Negociação': { bg: 'bg-purple-100', text: 'text-purple-700', icon: <ArrowUpDown size={12} /> },
    'Fechado': { bg: 'bg-green-100', text: 'text-green-700', icon: <CircleCheck size={12} /> },
    'Perdido': { bg: 'bg-gray-100', text: 'text-gray-700', icon: <CircleAlert size={12} /> },
  };
  const config = styles[status] || styles['Novo'];
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
  const config = styles[priority] || styles['Média'];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider font-bold ${config.bg}`}>
      {priority}
    </span>
  );
};

const LeadsControlPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
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
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
            <Plus size={16} />
            Novo Lead
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filtrar por nome ou email..." 
              className="w-full bg-background border border-input rounded-md py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-md text-sm hover:bg-accent">
            <Filter size={14} />
            Status
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-md text-sm hover:bg-accent">
            Prioridade
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Fonte</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{lead.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{lead.source}</td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={lead.priority} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded-md hover:bg-accent text-muted-foreground">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
          <p>Exibindo 7 de 254 leads</p>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded border border-border disabled:opacity-50" disabled>Anterior</button>
            <button className="px-2 py-1 rounded bg-primary text-primary-foreground border border-primary">1</button>
            <button className="px-2 py-1 rounded border border-border hover:bg-accent">2</button>
            <button className="px-2 py-1 rounded border border-border hover:bg-accent">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsControlPage;
