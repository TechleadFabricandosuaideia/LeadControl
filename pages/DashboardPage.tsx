
import React from 'react';
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  TrendingUp,
  Target
} from 'lucide-react';
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

const data = [
  { name: 'Seg', leads: 400 },
  { name: 'Ter', leads: 300 },
  { name: 'Qua', leads: 600 },
  { name: 'Qui', leads: 800 },
  { name: 'Sex', leads: 500 },
  { name: 'Sáb', leads: 200 },
  { name: 'Dom', leads: 300 },
];

const conversionData = [
  { time: '00:00', value: 30 },
  { time: '04:00', value: 20 },
  { time: '08:00', value: 45 },
  { time: '12:00', value: 70 },
  { time: '16:00', value: 65 },
  { time: '20:00', value: 50 },
  { time: '23:59', value: 40 },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}> = ({ title, value, change, trend, icon }) => (
  <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-accent/50 text-foreground">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Acompanhe o desempenho das suas campanhas e leads em tempo real.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Leads" 
          value="2,543" 
          change="+12.5%" 
          trend="up" 
          icon={<Users size={20} />} 
        />
        <StatCard 
          title="Taxa de Conversão" 
          value="18.2%" 
          change="+2.1%" 
          trend="up" 
          icon={<TrendingUp size={20} />} 
        />
        <StatCard 
          title="Contatos Realizados" 
          value="1,202" 
          change="-3.4%" 
          trend="down" 
          icon={<Activity size={20} />} 
        />
        <StatCard 
          title="Metas do Mês" 
          value="85%" 
          change="+5.0%" 
          trend="up" 
          icon={<Target size={20} />} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Volume de Novos Leads</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.552 0.016 285.938)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.552 0.016 285.938)' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.92 0.004 286.32)', backgroundColor: 'oklch(1 0 0)' }}
                />
                <Bar dataKey="leads" fill="oklch(0.852 0.199 91.936)" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? 'oklch(0.852 0.199 91.936)' : 'oklch(0.967 0.001 286.375)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Conversão em Tempo Real</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.552 0.016 285.938)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'oklch(0.552 0.016 285.938)' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.92 0.004 286.32)', backgroundColor: 'oklch(1 0 0)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="oklch(0.421 0.095 57.708)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'oklch(0.421 0.095 57.708)' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
