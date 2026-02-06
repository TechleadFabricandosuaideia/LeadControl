
import React, { useState, useEffect } from 'react';
import { Send, FileInput, UserPlus, History, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface BaserowConfig {
  id: number;
  aplicattionUse: string;
  httpMetod: string;
  baseUrl: string;
  headers: string;
  body: string;
}

const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'base'>('manual');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form states
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  });

  const [baseForm, setBaseForm] = useState({
    date: '',
    leadBase: '',
    reason: ''
  });

  // Environment variables
  const configTableId = process.env.CONFIGURATION_TABLE_ID;
  const baserowBase = process.env.BASEROW_BASE_URL;
  const token = process.env.BASEROW_WORKSPACE_TOKEN;

  const handleSubmit = async (type: 'manual' | 'base') => {
    if (!configTableId || !baserowBase || !token) {
      setStatus({ type: 'error', message: 'Configuração incompleta no .env' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // 1. Fetch configuration from Baserow
      const configRes = await fetch(`${baserowBase}/api/database/rows/table/${configTableId}/?user_field_names=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (!configRes.ok) throw new Error('Falha ao buscar configurações');

      const configData = await configRes.json();
      const contactConfig = configData.results?.find((r: BaserowConfig) => r.aplicattionUse === 'CONTACT');

      if (!contactConfig) throw new Error('Configuração CONTACT não encontrada');

      // 2. Parse headers
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (contactConfig.headers) {
        try {
          const parsedHeaders = JSON.parse(contactConfig.headers);
          if (Array.isArray(parsedHeaders)) {
            parsedHeaders.forEach((h: { key: string, value: string }) => {
              headers[h.key] = h.value;
            });
          }
        } catch (e) {
          console.error('Error parsing headers', e);
        }
      }

      // 3. Send data to n8n
      const payload = type === 'manual' ? manualForm : baseForm;

      const n8nRes = await fetch(contactConfig.baseUrl, {
        method: contactConfig.httpMetod || 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!n8nRes.ok) throw new Error('Falha ao enviar para o webhook');

      setStatus({ type: 'success', message: 'Enviado com sucesso!' });

      // Clear form
      if (type === 'manual') {
        setManualForm({ name: '', phone: '', email: '', reason: '' });
      } else {
        setBaseForm({ date: '', leadBase: '', reason: '' });
      }

    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro inesperado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contato</h2>
        <p className="text-muted-foreground">
          Realize disparos manuais ou agendados para sua base de leads.
        </p>
      </div>

      {status && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 animate-fade-in ${status.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
          : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
          }`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-border bg-muted/30">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'manual'
              ? 'border-primary text-primary bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
          >
            <UserPlus size={18} />
            Envio Manual
          </button>
          <button
            onClick={() => setActiveTab('base')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'base'
              ? 'border-primary text-primary bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
          >
            <FileInput size={18} />
            Envio para Base
          </button>
        </div>

        {/* Tabs Content */}
        <div className="p-8">
          {activeTab === 'manual' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Lead</label>
                  <input
                    type="text"
                    placeholder="Ex: Pedro Alvares"
                    value={manualForm.name}
                    onChange={(e) => setManualForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número (WhatsApp/Celular)</label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="lead@email.com"
                    value={manualForm.email}
                    onChange={(e) => setManualForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo do Contato</label>
                  <select
                    value={manualForm.reason}
                    onChange={(e) => setManualForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Selecione um motivo</option>
                    <option value="welcome">Boas-vindas</option>
                    <option value="followup">Follow-up</option>
                    <option value="offer">Oferta Especial</option>
                    <option value="support">Suporte</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => handleSubmit('manual')}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Confirmar Envio
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Contato</label>
                  <input
                    type="date"
                    value={baseForm.date}
                    onChange={(e) => setBaseForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base de Leads</label>
                  <select
                    value={baseForm.leadBase}
                    onChange={(e) => setBaseForm(prev => ({ ...prev, leadBase: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Selecione a base</option>
                    <option value="marketing_list">Marketing Agosto 2024</option>
                    <option value="reactivation">Reativação Antigos</option>
                    <option value="high_priority">Prioridade Alta (VIP)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Motivo do Contato</label>
                  <textarea
                    rows={4}
                    placeholder="Descreva o propósito deste disparo em massa..."
                    value={baseForm.reason}
                    onChange={(e) => setBaseForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => handleSubmit('base')}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <History size={18} />}
                  Agendar Disparo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

