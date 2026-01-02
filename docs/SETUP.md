# Setup Guide / Guia de Configuração

## Prerequisites / Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn / npm ou yarn

---

## Installation / Instalação

### 1. Clone the Repository / Clonar o Repositório

**EN:**
```bash
git clone https://github.com/your-username/tag-integrator.git
cd tag-integrator
```

**PT:**
```bash
git clone https://github.com/seu-usuario/tag-integrator.git
cd tag-integrator
```

---

### 2. Install Dependencies / Instalar Dependências

```bash
npm install
```

---

### 3. Configure Environment Variables / Configurar Variáveis de Ambiente

**EN:** Copy the example file and edit as needed:

**PT:** Copie o arquivo de exemplo e edite conforme necessário:

```bash
cp .env.example .env
```

**EN:** Edit the `.env` file:

**PT:** Edite o arquivo `.env`:

```env
# Database / Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/tag_integrator"

# Server / Servidor
SERVER_PORT=3000
NODE_ENV=development
```

---

### 4. Configure Database / Configurar Banco de Dados

**EN:** Create the database in PostgreSQL:

**PT:** Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE tag_integrator;
```

**EN:** Run Prisma migrations:

**PT:** Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

**EN:** Generate Prisma client:

**PT:** Gerar o cliente Prisma:

```bash
npx prisma generate
```

---

### 5. Create Upload Folder / Criar Pasta de Uploads

```bash
mkdir uploads
```

---

### 6. Start the Server / Iniciar o Servidor

**EN - Development:**
```bash
npm run dev
```

**EN - Production:**
```bash
npm run build
npm start
```

**PT - Desenvolvimento:**
```bash
npm run dev
```

**PT - Produção:**
```bash
npm run build
npm start
```

---

## Folder Structure / Estrutura de Pastas

```
tag-integrator/
├── src/
│   ├── domain/           # Domain Layer / Camada de Domínio
│   ├── application/      # Application Layer / Camada de Aplicação
│   ├── infrastructure/   # Infrastructure Layer / Camada de Infraestrutura
│   ├── presentation/     # Presentation Layer / Camada de Apresentação
│   ├── shared/          # Shared Code / Código Compartilhado
│   └── main.ts          # Entry Point / Ponto de Entrada
├── prisma/
│   ├── schema.prisma    # Database Schema / Schema do banco
│   └── migrations/      # Migrations / Migrações
├── uploads/             # Temporary Files / Arquivos temporários
├── docs/               # Documentation / Documentação
└── tests/              # Tests / Testes
```

---

## Available Scripts / Scripts Disponíveis

**EN:**
```bash
# Development with hot-reload
npm run dev

# Build for production
npm run build

# Start in production
npm start

# Run tests
npm test

# Tests with coverage
npm run test:coverage

# Linting
npm run lint

# Prisma Studio (view database)
npx prisma studio
```

**PT:**
```bash
# Desenvolvimento com hot-reload
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Linting
npm run lint

# Prisma Studio (visualizar banco)
npx prisma studio
```

---

## Verification / Verificação

**EN:** After starting the server, access:

**PT:** Após iniciar o servidor, acesse:

```
http://localhost:3000
```

**EN:** Should return:

**PT:** Deve retornar:

```json
{
    "success": true,
    "message": "Tag Integrator API - Portfolio Edition",
    "version": "2.0.0"
}
```

---

## Troubleshooting / Solução de Problemas

### Database Connection Error / Erro de Conexão com Banco

**EN:** Check if PostgreSQL is running and if the credentials in `.env` are correct.

**PT:** Verifique se o PostgreSQL está rodando e se as credenciais no `.env` estão corretas.

---

### Upload Folder Permission Error / Erro de Permissão na Pasta Uploads

```bash
chmod 755 uploads
```

---

### Outdated Prisma Client / Prisma Client Desatualizado

```bash
npx prisma generate
```

---

## Next Steps / Próximos Passos

**EN:**
1. Configure the database with test data
2. Explore the API documentation at `/docs/API.md`
3. Understand the architecture at `/docs/ARCHITECTURE.md`

**PT:**
1. Configure o banco de dados com dados de teste
2. Explore a documentação da API em `/docs/API.md`
3. Entenda a arquitetura em `/docs/ARCHITECTURE.md`
