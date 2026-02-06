
import React, { useState } from 'react';
import { Send, FileInput, UserPlus, History } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'base'>('manual');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contato</h2>
        <p className="text-muted-foreground">
          Realize disparos manuais ou agendados para sua base de leads.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-border bg-muted/30">
          <button 
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'manual' 
                ? 'border-primary text-primary bg-background' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <UserPlus size={18} />
            Envio Manual
          </button>
          <button 
            onClick={() => setActiveTab('base')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'base' 
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
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número (WhatsApp/Celular)</label>
                  <input 
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input 
                    type="email" 
                    placeholder="lead@email.com"
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo do Contato</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all">
                    <option value="">Selecione um motivo</option>
                    <option value="welcome">Boas-vindas</option>
                    <option value="followup">Follow-up</option>
                    <option value="offer">Oferta Especial</option>
                    <option value="support">Suporte</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-md">
                  <Send size={18} />
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
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base de Leads</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all">
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
                    className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all shadow-md">
                  <History size={18} />
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
