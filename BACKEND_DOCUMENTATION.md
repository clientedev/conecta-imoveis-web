# 📋 Documentação Completa do Backend - M&M Conecta Imóveis

## 🏗️ Arquitetura do Backend

### Tecnologias Utilizadas
- **Framework**: Hono (servidor web leve e rápido)
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: bcrypt para hash de senhas
- **Validação**: Zod para validação de dados
- **Runtime**: Node.js com suporte a Bun

### Estrutura de Pastas
```
server/
├── index.ts        # Ponto de entrada do servidor
├── routes.ts       # Todas as rotas da API
├── storage.ts      # Camada de acesso ao banco de dados
└── db.ts          # Configuração do banco de dados

shared/
└── schema.ts      # Schemas do banco de dados e tipos TypeScript
```

---

## 🔐 Sistema de Autenticação

### 1. Login (`POST /api/auth/login`)
**Descrição**: Autentica um usuário existente

**Corpo da Requisição**:
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com"
  },
  "profile": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "fullName": "Nome Completo",
    "phone": "11999999999",
    "role": "client",
    "is_admin": false,
    "user_type": "client",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Erros**:
- `400`: Email ou senha não fornecidos
- `401`: Credenciais inválidas
- `500`: Erro no servidor

### 2. Registro (`POST /api/auth/register`)
**Descrição**: Cria uma nova conta de usuário (sempre como "client")

**Corpo da Requisição**:
```json
{
  "email": "novo@exemplo.com",
  "password": "senha123",
  "fullName": "Nome Completo",
  "phone": "11999999999"
}
```

**Resposta de Sucesso (201)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "novo@exemplo.com"
  },
  "profile": {
    "id": "uuid",
    "email": "novo@exemplo.com",
    "fullName": "Nome Completo",
    "phone": "11999999999",
    "role": "client",
    "is_admin": false,
    "user_type": "client"
  }
}
```

**Erros**:
- `400`: Dados obrigatórios faltando ou email já cadastrado
- `500`: Erro no servidor

**Segurança**:
- Senhas são hashadas com bcrypt (salt rounds: 10)
- Senhas nunca são retornadas nas respostas
- Validação de email duplicado

---

## 👥 Gestão de Perfis

### Tipos de Usuário (Roles)
1. **client**: Cliente normal (padrão no registro)
2. **corretor**: Corretor de imóveis (broker)
3. **admin**: Administrador do sistema

### Endpoints de Perfis

#### 1. Listar Todos os Perfis (`GET /api/profiles`)
Retorna todos os perfis cadastrados no sistema.

#### 2. Buscar Perfil por ID (`GET /api/profiles/:id`)
Retorna um perfil específico.

#### 3. Criar Perfil (`POST /api/profiles`)
Cria um novo perfil (uso interno/admin).

#### 4. Atualizar Perfil (`PATCH /api/profiles/:id`)
Atualiza informações de um perfil existente.

---

## 🏠 Gestão de Imóveis (Properties)

### Modelo de Dados
- `id`: UUID único
- `title`: Título do imóvel
- `description`: Descrição detalhada
- `location`: Localização
- `price`: Preço (numérico com 2 decimais)
- `area`: Área do imóvel
- `bedrooms`: Número de quartos
- `bathrooms`: Número de banheiros
- `propertyType`: Tipo do imóvel
- `imageUrl`: URL da imagem principal
- `featured`: Se é destaque
- `isAvailable`: Se está disponível
- `additionalImages`: Array de URLs de imagens adicionais

### Endpoints

#### 1. Listar Imóveis (`GET /api/properties`)
**Descrição**: Retorna todos os imóveis ordenados por data de criação (mais recentes primeiro)

**Resposta**:
```json
[
  {
    "id": "uuid",
    "title": "Apartamento Moderno",
    "description": "Apartamento com 3 quartos...",
    "location": "São Paulo - SP",
    "price": "350000.00",
    "area": "80m²",
    "bedrooms": 3,
    "bathrooms": 2,
    "propertyType": "Apartamento",
    "imageUrl": "https://...",
    "featured": true,
    "isAvailable": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### 2. Buscar Imóvel por ID (`GET /api/properties/:id`)
Retorna um imóvel específico com todas as suas informações.

#### 3. Criar Imóvel (`POST /api/properties`)
**Corpo da Requisição**:
```json
{
  "title": "Casa na Praia",
  "description": "Linda casa...",
  "location": "Guarujá - SP",
  "price": "850000.00",
  "area": "200m²",
  "bedrooms": 4,
  "bathrooms": 3,
  "propertyType": "Casa",
  "imageUrl": "https://imagem-principal.jpg",
  "featured": false,
  "additionalImages": [
    "https://imagem1.jpg",
    "https://imagem2.jpg"
  ]
}
```

#### 4. Atualizar Imóvel (`PATCH /api/properties/:id`)
Atualiza informações de um imóvel existente.

---

## 📞 Gestão de Leads

### Sistema de Distribuição Automática
O sistema possui um mecanismo de distribuição automática de leads para corretores:
- Leads são automaticamente atribuídos ao próximo corretor na ordem
- Sistema de rodízio justo entre corretores ativos
- Log de distribuição para auditoria

### Status dos Leads
1. `pending`: Aguardando atendimento
2. `assigned`: Atribuído a um corretor
3. `contacted`: Corretor entrou em contato
4. `qualified`: Lead qualificado
5. `converted`: Convertido em cliente
6. `lost`: Lead perdido

### Endpoints

#### 1. Listar Leads (`GET /api/leads`)
**Descrição**: Retorna todos os leads com informações do corretor responsável

**Resposta**:
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "locationInterest": "São Paulo",
    "propertyType": "Apartamento",
    "priceRange": "R$ 300.000 - R$ 500.000",
    "observations": "Interessado em 2-3 quartos",
    "status": "assigned",
    "handledBy": "uuid-corretor",
    "handledAt": "2025-01-01T10:00:00.000Z",
    "createdAt": "2025-01-01T09:00:00.000Z",
    "handledByProfile": {
      "fullName": "Maria Corretora",
      "email": "maria@corretor.com"
    }
  }
]
```

#### 2. Buscar Lead por ID (`GET /api/leads/:id`)
Retorna um lead específico.

#### 3. Criar Lead (`POST /api/leads`)
**Descrição**: Cria um novo lead e automaticamente atribui a um corretor

**Corpo da Requisição**:
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "locationInterest": "São Paulo",
  "propertyType": "Apartamento",
  "priceRange": "R$ 300.000 - R$ 500.000",
  "observations": "Preferência por área central"
}
```

**Funcionalidade Automática**:
- Após criação, o lead é automaticamente atribuído ao próximo corretor na fila
- Status muda automaticamente para "assigned"
- Registro de distribuição é criado no log

#### 4. Atualizar Lead (`PATCH /api/leads/:id`)
Atualiza status e informações do lead.

#### 5. Deletar Lead (`DELETE /api/leads/:id`)
Remove um lead do sistema.

#### 6. Atribuir Lead Manualmente (`POST /api/leads/:id/assign`)
**Descrição**: Atribui ou reatribui um lead ao próximo corretor na ordem

---

## 📅 Gestão de Agendamentos (Appointments)

### Status dos Agendamentos
1. `scheduled`: Agendado
2. `confirmed`: Confirmado
3. `completed`: Realizado
4. `cancelled`: Cancelado
5. `rescheduled`: Reagendado

### Endpoints

#### 1. Listar Agendamentos (`GET /api/appointments`)
**Descrição**: Retorna todos os agendamentos com dados do cliente e imóvel

**Resposta**:
```json
[
  {
    "id": "uuid",
    "clientId": "uuid",
    "propertyId": "uuid",
    "appointmentDate": "2025-01-15T14:00:00.000Z",
    "status": "scheduled",
    "notes": "Cliente quer ver a área de lazer",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "client": {
      "fullName": "João Silva",
      "phone": "11999999999"
    },
    "property": {
      "title": "Apartamento Moderno",
      "location": "São Paulo"
    }
  }
]
```

#### 2. Buscar Agendamento (`GET /api/appointments/:id`)
Retorna um agendamento específico.

#### 3. Criar Agendamento (`POST /api/appointments`)
**Corpo da Requisição**:
```json
{
  "clientId": "uuid",
  "propertyId": "uuid",
  "appointmentDate": "2025-01-15T14:00:00.000Z",
  "status": "scheduled",
  "notes": "Observações adicionais"
}
```

#### 4. Atualizar Agendamento (`PATCH /api/appointments/:id`)
Atualiza status ou informações do agendamento.

---

## 🔄 Sistema de Ordem de Corretores (Broker Order)

### Funcionalidade
Sistema de rodízio para distribuição justa de leads entre corretores.

### Endpoints

#### 1. Ver Ordem dos Corretores (`GET /api/broker-order`)
**Descrição**: Retorna a ordem atual de corretores

**Resposta**:
```json
[
  {
    "id": 1,
    "brokerId": "uuid",
    "orderPosition": 1,
    "isActive": true,
    "lastAssigned": "2025-01-01T10:00:00.000Z",
    "totalLeadsAssigned": 15,
    "broker": {
      "fullName": "Maria Corretora",
      "email": "maria@corretor.com",
      "phone": "11988888888"
    }
  }
]
```

#### 2. Atualizar Ordem (`PATCH /api/broker-order`)
**Descrição**: Reorganiza a ordem dos corretores

**Corpo da Requisição**:
```json
{
  "orders": [
    { "id": 1, "orderPosition": 2 },
    { "id": 2, "orderPosition": 1 }
  ]
}
```

#### 3. Adicionar Corretor à Ordem (`POST /api/broker-order/:brokerId`)
Adiciona um corretor ao sistema de rodízio.

#### 4. Remover Corretor da Ordem (`DELETE /api/broker-order/:brokerId`)
Remove um corretor do sistema de rodízio.

---

## 👨‍💼 Gestão de Corretores

### Endpoint

#### Listar Corretores Ativos (`GET /api/brokers`)
**Descrição**: Retorna todos os usuários com role "corretor" e ativos

**Resposta**:
```json
[
  {
    "id": "uuid",
    "fullName": "Maria Corretora",
    "email": "maria@corretor.com",
    "phone": "11988888888",
    "role": "corretor",
    "isActive": true
  }
]
```

---

## 👑 Funcionalidades de Administração

### Endpoints

#### 1. Promover a Admin (`POST /api/admin/promote/:userId`)
**Descrição**: Promove um usuário para administrador
- Altera role para "admin"

#### 2. Rebaixar de Admin (`POST /api/admin/demote/:userId`)
**Descrição**: Remove privilégios de admin
- Altera role para "client"

#### 3. Promover a Corretor (`POST /api/admin/promote-broker/:userId`)
**Descrição**: Promove um usuário para corretor
- Altera role para "corretor"
- Adiciona automaticamente à fila de distribuição de leads

#### 4. Listar Emails de Admin (`GET /api/admin/emails`)
**Descrição**: Retorna lista de emails autorizados como admin

---

## 💾 Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **profiles** (Perfis de Usuários)
```sql
- id: UUID (primary key)
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255)
- fullName: VARCHAR(255)
- phone: VARCHAR(20)
- role: ENUM('admin', 'corretor', 'client')
- isActive: BOOLEAN
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### 2. **properties** (Imóveis)
```sql
- id: UUID (primary key)
- title: VARCHAR(255)
- description: TEXT
- location: VARCHAR(255)
- price: NUMERIC(12, 2)
- area: VARCHAR(100)
- bedrooms: INTEGER
- bathrooms: INTEGER
- propertyType: VARCHAR(100)
- imageUrl: TEXT
- featured: BOOLEAN
- isAvailable: BOOLEAN
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### 3. **property_images** (Imagens Adicionais)
```sql
- id: UUID (primary key)
- propertyId: UUID (foreign key → properties.id)
- imageUrl: TEXT
- imageOrder: INTEGER
- createdAt: TIMESTAMP
```

#### 4. **leads** (Leads)
```sql
- id: UUID (primary key)
- name: VARCHAR(255)
- email: VARCHAR(255)
- phone: VARCHAR(20)
- locationInterest: VARCHAR(255)
- propertyType: VARCHAR(100)
- priceRange: VARCHAR(100)
- observations: TEXT
- status: ENUM('pending', 'assigned', 'contacted', 'qualified', 'converted', 'lost')
- handledBy: UUID (foreign key → profiles.id)
- handledAt: TIMESTAMP
- createdAt: TIMESTAMP
```

#### 5. **appointments** (Agendamentos)
```sql
- id: UUID (primary key)
- clientId: UUID (foreign key → profiles.id)
- propertyId: UUID (foreign key → properties.id)
- appointmentDate: TIMESTAMP
- status: ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')
- notes: TEXT
- createdAt: TIMESTAMP
```

#### 6. **broker_order** (Ordem de Corretores)
```sql
- id: SERIAL (primary key)
- brokerId: UUID (foreign key → profiles.id)
- orderPosition: INTEGER
- isActive: BOOLEAN
- lastAssigned: TIMESTAMP
- totalLeadsAssigned: INTEGER
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### 7. **lead_distribution_log** (Log de Distribuição)
```sql
- id: SERIAL (primary key)
- leadId: UUID (foreign key → leads.id)
- brokerId: UUID (foreign key → profiles.id)
- assignedAt: TIMESTAMP
- orderPosition: INTEGER
```

#### 8. **admin_emails** (Emails de Admin)
```sql
- id: UUID (primary key)
- email: VARCHAR(255)
- createdAt: TIMESTAMP
```

---

## 🚀 Fluxos de Trabalho Principais

### Fluxo de Registro e Login
1. Cliente se registra (`POST /api/auth/register`)
2. Sistema cria perfil com role "client"
3. Senha é hashada com bcrypt
4. Cliente faz login (`POST /api/auth/login`)
5. Sistema valida credenciais e retorna perfil

### Fluxo de Lead
1. Visitante preenche formulário no site
2. Lead é criado (`POST /api/leads`)
3. Sistema automaticamente atribui ao próximo corretor
4. Corretor recebe notificação (a implementar)
5. Corretor atualiza status conforme progresso
6. Lead é convertido ou marcado como perdido

### Fluxo de Agendamento
1. Cliente visualiza imóvel
2. Cliente solicita visita
3. Agendamento é criado (`POST /api/appointments`)
4. Status acompanha o progresso da visita
5. Após visita, status é atualizado

---

## 🔒 Segurança Implementada

### Autenticação
- ✅ Hash de senhas com bcrypt (10 rounds)
- ✅ Senhas nunca expostas nas respostas
- ✅ Validação de email duplicado

### Validação de Dados
- ✅ Validação com Zod schemas
- ✅ Tipos TypeScript em todo o código
- ✅ Validação de dados obrigatórios

### Banco de Dados
- ✅ Prepared statements (proteção contra SQL injection)
- ✅ Relações de chaves estrangeiras
- ✅ Timestamps automáticos

---

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run server       # Apenas servidor backend
npm run dev:frontend # Apenas frontend
```

### Banco de Dados
```bash
npm run db:generate  # Gera migrations
npm run db:migrate   # Executa migrations
npm run db:push      # Push schema para o banco
npm run db:studio    # Abre Drizzle Studio (interface visual)
```

### Build e Deploy
```bash
npm run build        # Build para produção
npm start            # Inicia servidor de produção
```

---

## 📊 Métricas e Logs

### Sistema de Distribuição de Leads
- Total de leads atribuídos por corretor
- Última vez que corretor recebeu lead
- Posição na fila de distribuição
- Log completo de todas as distribuições

### Auditoria
- Todas as atribuições de leads são registradas
- Timestamps de criação e atualização em todas as tabelas
- Histórico de mudanças de status

---

## 🌐 Configuração de CORS

O servidor aceita requisições de qualquer origem (`cors()` habilitado em todas as rotas).

**Produção**: Recomenda-se configurar CORS para aceitar apenas domínios específicos.

---

## 📝 Notas Importantes

### Para Deploy em Produção
1. Configure `DATABASE_URL` com URL do PostgreSQL
2. Configure `NODE_ENV=production`
3. Configure `PORT` (padrão: 3001)
4. Execute `npm run build` antes do deploy
5. Use `npm start` para produção

### Segurança em Produção
- [ ] Implementar JWT ou sessions para autenticação stateful
- [ ] Configurar CORS para domínios específicos
- [ ] Implementar rate limiting
- [ ] Adicionar middleware de autenticação nas rotas protegidas
- [ ] Configurar SSL no banco de dados
- [ ] Implementar logs de auditoria
- [ ] Adicionar validação de permissões por role

---

**Versão da Documentação**: 1.0
**Última Atualização**: 20 de Outubro de 2025
