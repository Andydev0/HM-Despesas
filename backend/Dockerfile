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

# Expor a porta definida na variável de ambiente PORT ou 3000 por padrão
EXPOSE 3000

# Iniciar a aplicação
CMD ["npm", "run", "start:prod"]
