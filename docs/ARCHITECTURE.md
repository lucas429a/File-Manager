# DDD Architecture - Tag Integrator / Arquitetura DDD - Tag Integrator

## Overview / Visão Geral

**EN:** This document describes the Domain-Driven Design (DDD) architecture implemented in the Tag Integrator project.

**PT:** Este documento descreve a arquitetura Domain-Driven Design (DDD) implementada no projeto Tag Integrator.

---

## Principles Followed / Princípios Seguidos

### 1. Dependency Rule / Regra de Dependência

**EN:** Dependencies always point inward:
- **Domain** doesn't depend on anything external
- **Application** depends only on Domain
- **Infrastructure** depends on Domain and Application
- **Presentation** depends on Application and Infrastructure

**PT:** As dependências sempre apontam para dentro:
- **Domain** não depende de nada externo
- **Application** depende apenas de Domain
- **Infrastructure** depende de Domain e Application
- **Presentation** depende de Application e Infrastructure

---

### 2. Separation of Concerns / Separação de Responsabilidades

**EN:** Each layer has a single responsibility:
- **Domain**: Pure business rules
- **Application**: Use case orchestration
- **Infrastructure**: Technical details
- **Presentation**: User/API interface

**PT:** Cada camada tem responsabilidade única:
- **Domain**: Regras de negócio puras
- **Application**: Orquestração de casos de uso
- **Infrastructure**: Detalhes técnicos
- **Presentation**: Interface com usuário/API

---

### 3. Dependency Injection / Injeção de Dependência

**EN:** Dependency injection at all levels:
- Controllers receive Use Cases
- Use Cases receive Repositories
- Factories create instances with dependencies

**PT:** Injeção de dependência em todos os níveis:
- Controllers recebem Use Cases
- Use Cases recebem Repositories
- Factories criam instâncias com dependências

---

## Layers / Camadas

### Domain Layer / Camada de Domínio

**EN:** The innermost layer, containing:

**PT:** A camada mais interna, contendo:

#### Entities / Entidades
```typescript
// Tag.ts - Main entity / Entidade principal
export class Tag {
    private constructor(props: TagProps) {}
    public static create(props: TagProps): Tag {}
    public static restore(props: TagProps): Tag {}
}
```

#### Value Objects / Objetos de Valor
```typescript
// TagType.ts - Immutable value object / Objeto de valor imutável
export class TagTypeValue {
    private constructor(value: string) {}
    public static create(value: string): TagTypeValue {}
}
```

#### Repository Interfaces / Interfaces de Repositório
```typescript
// ITagRepository.ts - Interface (contract / contrato)
export interface ITagRepository {
    save(tag: Tag): Promise<Tag>
    findById(id: string): Promise<Tag | null>
}
```

#### Domain Services / Serviços de Domínio
```typescript
// CompanyRulesService.ts
export class CompanyRulesService {
    validateFileCount(companyId: number, fileCount: number): boolean
}
```

---

### Application Layer / Camada de Aplicação

**EN:** Orchestrates use cases:

**PT:** Orquestra os casos de uso:

#### Use Cases / Casos de Uso
```typescript
// ProcessTagFile.ts
export class ProcessTagFile {
    constructor(
        private fileProcessorFactory: IFileProcessorFactory,
        private companyRulesService: CompanyRulesService
    ) {}

    async execute(input: ProcessTagFileInputDTO): Promise<ProcessTagFileOutputDTO> {}
}
```

#### DTOs
```typescript
// ProcessTagFileDTO.ts
export interface ProcessTagFileInputDTO {
    companyCode: number
    files: Express.Multer.File[]
}
```

#### Mappers / Mapeadores
```typescript
// TagMapper.ts
export class TagMapper {
    static toDTO(tag: Tag): TagDTO {}
    static toDomain(dto: TagDTO): Tag {}
    static toPersistence(tag: Tag): Record<string, any> {}
}
```

---

### Infrastructure Layer / Camada de Infraestrutura

**EN:** Technical implementations:

**PT:** Implementações técnicas:

#### Repositories (implementations / implementações)
```typescript
// PrismaTagRepository.ts
export class PrismaTagRepository implements ITagRepository {
    async save(tag: Tag): Promise<Tag> {
        const data = TagMapper.toPersistence(tag)
        return await prisma.etiquetas.create({ data })
    }
}
```

#### Factories / Fábricas
```typescript
// PDFGeneratorFactory.ts
export class PDFGeneratorFactory implements IPDFGeneratorFactory {
    getGenerator(config: { typeTag: string; codeCompany: number }): IPDFGenerator {}
}
```

---

### Presentation Layer / Camada de Apresentação

**EN:** HTTP interface:

**PT:** Interface HTTP:

#### Controllers / Controladores
```typescript
// TagController.ts
export class TagController {
    constructor(private tagRepository: ITagRepository) {}
    
    async list(req: Request, res: Response): Promise<void> {}
}
```

#### Routes / Rotas
```typescript
// tag.routes.ts
export function tagRoutes(): Router {
    router.get('/', (req, res) => tagController.list(req, res))
}
```

---

## Data Flow / Fluxo de Dados

```
Request → Route → Controller → Use Case → Domain Service → Repository → Database
                                    ↓
                               Entity/VO
                                    ↓
Response ← Route ← Controller ← DTO ← Mapper ← Entity
```

---

## Benefits / Benefícios

**EN:**
1. **Testability**: Each layer can be tested in isolation
2. **Maintainability**: Changes in one layer don't affect others
3. **Scalability**: Easy to add new features
4. **Clarity**: Well-defined responsibilities
5. **Flexibility**: Swap implementations without affecting the domain

**PT:**
1. **Testabilidade**: Cada camada pode ser testada isoladamente
2. **Manutenibilidade**: Mudanças em uma camada não afetam outras
3. **Escalabilidade**: Fácil adicionar novas funcionalidades
4. **Clareza**: Responsabilidades bem definidas
5. **Flexibilidade**: Trocar implementações sem afetar o domínio
