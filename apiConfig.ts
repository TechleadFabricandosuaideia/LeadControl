/**
 * Centraliza a configuração das URLs de API para garantir funcionamento
 * tanto em desenvolvimento quanto em produção (Docker + Nginx Proxy).
 */

const isProd = (import.meta as any).env.PROD;

// Em produção usamos o proxy do Nginx para evitar problemas de CORS e roteamento
// Em desenvolvimento usamos a URL direta definida no .env
export const getBaserowBaseUrl = () => {
    if (isProd) {
        return '/api/baserow';
    }
    return process.env.BASEROW_BASE_URL || '';
};

export const getHeaders = (configHeaders: string | any, token: string) => {
    let headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (configHeaders) {
        try {
            const parsed = typeof configHeaders === 'string' ? JSON.parse(configHeaders) : configHeaders;
            if (Array.isArray(parsed)) {
                parsed.forEach((h: any) => { headers[h.key] = h.value; });
            }
        } catch (e) {
            console.warn('Falha ao parsear headers', e);
        }
    }

    // Garante o prefixo Token no header Authorization
    const authKey = Object.keys(headers).find(k => k.toLowerCase() === 'authorization');
    if (authKey) {
        if (!headers[authKey].startsWith('Token ') && !headers[authKey].startsWith('Bearer ')) {
            headers[authKey] = `Token ${headers[authKey]}`;
        }
    } else if (token) {
        headers['Authorization'] = `Token ${token}`;
    }

    return headers;
};
