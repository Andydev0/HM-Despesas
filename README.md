# Sistema de Controle de Despesas

Este projeto é um aplicativo de controle financeiro pessoal que permite cadastrar, editar e excluir despesas. Desenvolvido com uma arquitetura moderna de frontend e backend separados, oferece uma interface intuitiva e responsiva.

## Como rodar o projeto

### Requisitos

- Node.js 16 ou superior
- PostgreSQL 12 ou superior
- Docker e Docker Compose (opcional, para ambiente containerizado)

### Rodando localmente

#### Backend (NestJS)

1. Entre na pasta do backend:
   ```
   cd backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o banco de dados PostgreSQL e ajuste as configurações no arquivo `.env`:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=expenses
   PORT=3000
   FRONTEND_URL=http://localhost:3001
   ```

4. Inicie o servidor:
   ```
   npm run start:dev
   ```
   O servidor estará disponível em http://localhost:3000

#### Frontend (React)

1. Entre na pasta do frontend:
   ```
   cd frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   PORT=3001
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Inicie a aplicação:
   ```
   npm start
   ```
   A aplicação estará disponível em http://localhost:3001

### Rodando com Docker

Para facilitar o ambiente de desenvolvimento, o projeto pode ser executado usando Docker:

1. Configure os arquivos `.env` necessários:

   **Para o backend (em `backend/.env`):**
   ```
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=expenses
   PORT=3000
   FRONTEND_URL=http://frontend:3001
   ```

   **Para o frontend (em `frontend/.env`):**
   ```
   PORT=3001
   REACT_APP_API_URL=http://backend:3000
   ```

   > **Importante:** Observe que os hostnames usados nos arquivos `.env` para Docker são diferentes dos usados para execução local. No Docker, use os nomes dos serviços definidos no docker-compose.yml como hostnames.

2. Na pasta raiz do projeto, execute:
   ```
   docker-compose up -d
   ```

3. Aguarde a inicialização dos containers

4. Acesse a aplicação em http://localhost:3001

## Decisões técnicas

### Arquitetura

Escolhi separar o projeto em frontend e backend para permitir um desenvolvimento independente de cada parte, facilitando a manutenção e escala. A comunicação entre eles é feita via API REST.

### Backend

- **NestJS**: Framework baseado em TypeScript que segue padrões de arquitetura sólidos como módulos, controllers e services. Escolhi por sua estrutura organizada e fácil manutenção.

- **TypeORM**: ORM que facilita a integração com o PostgreSQL e permite definir entidades de forma clara com decorators.

- **PostgreSQL**: Banco de dados relacional robusto, ideal para armazenar dados estruturados como despesas.

### Frontend

- **React**: Biblioteca para construção de interfaces que permite componentização e reuso de código.

- **Tailwind CSS**: Framework CSS utilitário que acelera o desenvolvimento visual sem necessidade de escrever CSS personalizado. Escolhido pela velocidade de implementação e flexibilidade.

- **Axios**: Cliente HTTP para comunicação com a API do backend, escolhido pela simplicidade e recursos como interceptors.

### Containerização

- **Docker**: Permite empacotar a aplicação e suas dependências em containers isolados, garantindo que funcione de maneira consistente em qualquer ambiente.

- **Docker Compose**: Facilita a orquestração dos serviços (frontend, backend e banco de dados), definindo como devem ser executados em conjunto.

## Funcionalidades

- Cadastro de despesas com categoria, valor e data
- Validação para impedir datas futuras
- Edição de despesas existentes
- Exclusão de despesas com confirmação
- Listagem de todas as despesas


