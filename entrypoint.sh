#!/bin/sh

# Protege variáveis internas do Nginx (como $uri) de serem limpas pelo envsubst
export NGINX_ENVSUBST_FILTER='${BASEROW_BASE_URL}'

echo "Injecting environment variables..."

# Mapeamento do nome do placeholder para a variável de ambiente real
MAPPINGS="VITE_USER_TABLE_ID:USER_TABLE_ID VITE_BASEROW_BASE_URL:BASEROW_BASE_URL VITE_BASEROW_WORKSPACE_TOKEN:BASEROW_WORKSPACE_TOKEN VITE_CONFIGURATION_TABLE_ID:CONFIGURATION_TABLE_ID VITE_GEMINI_API_KEY:GEMINI_API_KEY"

# Encontra todos os arquivos JS no diretório de assets
for file in /usr/share/nginx/html/assets/*.js; do
  if [ -f "$file" ]; then
    echo "Processando arquivo: $file"
    for mapping in $MAPPINGS; do
      placeholder=$(echo $mapping | cut -d: -f1)
      env_var=$(echo $mapping | cut -d: -f2)
      val=$(eval echo \$$env_var)
      
      if [ -n "$val" ]; then
        echo " - Substituindo ${placeholder}_PLACEHOLDER por valor de $env_var"
        sed -i "s|${placeholder}_PLACEHOLDER|${val}|g" "$file"
      fi
    done
  fi
done

echo "Injeção concluída. Passando comando para o entrypoint do Nginx..."

exec /docker-entrypoint.sh "$@"
