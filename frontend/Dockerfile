FROM node:18-alpine

WORKDIR /app

# Instalar dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm install

# Copiar o arquivo .env e o resto do código
COPY .env ./
COPY . .

# Construir a aplicação
RUN npm run build

# Expor a porta definida na variável de ambiente PORT ou 3001 por padrão
EXPOSE 3001

# Instalando o serve para servir a aplicação em produção
RUN npm install -g serve

# Usar a porta definida na variável de ambiente
CMD ["sh", "-c", "serve -s build -l ${PORT:-3001}"]
