
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Non-functional login: redirects to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground mb-4 shadow-sm">
            <span className="text-2xl font-bold">LC</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm mt-1">Entre com suas credenciais para acessar o painel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1">Email</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <a href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2.5 mt-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; 2024 LeadConnect. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
