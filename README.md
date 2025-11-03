# 🏢 M&M Conecta Imóveis

Sistema completo de gestão imobiliária com distribuição automática de leads, agendamento de visitas e gestão de corretores.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## 📋 Sobre o Projeto

M&M Conecta Imóveis é uma plataforma completa para gestão de imobiliárias que conecta clientes, corretores e administradores em um único sistema. O projeto oferece uma solução moderna e eficiente para gerenciar todo o ciclo de vendas imobiliárias, desde a captação de leads até o fechamento de negócios.

### ✨ Principais Funcionalidades

#### 🎯 Sistema de Distribuição Automática de Leads
- **Distribuição Round-Robin**: Leads são automaticamente distribuídos entre corretores de forma justa e equilibrada
- **Fila de Corretores Configurável**: Administradores podem organizar a ordem de atendimento
- **Rastreamento Completo**: Histórico detalhado de cada lead atribuído
- **Métricas de Performance**: Acompanhamento de leads por corretor
- **Atribuição Inteligente**: Sistema considera disponibilidade e carga de trabalho

#### 🏠 Gestão de Imóveis
- **Cadastro Completo**: Título, descrição, localização, preço, área, quartos e banheiros
- **Galeria de Imagens**: Suporte para múltiplas fotos por imóvel
- **Tipos de Propriedade**: Casa, apartamento, terreno, comercial, etc.
- **Imóveis em Destaque**: Marque propriedades especiais para maior visibilidade
- **Controle de Disponibilidade**: Status de disponível/vendido/alugado
- **Busca e Filtros**: Encontre imóveis por localização, preço, tipo e características

#### 📅 Agendamento de Visitas
- **Sistema de Agendamentos**: Clientes podem agendar visitas aos imóveis
- **Gestão de Horários**: Controle de disponibilidade para visitas
- **Status de Agendamentos**: Agendado, confirmado, realizado, cancelado ou reagendado
- **Notificações**: Alertas para corretores e clientes
- **Histórico**: Registro completo de todas as visitas

#### 👥 Gestão de Usuários Multi-Perfil

##### 🔑 Administrador
- Visão completa do sistema
- Gerenciamento de todos os imóveis
- Controle total sobre leads e distribuição
- Gestão de usuários (promover/rebaixar)
- Configuração da fila de corretores
- Acesso a relatórios e métricas
- Gerenciamento de emails administrativos

##### 💼 Corretor (Broker)
- Visualização de leads atribuídos
- Atualização de status de leads
- Gestão de agendamentos
- Visualização de imóveis disponíveis
- Acompanhamento de pipeline de vendas
- Histórico de atendimentos

##### 👤 Cliente
- Navegação por imóveis disponíveis
- Visualização detalhada de propriedades
- Solicitação de informações (geração de leads)
- Agendamento de visitas
- Acompanhamento de solicitações

#### 📊 Dashboard e Relatórios
- Estatísticas em tempo real
- Leads por status (pendente, atribuído, contatado, qualificado, convertido, perdido)
- Performance de corretores
- Imóveis mais visualizados
- Taxa de conversão
- Funil de vendas

#### 🔐 Autenticação e Segurança
- Sistema de login seguro com senha criptografada (bcrypt)
- Controle de acesso baseado em perfis
- Proteção de rotas por permissão
- Gestão de sessões
- Validação de dados com Zod

#### 📱 Integração WhatsApp
- Botões diretos para contato via WhatsApp
- Templates de mensagens personalizadas
- Integração com imóveis e leads

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática para JavaScript
- **Vite**: Build tool moderna e rápida
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI modernos e acessíveis
- **React Router**: Navegação entre páginas
- **React Query**: Gerenciamento de estado assíncrono
- **Lucide React**: Ícones modernos
- **Zod**: Validação de schemas
- **React Hook Form**: Gerenciamento de formulários

### Backend
- **Hono**: Framework web minimalista e rápido
- **TypeScript**: Desenvolvimento type-safe
- **Node.js**: Runtime JavaScript
- **Drizzle ORM**: ORM moderno para PostgreSQL
- **bcrypt**: Criptografia de senhas
- **Zod**: Validação de dados

### Banco de Dados
- **PostgreSQL**: Banco de dados relacional robusto
- **Drizzle Kit**: Migrations e gerenciamento de schema

### DevOps & Ferramentas
- **ESLint**: Linting de código
- **Concurrently**: Execução paralela de scripts
- **tsx**: Execução de TypeScript

## 📁 Estrutura do Projeto

```
m&m-conecta-imoveis/
├── src/                          # Frontend React
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── Header.tsx          # Cabeçalho da aplicação
│   │   ├── Footer.tsx          # Rodapé
│   │   └── ...
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Index.tsx           # Página inicial
│   │   ├── Properties.tsx      # Lista de imóveis
│   │   ├── PropertyDetail.tsx  # Detalhes do imóvel
│   │   ├── Dashboard.tsx       # Dashboard administrativo
│   │   ├── Login.tsx           # Página de login
│   │   └── ...
│   ├── contexts/                # Contextos React
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── lib/                     # Bibliotecas e utilitários
│   │   ├── api.ts              # Cliente API
│   │   └── utils.ts            # Funções utilitárias
│   ├── hooks/                   # Hooks customizados
│   └── App.tsx                  # Componente principal
│
├── server/                       # Backend Hono
│   ├── index.ts                # Entry point do servidor
│   ├── routes.ts               # Definição de rotas API
│   ├── storage.ts              # Camada de acesso a dados
│   ├── db.ts                   # Configuração do banco
│   └── migrate.ts              # Script de migração
│
├── shared/                       # Código compartilhado
│   └── schema.ts               # Schema Drizzle ORM
│
├── public/                       # Arquivos estáticos
├── drizzle.config.ts            # Configuração Drizzle
├── vite.config.ts               # Configuração Vite
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
└── package.json                 # Dependências e scripts
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `profiles` - Perfis de Usuários
- **id**: UUID único
- **email**: Email do usuário (único)
- **password**: Senha criptografada
- **full_name**: Nome completo
- **phone**: Telefone
- **role**: Perfil (admin, corretor, client)
- **is_active**: Status ativo/inativo
- **created_at / updated_at**: Timestamps

#### `properties` - Imóveis
- **id**: UUID único
- **title**: Título do imóvel
- **description**: Descrição completa
- **location**: Localização
- **price**: Preço (decimal)
- **area**: Área em m²
- **bedrooms**: Número de quartos
- **bathrooms**: Número de banheiros
- **property_type**: Tipo (casa, apartamento, etc)
- **image_url**: URL da imagem principal
- **featured**: Destaque (sim/não)
- **is_available**: Disponível (sim/não)
- **created_at / updated_at**: Timestamps

#### `property_images` - Galeria de Imagens
- **id**: UUID único
- **property_id**: Referência ao imóvel
- **image_url**: URL da imagem
- **image_order**: Ordem de exibição
- **created_at**: Timestamp

#### `leads` - Leads/Interessados
- **id**: UUID único
- **name**: Nome do interessado
- **email**: Email
- **phone**: Telefone
- **location_interest**: Localização de interesse
- **property_type**: Tipo de imóvel desejado
- **price_range**: Faixa de preço
- **observations**: Observações
- **status**: Status (pending, assigned, contacted, qualified, converted, lost)
- **handled_by**: ID do corretor responsável
- **handled_at**: Data de atribuição
- **created_at**: Timestamp

#### `appointments` - Agendamentos
- **id**: UUID único
- **client_id**: ID do cliente
- **property_id**: ID do imóvel
- **appointment_date**: Data e hora do agendamento
- **status**: Status (scheduled, confirmed, completed, cancelled, rescheduled)
- **notes**: Observações
- **created_at**: Timestamp

#### `broker_order` - Fila de Corretores
- **id**: Serial
- **broker_id**: ID do corretor
- **order_position**: Posição na fila
- **is_active**: Ativo na fila
- **last_assigned**: Data da última atribuição
- **total_leads_assigned**: Total de leads atribuídos
- **created_at / updated_at**: Timestamps

#### `lead_distribution_log` - Histórico de Distribuição
- **id**: Serial
- **lead_id**: ID do lead
- **broker_id**: ID do corretor
- **assigned_at**: Data de atribuição
- **order_position**: Posição na fila no momento

#### `admin_emails` - Emails Administrativos
- **id**: UUID único
- **email**: Email autorizado
- **created_at**: Timestamp

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/m-m-conecta-imoveis.git
cd m-m-conecta-imoveis
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# O sistema usa as seguintes variáveis (configuradas automaticamente no Replit):
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=seu_usuario
PGPASSWORD=sua_senha
PGDATABASE=nome_do_banco
```

4. Execute as migrações do banco de dados:
```bash
npm run db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5000`
O backend estará disponível em: `http://localhost:3001`

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend + backend
npm run dev:frontend     # Apenas frontend (Vite)
npm run server          # Apenas backend (Hono)

# Build
npm run build           # Build de produção
npm run build:dev       # Build em modo desenvolvimento

# Produção
npm start               # Inicia servidor de produção

# Banco de Dados
npm run db:push         # Aplica mudanças no schema
npm run db:push --force # Força aplicação de mudanças
npm run db:studio       # Abre Drizzle Studio (GUI)
npm run db:generate     # Gera migrations
npm run db:migrate      # Executa migrations

# Qualidade de Código
npm run lint            # Executa ESLint
npm run preview         # Preview do build
```

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário

### Perfis
- `GET /api/profiles` - Lista todos os perfis
- `GET /api/profiles/:id` - Busca perfil específico
- `POST /api/profiles` - Cria novo perfil
- `PATCH /api/profiles/:id` - Atualiza perfil

### Imóveis
- `GET /api/properties` - Lista todos os imóveis
- `GET /api/properties/:id` - Busca imóvel específico
- `POST /api/properties` - Cria novo imóvel
- `PATCH /api/properties/:id` - Atualiza imóvel

### Leads
- `GET /api/leads` - Lista todos os leads
- `GET /api/leads/:id` - Busca lead específico
- `POST /api/leads` - Cria novo lead (com auto-atribuição)
- `PATCH /api/leads/:id` - Atualiza lead
- `DELETE /api/leads/:id` - Remove lead
- `POST /api/leads/:id/assign` - Atribui lead manualmente

### Agendamentos
- `GET /api/appointments` - Lista agendamentos
- `GET /api/appointments/:id` - Busca agendamento específico
- `POST /api/appointments` - Cria agendamento
- `PATCH /api/appointments/:id` - Atualiza agendamento

### Corretores
- `GET /api/brokers` - Lista corretores ativos
- `GET /api/broker-order` - Lista fila de corretores
- `PATCH /api/broker-order` - Atualiza ordem da fila
- `POST /api/broker-order/:brokerId` - Adiciona corretor à fila
- `DELETE /api/broker-order/:brokerId` - Remove corretor da fila

### Administração
- `POST /api/admin/promote/:userId` - Promove usuário a admin
- `POST /api/admin/demote/:userId` - Remove admin de usuário
- `POST /api/admin/promote-broker/:userId` - Promove usuário a corretor
- `GET /api/admin/emails` - Lista emails administrativos

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt (salt rounds: 10)
- ✅ Validação de dados com Zod em todas as requisições
- ✅ Proteção contra SQL injection (via Drizzle ORM)
- ✅ CORS configurado
- ✅ Validação de tipos com TypeScript
- ✅ Controle de acesso baseado em perfis
- ✅ Variáveis de ambiente para dados sensíveis

## 📱 Recursos Mobile-Friendly

- Design responsivo com Tailwind CSS
- Componentes otimizados para touch
- Layout adaptável para todos os tamanhos de tela
- Performance otimizada para conexões móveis

## 🎨 Design System

O projeto utiliza shadcn/ui, que oferece:
- Componentes acessíveis (ARIA compliant)
- Tema customizável
- Dark mode (suporte futuro)
- Design consistente
- Animações suaves

## 🔄 Fluxo de Trabalho

### Fluxo de Lead
1. Cliente visita o site e preenche formulário de interesse
2. Lead é criado automaticamente no sistema
3. Sistema identifica próximo corretor na fila
4. Lead é atribuído automaticamente ao corretor
5. Corretor recebe notificação (futuro)
6. Corretor entra em contato e atualiza status
7. Lead progride pelo funil: Contatado → Qualificado → Convertido

### Fluxo de Agendamento
1. Cliente navega pelos imóveis
2. Cliente solicita visita a um imóvel
3. Sistema cria agendamento pendente
4. Corretor confirma horário
5. Visita é realizada
6. Status é atualizado para concluído

## 🚀 Deploy

### Railway (Recomendado)
1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Railway configura automaticamente a porta via `PORT`

### Replit Autoscale
1. Projeto já está configurado
2. Build command: `npm run build`
3. Start command: `npm start`
4. Clique em "Deploy" no Replit

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autores

M&M Conecta Imóveis - Plataforma de Gestão Imobiliária

## 📞 Suporte

Para suporte, entre em contato através do formulário no site ou envie um email para contato@mmconectaimoveis.com

---

Desenvolvido com ❤️ para revolucionar a gestão imobiliária
