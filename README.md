# Tag Integrator – Portfolio Edition

**EN:** A system for converting and generating labels (tags) for multiple companies, developed using **Domain-Driven Design (DDD)** architecture.

**PT:** Sistema de conversão e geração de etiquetas (tags) para múltiplas empresas, desenvolvido com arquitetura **Domain-Driven Design (DDD)**.

---

## 🎯 About the Project / Sobre o Projeto

**EN:** Tag Integrator is a robust system that:
- Processes files in different formats (XML, CSV, ZPL, FixedWidth)
- Converts data using company-specific converters
- Generates customized PDFs with templates, fonts, and logos

**PT:** O Tag Integrator é um sistema robusto que:
- Processa arquivos de diferentes formatos (XML, CSV, ZPL, FixedWidth)
- Converte dados através de converters específicos por empresa
- Gera PDFs personalizados com templates, fontes e logos

---

## 🏗️ DDD Architecture / Arquitetura DDD

**EN:** The project follows Domain-Driven Design principles with the following layers:

**PT:** O projeto segue os princípios de Domain-Driven Design com as seguintes camadas:

```
src/
├── domain/           # Domain Layer (business core) / Camada de Domínio (núcleo do negócio)
│   ├── entities/     # Business entities / Entidades do negócio
│   ├── value-objects/# Immutable value objects / Objetos de valor imutáveis
│   ├── repositories/ # Repository interfaces / Interfaces de repositórios
│   └── services/     # Domain services / Serviços de domínio
│
├── application/      # Application Layer / Camada de Aplicação
│   ├── use-cases/    # Use cases / Casos de uso
│   ├── dto/          # Data Transfer Objects
│   └── mappers/      # Entity <-> DTO mappers / Mapeadores entidade<->DTO
│
├── infrastructure/   # Infrastructure Layer / Camada de Infraestrutura
│   ├── persistence/  # Repository implementations / Implementação de repositórios
│   ├── converters/   # File converters / Conversores de arquivos
│   ├── file-processors/ # File processors / Processadores de arquivos
│   ├── pdf-generators/  # PDF generators / Geradores de PDF
│   └── factories/    # Object factories / Factories para criação de objetos
│
├── presentation/     # Presentation Layer / Camada de Apresentação
│   └── http/         # REST API
│       ├── controllers/
│       ├── routes/
│       └── middlewares/
│
└── shared/           # Shared code / Código compartilhado
    ├── errors/       # Error classes / Classes de erro
    ├── utils/        # Utilities / Utilitários
    └── types/        # TypeScript types / Tipos TypeScript
```

---


## 🚀 Technologies / Tecnologias

- **TypeScript** – Main language / Linguagem principal  
- **Node.js** – Runtime  
- **Express** – HTTP framework  
- **Prisma** – Database ORM / ORM para banco de dados  
- **@pdfme** – PDF generation / Geração de PDFs  
- **Multer** – File uploads / Upload de arquivos  

---

## 📦 Installation / Instalação

**EN:**
```bash
# Clone the repository
git clone https://github.com/your-username/tag-integrator.git

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the server
npm run dev
```

**PT:**
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/tag-integrator.git

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações do banco
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

---

## 🔧 Configuration / Configuração

**EN:** Create a `.env` file with the following variables:

**PT:** Crie um arquivo `.env` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tag_integrator"
SERVER_PORT=3000
NODE_ENV=development
```

---

## � API Usage Flow / Fluxo de Uso da API

**EN:** Follow these steps to use the Tag Integrator API:

### Step 1: Create a Company
First, create a company record using:
```
POST /api/companies
```
This will register the company in the system. You can find ready-to-use company creation examples in the Insomnia collection located at:
- `docs/API_CONSUMER/Insomnia_Collection.json`

### Step 2: Upload Tag Files
Upload your tag files using:
```
POST /api/upload?companyCode=YOUR_COMPANY_CODE
```
Example files for testing are available in:
- `docs/API_CONSUMER/calcenter_examples/` - Calcenter tag files
- `docs/API_CONSUMER/humanitarian_examples/` - Humanitarian tag files
- `docs/API_CONSUMER/linsferrao_examples/` - Lins Ferrão tag files
- `docs/API_CONSUMER/disantinni_examples/` - DiSantinni tag files

These files will be processed and stored in the database.

### Step 3: Get Tag IDs
Retrieve the generated tag IDs from the database:
```
GET /api/tags?companyCode=YOUR_COMPANY_CODE
```
This endpoint returns all tags for the specified company with their respective IDs.

### Step 4: Generate PDFs
Finally, generate the PDF labels using the tag IDs:
```
POST /api/pdf/generate
Body: { "tagIds": [1, 2, 3, ...] }
```

---

**PT:** Siga estas etapas para usar a API do Tag Integrator:

### Passo 1: Criar uma Empresa
Primeiro, crie um registro de empresa usando:
```
POST /api/companies
```
Isso registrará a empresa no sistema. Você pode encontrar exemplos prontos de criação de empresas na coleção do Insomnia localizada em:
- `docs/API_CONSUMER/Insomnia_Collection.json`

### Passo 2: Enviar Arquivos de Etiquetas
Envie seus arquivos de etiquetas usando:
```
POST /api/upload?companyCode=CODIGO_DA_EMPRESA
```
Arquivos de exemplo para testes estão disponíveis em:
- `docs/API_CONSUMER/calcenter_examples/` - Arquivos de etiquetas Calcenter
- `docs/API_CONSUMER/humanitarian_examples/` - Arquivos de etiquetas Humanitarian
- `docs/API_CONSUMER/linsferrao_examples/` - Arquivos de etiquetas Lins Ferrão
- `docs/API_CONSUMER/disantinni_examples/` - Arquivos de etiquetas DiSantinni

Esses arquivos serão processados e armazenados no banco de dados.

### Passo 3: Obter IDs das Etiquetas
Recupere os IDs das etiquetas geradas do banco de dados:
```
GET /api/tags?companyCode=CODIGO_DA_EMPRESA
```
Este endpoint retorna todas as etiquetas da empresa especificada com seus respectivos IDs.

### Passo 4: Gerar PDFs
Finalmente, gere os PDFs das etiquetas usando os IDs das etiquetas:
```
POST /api/pdf/generate
Body: { "tagIds": [1, 2, 3, ...] }
```

---

## 📚 API Endpoints Reference / Referência de Endpoints da API

### Companies / Empresas

- `POST /api/companies` – Create a company / Criação de empresas
- `GET /api/companies` – List all companies / Listar todas as empresas
- `GET /api/companies/tag-types?companyCode=X` – Tag types by company / Tipos de etiqueta por empresa

### Tags / Labels / Etiquetas

- `GET /api/tags?companyCode=X` – List tags / Listar etiquetas
- `GET /api/tags/orders?companyCode=X` – List orders / Listar pedidos
- `DELETE /api/tags?orderNumber=X&companyId=Y` – Delete tags / Deletar etiquetas

### Upload

- `POST /api/upload?companyCode=X` – File upload / Upload de arquivos

### PDF

- `POST /api/pdf/generate` – Generate PDF / Gerar PDF

---

## 🏢 Supported Companies / Empresas Suportadas

| Code / Código | Company / Empresa | Tag Types / Tipos de Etiqueta |
|---------------|-------------------|-------------------------------|
| 1758846 | Calcenter | corrugado, frontbox, palmilha |
| 1742590 | Riachuelo | price, volume, sku |
| 1756059 | Besni | pricebesni |
| 1757040 | DiGaspi | pricedigaspi |
| 1742619 | DiSantinni | pack, skuprice |
| 1760014 | Avenida | avenidaprice, avenidapack |
| 1758860 | Torra | torratag |
| ... | ... | ... |

---

## 🧪 Tests / Testes

**EN:**
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

**PT:**
```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage
```

---

## 📝 License / Licença

**EN:** This project is developed for portfolio purposes and to demonstrate software architecture knowledge.

**PT:** Este projeto é desenvolvido para fins de portfolio e demonstração de conhecimentos em arquitetura de software.

---

## 👨‍💻 Author / Autor

**EN:** Developed as a portfolio project demonstrating:
- DDD Architecture (Domain-Driven Design)
- SOLID principles
- Clean Architecture
- Advanced TypeScript
- RESTful APIs

**PT:** Desenvolvido como projeto de portfolio demonstrando:
- Arquitetura DDD (Domain-Driven Design)
- Princípios SOLID
- Clean Architecture
- TypeScript avançado
- APIs RESTful
