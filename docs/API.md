# API Documentation - Tag Integrator

## Base URL / URL Base

```
http://localhost:3000
```

---

## Endpoints

### Health Check

#### GET /

**EN:** Returns information about the API.

**PT:** Retorna informações sobre a API.

**Response:**
```json
{
    "success": true,
    "message": "Tag Integrator API - Portfolio Edition",
    "version": "2.0.0",
    "endpoints": {
        "companies": "/api/companies",
        "tags": "/api/tags",
        "upload": "/api/upload",
        "pdf": "/api/pdf"
    }
}
```

---

#### GET /health

**EN:** Checks whether the API is online.

**PT:** Verifica se a API está online.

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2024-12-22T10:00:00.000Z"
}
```

---

### Companies / Empresas

#### GET /api/companies

**EN:** Lists all registered companies.

**PT:** Lista todas as empresas cadastradas.

**Response:**

```json
[
    {
        "id": 1758846,
        "name": "CALCENTER",
        "alias": "Calcenter"
    },
    {
        "id": 1742590,
        "name": "RIACHUELO",
        "alias": "Riachuelo"
    }
]
```

---

#### GET /api/companies/tag-types

**EN:** Returns the available tag types for a company.

**PT:** Retorna os tipos de etiqueta disponíveis para uma empresa.

**Query Parameters:**

- `companyCode` (required): Company code / Código da empresa

**Example / Exemplo:** `/api/companies/tag-types?companyCode=1758846`

**Response:**

```json
["corrugado", "frontbox", "palmilha"]
```

---

### Tags / Etiquetas

#### GET /api/tags

**EN:** Lists tags with optional filters.

**PT:** Lista etiquetas com filtros opcionais.

**Query Parameters:**

- `companyCode` (required): Company code / Código da empresa
- `orderNumber` (optional): Order number / Número do pedido
- `tagType` (optional): Tag type / Tipo de etiqueta
- `color` (optional): Color / Cor
- `model` (optional): Model/description / Modelo/descrição

**Example / Exemplo:** `/api/tags?companyCode=1758846&orderNumber=12345`

**Response:**

```json
[
    {
        "id": "uuid-123",
        "orderNumber": "12345",
        "companyId": 1758846,
        "tagType": "corrugado",
        "description": "MEN'S SHOE / SAPATO MASCULINO",
        "quantity": 10,
        "size": "42",
        "color": "BLACK / PRETO"
    }
]
```

---

#### GET /api/tags/orders

**EN:** Lists order numbers by company.

**PT:** Lista números de pedidos por empresa.

**Query Parameters:**

- `companyCode` (required): Company code / Código da empresa

**Response:**

```json
["12345", "12346", "12347"]
```

---

#### DELETE /api/tags

**EN:** Deletes tags by order and company.

**PT:** Deleta etiquetas por pedido e empresa.

**Query Parameters:**

- `orderNumber` (required): Order number / Número do pedido
- `companyId` (required): Company ID / ID da empresa

**Response:**

```json
{
    "success": true,
    "deletedCount": 150
}
```

---

### Upload

#### POST /api/upload

**EN:** Uploads files for processing.

**PT:** Faz upload de arquivos para processamento.

**Query Parameters:**

- `companyCode` (required): Company code / Código da empresa

**Form Data:**

- `files`: Array of files (CSV, XML, TXT, ZPL) / Array de arquivos (CSV, XML, TXT, ZPL)

**Headers:**

```
Content-Type: multipart/form-data
```

**Response (Success / Sucesso):**

```json
{
    "success": true,
    "message": "Files processed successfully / Arquivos processados com sucesso",
    "orderNumber": "12345",
    "tagCount": 150,
    "tagTypes": ["corrugado", "frontbox"]
}
```

**Response (Error / Erro):**

```json
{
    "success": false,
    "message": "Processing failed / Falha no processamento",
    "errors": ["Unsupported file format / Formato de arquivo não suportado"]
}
```

---

### PDF Generation / Geração de PDF

#### POST /api/pdf/generate

**EN:** Generates tag PDFs.

**PT:** Gera PDF de etiquetas.

**Body (JSON):**

```json
{
    "companyCode": 1758846,
    "tipoEtiqueta": "corrugado",
    "orderNumber": "12345",
    "quantity": 10,
    "sizesWithQuantities": [
        { "id": "tag-uuid-1", "quantity": 5 },
        { "id": "tag-uuid-2", "quantity": 3 }
    ]
}
```

**Response:**

- Content-Type: `application/pdf`
- Binary PDF file / Arquivo PDF binário

---

## Error Responses / Respostas de Erro

### 400 Bad Request

**EN:**
```json
{
    "success": false,
    "error": "Required parameters not provided"
}
```

**PT:**
```json
{
    "success": false,
    "error": "Parâmetros obrigatórios não fornecidos"
}
```

---

### 404 Not Found

**EN:**
```json
{
    "success": false,
    "error": "Resource not found"
}
```

**PT:**
```json
{
    "success": false,
    "error": "Recurso não encontrado"
}
```

---

### 500 Internal Server Error

**EN:**
```json
{
    "success": false,
    "error": "Internal server error"
}
```

**PT:**
```json
{
    "success": false,
    "error": "Erro interno do servidor"
}
```

---

## Company Codes Reference / Referência de Códigos de Empresas

| Code / Código | Company / Empresa | Tag Types / Tipos de Etiqueta |
|---------------|-------------------|-------------------------------|
| 1758846 | Calcenter | corrugado, frontbox, palmilha, calcentertag |
| 1742590 | Riachuelo | price, volume, sku |
| 1756059 | Besni | pricebesni |
| 1757040 | DiGaspi | pricedigaspi |
| 1742619 | DiSantinni | pack, skuprice, pricedisantinni |
| 1760014 | Avenida | avenidaprice, avenidapack, avenidainsole |
| 1758860 | Torra | torratag |
| 1760026 | Humanitarian | humanitarian |
| 1758780 | Pernambucanas | pernambucanastag |
| 3132717 | Lins Ferrão | lfprice, lfvolume |
| 1756084 | Caedu | caeduvolume, caeduprice |
| 1758779 | C&A | ceaprice, ceapack |
