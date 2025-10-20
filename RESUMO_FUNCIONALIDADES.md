# 🏢 M&M Conecta Imóveis - Resumo de Funcionalidades e Sistema de Login

## 📱 FUNCIONALIDADES PRINCIPAIS

### 1. 🔐 Sistema de Autenticação e Usuários

#### **Login e Registro**
- ✅ **Registro de novos usuários** (email, senha, nome, telefone)
- ✅ **Login com email e senha**
- ✅ **Hash seguro de senhas** usando bcrypt
- ✅ **3 tipos de usuários**: Cliente, Corretor e Admin

#### **Tipos de Conta**
1. **Cliente (client)** - Padrão para todos os novos registros
   - Pode ver imóveis
   - Pode solicitar agendamentos
   - Pode se tornar lead

2. **Corretor (corretor)** - Promovido pelo Admin
   - Recebe leads automaticamente
   - Gerencia agendamentos
   - Atualiza status de leads
   - Entra na fila de distribuição de leads

3. **Admin (admin)** - Promovido manualmente
   - Gerencia todos os usuários
   - Pode promover/rebaixar usuários
   - Controla ordem dos corretores
   - Gerencia imóveis e conteúdo

---

### 2. 🏠 Gestão de Imóveis

#### **Funcionalidades**
- ✅ **Cadastro de imóveis** com todas as informações
- ✅ **Múltiplas imagens por imóvel**
- ✅ **Marcar imóveis como destaque**
- ✅ **Controle de disponibilidade**
- ✅ **Busca e listagem de imóveis**

#### **Informações do Imóvel**
- Título
- Descrição completa
- Localização
- Preço
- Área (m²)
- Número de quartos
- Número de banheiros
- Tipo de imóvel (Casa, Apartamento, etc.)
- Imagem principal
- Imagens adicionais (galeria)
- Status (Disponível/Indisponível)
- Destaque (Sim/Não)

---

### 3. 📞 Sistema de Leads (Captação de Clientes)

#### **Funcionalidades**
- ✅ **Formulário de contato no site**
- ✅ **Distribuição AUTOMÁTICA para corretores**
- ✅ **Sistema de rodízio justo**
- ✅ **Rastreamento de status do lead**
- ✅ **Histórico completo de distribuição**

#### **Como Funciona o Sistema de Leads**

**Quando um visitante envia o formulário:**
1. Lead é criado no sistema
2. **Sistema automaticamente atribui ao próximo corretor na fila**
3. Corretor recebe o lead
4. Sistema atualiza a posição da fila
5. Próximo lead vai para o próximo corretor

**Status do Lead:**
- `pending` (Pendente) - Recém criado
- `assigned` (Atribuído) - Corretor recebeu
- `contacted` (Contatado) - Corretor já fez contato
- `qualified` (Qualificado) - Lead tem potencial
- `converted` (Convertido) - Virou cliente
- `lost` (Perdido) - Não converteu

**Informações Capturadas:**
- Nome do interessado
- Email
- Telefone
- Localização de interesse
- Tipo de imóvel desejado
- Faixa de preço
- Observações adicionais

---

### 4. 📅 Sistema de Agendamentos

#### **Funcionalidades**
- ✅ **Agendar visitas a imóveis**
- ✅ **Vincular cliente + imóvel + data**
- ✅ **Controle de status da visita**
- ✅ **Notas e observações**

**Status dos Agendamentos:**
- `scheduled` (Agendado)
- `confirmed` (Confirmado)
- `completed` (Realizado)
- `cancelled` (Cancelado)
- `rescheduled` (Reagendado)

---

### 5. 🔄 Sistema de Distribuição de Leads (Rodízio de Corretores)

#### **Como Funciona**

**Sistema de Fila Circular:**
```
Corretor 1 (Posição 1) → Recebe Lead A
Corretor 2 (Posição 2) → Recebe Lead B
Corretor 3 (Posição 3) → Recebe Lead C
Corretor 1 (Posição 1) → Recebe Lead D (volta ao início)
```

**Funcionalidades:**
- ✅ **Ordem configurável de corretores**
- ✅ **Distribuição automática e justa**
- ✅ **Log completo de todas as distribuições**
- ✅ **Contador de leads por corretor**
- ✅ **Data do último lead atribuído**
- ✅ **Ativar/desativar corretores da fila**

**Admin pode:**
- Adicionar corretor à fila
- Remover corretor da fila
- Reorganizar a ordem
- Ver estatísticas de distribuição

---

### 6. 👑 Painel Administrativo

#### **Gerenciamento de Usuários**
- ✅ Promover usuário a Admin
- ✅ Remover privilégios de Admin
- ✅ Promover usuário a Corretor
- ✅ Listar todos os perfis
- ✅ Ver emails de admin

#### **Gerenciamento de Conteúdo**
- ✅ Criar/editar/remover imóveis
- ✅ Upload de múltiplas imagens
- ✅ Marcar imóveis como destaque

#### **Gerenciamento de Leads**
- ✅ Ver todos os leads
- ✅ Reatribuir leads manualmente
- ✅ Deletar leads
- ✅ Atualizar status

#### **Controle da Fila de Corretores**
- ✅ Definir ordem de distribuição
- ✅ Adicionar/remover da fila
- ✅ Ver estatísticas

---

## 🔐 FLUXO DE LOGIN E PERMISSÕES

### **Fluxo de Novo Usuário**

```mermaid
1. Visitante acessa o site
   ↓
2. Clica em "Registrar"
   ↓
3. Preenche: Email, Senha, Nome, Telefone
   ↓
4. Sistema cria conta como "Cliente"
   ↓
5. Usuário faz login
   ↓
6. Acessa área de imóveis
```

### **Fluxo de Promoção a Corretor**

```mermaid
1. Admin acessa painel
   ↓
2. Seleciona usuário para promover
   ↓
3. Clica em "Promover a Corretor"
   ↓
4. Sistema muda role para "corretor"
   ↓
5. Sistema adiciona corretor à fila de distribuição
   ↓
6. Corretor começa a receber leads automaticamente
```

### **Fluxo de Lead Automático**

```mermaid
1. Visitante preenche formulário no site
   ↓
2. Sistema cria lead
   ↓
3. Sistema busca próximo corretor na fila
   ↓
4. Lead é atribuído automaticamente
   ↓
5. Status muda para "assigned"
   ↓
6. Sistema registra distribuição no log
   ↓
7. Corretor pode visualizar e trabalhar o lead
```

---

## 🔑 ENDPOINTS DA API

### **Autenticação**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### **Perfis**
- `GET /api/profiles` - Listar todos
- `GET /api/profiles/:id` - Buscar por ID
- `POST /api/profiles` - Criar perfil
- `PATCH /api/profiles/:id` - Atualizar perfil

### **Imóveis**
- `GET /api/properties` - Listar todos
- `GET /api/properties/:id` - Buscar por ID
- `POST /api/properties` - Criar imóvel
- `PATCH /api/properties/:id` - Atualizar imóvel

### **Leads**
- `GET /api/leads` - Listar todos
- `GET /api/leads/:id` - Buscar por ID
- `POST /api/leads` - Criar lead (distribuição automática)
- `PATCH /api/leads/:id` - Atualizar lead
- `DELETE /api/leads/:id` - Deletar lead
- `POST /api/leads/:id/assign` - Reatribuir lead

### **Agendamentos**
- `GET /api/appointments` - Listar todos
- `GET /api/appointments/:id` - Buscar por ID
- `POST /api/appointments` - Criar agendamento
- `PATCH /api/appointments/:id` - Atualizar agendamento

### **Fila de Corretores**
- `GET /api/broker-order` - Ver ordem atual
- `PATCH /api/broker-order` - Reorganizar ordem
- `POST /api/broker-order/:brokerId` - Adicionar corretor
- `DELETE /api/broker-order/:brokerId` - Remover corretor

### **Corretores**
- `GET /api/brokers` - Listar corretores ativos

### **Admin**
- `POST /api/admin/promote/:userId` - Promover a admin
- `POST /api/admin/demote/:userId` - Rebaixar de admin
- `POST /api/admin/promote-broker/:userId` - Promover a corretor
- `GET /api/admin/emails` - Listar emails de admin

---

## 💾 BANCO DE DADOS

### **Tabelas Principais**

1. **profiles** - Usuários do sistema
2. **properties** - Imóveis
3. **property_images** - Imagens adicionais dos imóveis
4. **leads** - Leads capturados
5. **appointments** - Agendamentos de visitas
6. **broker_order** - Ordem de distribuição dos corretores
7. **lead_distribution_log** - Log de todas as distribuições
8. **admin_emails** - Emails autorizados como admin

---

## 🚀 PRÓXIMOS PASSOS RECOMENDADOS

### **Segurança** (Crítico para Produção)
- [ ] Implementar JWT ou sessions para autenticação stateful
- [ ] Adicionar middleware de autenticação nas rotas protegidas
- [ ] Validar permissões por role (admin, corretor, cliente)
- [ ] Configurar CORS para domínio específico
- [ ] Implementar rate limiting

### **Funcionalidades**
- [ ] Sistema de notificações (email/SMS) quando corretor recebe lead
- [ ] Dashboard com estatísticas para corretores
- [ ] Upload de imagens direto no sistema
- [ ] Filtros e busca avançada de imóveis
- [ ] Chat entre corretor e cliente

### **UX/UI**
- [ ] Painel do corretor para gerenciar seus leads
- [ ] Painel do cliente para ver histórico de contatos
- [ ] Notificações em tempo real

---

## ✅ STATUS ATUAL DO PROJETO

**Backend:**
- ✅ Estrutura completa implementada
- ✅ Banco de dados configurado
- ✅ Todas as rotas funcionando
- ✅ Sistema de distribuição de leads operacional
- ✅ Autenticação básica implementada

**Pronto para Deploy:**
- ✅ Código funcionando
- ✅ Lockfile atualizado (bun.lock)
- ✅ Configuração Railway criada (railway.toml e nixpacks.toml)
- ✅ Build configurado
- ⚠️  Recomenda-se adicionar segurança adicional antes de produção

---

## 🔧 DEPLOY NO RAILWAY

### **Arquivos Criados para Deploy**
1. `railway.toml` - Configuração do Railway
2. `nixpacks.toml` - Configuração do build

### **Variáveis de Ambiente Necessárias no Railway**
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3001
```

### **Comando de Build**
```bash
npm run build
```

### **Comando de Start**
```bash
npm start
```

---

**Documentação Criada por**: Replit Agent
**Data**: 20 de Outubro de 2025
**Versão**: 1.0
