import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { getBaserowBaseUrl } from '../apiConfig';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseUrl = getBaserowBaseUrl();
      const tableId = process.env.USER_TABLE_ID;
      const token = process.env.BASEROW_WORKSPACE_TOKEN;

      if (!baseUrl || !tableId || !token) {
        throw new Error('Configuração do servidor incompleta (variáveis de ambiente faltando).');
      }

      const response = await fetch(`${baseUrl}/api/database/rows/table/${tableId}/?user_field_names=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar com o banco de dados. Verifique a configuração.');
      }

      const data = await response.json();
      const users = data.results || [];

      // Primary check: email or name
      const userMatch = users.find((u: any) =>
        u.email?.toLowerCase() === emailOrName.toLowerCase() ||
        u.name?.toLowerCase() === emailOrName.toLowerCase()
      );

      if (!userMatch) {
        setError('Nome ou email incorreto.');
        setLoading(false);
        return;
      }

      // Secondary check: password
      if (userMatch.passsword !== password) {
        setError('Credenciais de login inválidas.');
        setLoading(false);
        return;
      }

      // Successful login
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Ocorreu um erro ao tentar realizar o login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8 animate-fade-in text-card-foreground">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground mb-4 shadow-sm">
            <span className="text-2xl font-bold">LC</span>
          </div>
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm mt-1">Entre com suas credenciais para acessar o painel</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email ou Nome de Usuário</label>
            <input
              type="text"
              placeholder="seu@email.com ou nome"
              value={emailOrName}
              onChange={(e) => setEmailOrName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium">Senha</label>
              <a href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
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
