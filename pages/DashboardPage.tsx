
import React, { useState, useEffect } from 'react';
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  TrendingUp,
  Target,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getBaserowBaseUrl, getHeaders } from '../apiConfig';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

interface BaserowConfig {
  id: number;
  aplicattionUse: string;
  httpMetod: string;
  baseUrl: string;
  headers: string;
  body: string;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}> = ({ title, value, change, trend, icon }) => (
  <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-accent/50 text-foreground">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalLeads: 0
  });
  const [chartData, setChartData] = useState<{ name: string; leads: number }[]>([]);

  // Environment variables
  const configTableId = process.env.CONFIGURATION_TABLE_ID;
  const baserowBase = getBaserowBaseUrl();
  const token = process.env.BASEROW_WORKSPACE_TOKEN;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!configTableId || !baserowBase || !token) {
      setError('Configuração incompleta no arquivo .env.');
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch LEADBASE configuration
      const configRes = await fetch(`${baserowBase}/api/database/rows/table/${configTableId}/?user_field_names=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (!configRes.ok) throw new Error('Falha ao buscar configurações');

      const configData = await configRes.json();
      const leadConfig = configData.results?.find((r: BaserowConfig) => r.aplicattionUse === 'LEADBASE');
      if (!leadConfig) throw new Error('Configuração LEADBASE não encontrada');

      // 2. Parse headers
      const headers = getHeaders(leadConfig.headers, token);

      // 3. Fetch Leads
      const baseUrl = leadConfig.baseUrl?.split('?')[0];
      if (!baseUrl) throw new Error('URL base não configurada');

      const leadsRes = await fetch(`${baseUrl}?user_field_names=true`, {
        method: leadConfig.httpMetod || 'GET',
        headers
      });
      if (!leadsRes.ok) throw new Error('Falha ao buscar leads');

      const leadsData = await leadsRes.json();
      const leads = leadsData.results || [];

      // 4. Process Metrics
      setMetrics({
        totalLeads: leads.length
      });

      // 5. Process Chart Data (Volume by Month)
      const monthlyData: Record<string, number> = {
        'Jan': 0, 'Fev': 0, 'Mar': 0, 'Abr': 0, 'Mai': 0, 'Jun': 0,
        'Jul': 0, 'Ago': 0, 'Set': 0, 'Out': 0, 'Nov': 0, 'Dez': 0
      };

      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

      leads.forEach((lead: any) => {
        const createdOn = lead['Created On'] || lead['created_on'];
        if (createdOn) {
          const date = new Date(createdOn);
          if (!isNaN(date.getTime())) {
            const month = monthNames[date.getMonth()];
            monthlyData[month]++;
          }
        }
      });

      const formattedChart = monthNames.map(name => ({
        name,
        leads: monthlyData[name]
      }));

      setChartData(formattedChart);

    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 opacity-50">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="font-medium">Sincronizando dados com o servidor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
        <AlertCircle size={24} />
        <div>
          <h4 className="font-bold">Erro ao carregar Dashboard</h4>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Acompanhe o desempenho das suas campanhas e leads em tempo real.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <StatCard
          title="Total de Leads"
          value={metrics.totalLeads.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={<Users size={20} />}
        />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Volume de Novos Leads</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.004 286.32)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.552 0.016 285.938)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.552 0.016 285.938)' }} />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.92 0.004 286.32)', backgroundColor: 'oklch(1 0 0)' }}
              />
              <Bar dataKey="leads" fill="oklch(0.852 0.199 91.936)" radius={[4, 4, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === new Date().getMonth() ? 'oklch(0.852 0.199 91.936)' : 'oklch(0.967 0.001 286.375)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

