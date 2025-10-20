# 🚂 Instruções de Deploy no Railway

## ✅ PROBLEMA RESOLVIDO

**Erro Original:**
```
error: lockfile had changes, but lockfile is frozen
```

**Solução Aplicada:**
- ✅ Atualizado `bun.lock` rodando `bun install`
- ✅ Criado `railway.toml` com configurações do Railway
- ✅ Criado `nixpacks.toml` com instruções de build
- ✅ Corrigidos erros de TypeScript no código

---

## 📋 PASSO A PASSO PARA DEPLOY

### 1️⃣ **Configurar Variáveis de Ambiente no Railway**

No painel do Railway, adicione estas variáveis:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
PORT=3001
```

**Como obter DATABASE_URL:**
1. No Railway, adicione um PostgreSQL database ao projeto
2. Railway vai gerar o DATABASE_URL automaticamente
3. Copie e cole nas variáveis de ambiente

### 2️⃣ **Push do Código para o GitHub**

```bash
git add .
git commit -m "Configuração para deploy no Railway"
git push origin main
```

### 3️⃣ **Conectar Railway ao Repositório**

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha seu repositório
5. Railway vai detectar automaticamente as configurações

### 4️⃣ **Configurar Database**

1. No projeto Railway, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde provisionamento
4. A variável `DATABASE_URL` será criada automaticamente
5. Conecte o database ao seu serviço

### 5️⃣ **Deploy Automático**

Railway vai:
1. ✅ Ler `nixpacks.toml` para instruções de build
2. ✅ Instalar dependências com `bun install`
3. ✅ Rodar build com `npm run build`
4. ✅ Iniciar servidor com `npm start`

---

## 📁 ARQUIVOS CRIADOS

### **railway.toml**
```toml
[build]
builder = "nixpacks"

[build.nixpacks]
nixpacksConfigPath = "nixpacks.toml"

[deploy]
startCommand = "npm start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

### **nixpacks.toml**
```toml
[phases.setup]
nixPkgs = ["nodejs-20", "bun"]

[phases.install]
cmds = ["bun install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## 🔍 VERIFICAR DEPLOY

### **Logs do Build**
No Railway, na aba "Deployments", você verá:
- ✅ Setup phase (instala Node.js e Bun)
- ✅ Install phase (bun install)
- ✅ Build phase (npm run build)
- ✅ Start (npm start)

### **Verificar se está funcionando:**
1. Acesse a URL gerada pelo Railway
2. Teste endpoint de saúde: `https://seu-app.railway.app/api/properties`
3. Deve retornar um array (vazio ou com propriedades)

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### **Erro: "Cannot find module"**
**Solução:** Certifique-se que `npm run build` completou com sucesso

### **Erro: "Database connection failed"**
**Solução:** 
1. Verifique se DATABASE_URL está configurado
2. Verifique se o database está conectado ao serviço
3. Execute `npm run db:push` localmente primeiro

### **Erro: "Port already in use"**
**Solução:** Railway define PORT automaticamente, não precisa configurar manualmente

### **Build muito lento**
**Solução:** Normal na primeira vez. Próximos deploys serão mais rápidos com cache.

---

## 🔄 ATUALIZAR APÓS DEPLOY

Sempre que fizer mudanças:

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

Railway vai automaticamente:
1. Detectar o push
2. Rodar novo build
3. Fazer deploy da nova versão

---

## 🗄️ MIGRAÇÃO DO BANCO DE DADOS

### **Primeira vez (Deploy inicial):**
```bash
# No Railway, execute este comando no terminal
npm run db:push
```

Isso vai criar todas as tabelas no banco de dados.

### **Após mudanças no schema:**
```bash
npm run db:generate  # Gera migrations
npm run db:push      # Aplica no banco
```

---

## 📊 MONITORAMENTO

### **Métricas disponíveis no Railway:**
- CPU usage
- Memory usage
- Network traffic
- Deployment history
- Logs em tempo real

### **Acessar logs:**
1. No projeto Railway
2. Clique no serviço
3. Aba "Logs"
4. Filtre por tipo (error, info, etc.)

---

## 💰 CUSTOS

### **Railway Pricing:**
- **Trial:** $5 de crédito grátis (sem cartão)
- **Hobby Plan:** $5/mês (500 horas de execução)
- **Pro Plan:** $20/mês (ilimitado)

### **Database:**
- PostgreSQL incluído no plano
- Backup automático
- SSL habilitado

---

## 🔐 SEGURANÇA

### **Recomendações antes de produção:**

1. **Configure CORS específico:**
```typescript
// Em server/routes.ts
app.use('*', cors({
  origin: 'https://seu-dominio.com'
}));
```

2. **Adicione autenticação JWT:**
- Instale `jsonwebtoken`
- Crie middleware de autenticação
- Proteja rotas sensíveis

3. **Rate Limiting:**
- Instale `hono-rate-limiter`
- Configure limites por IP

4. **Validação adicional:**
- Valide roles antes de operações sensíveis
- Sanitize inputs do usuário

---

## ✅ CHECKLIST PRÉ-DEPLOY

- [x] `bun.lock` atualizado
- [x] `railway.toml` criado
- [x] `nixpacks.toml` criado
- [x] Código sem erros
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] Database PostgreSQL adicionado
- [ ] Código no GitHub
- [ ] Railway conectado ao repositório
- [ ] `npm run db:push` executado
- [ ] Testado endpoints principais

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Push código para GitHub
2. ✅ Conectar Railway ao repositório
3. ✅ Adicionar PostgreSQL database
4. ✅ Configurar variáveis de ambiente
5. ✅ Aguardar primeiro deploy
6. ✅ Executar `npm run db:push` no Railway CLI
7. ✅ Testar aplicação
8. ✅ Configurar domínio personalizado (opcional)

---

## 📞 SUPORTE

**Documentação Railway:**
- [Guia de Deploy](https://docs.railway.app)
- [PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Variáveis de Ambiente](https://docs.railway.app/develop/variables)

**Logs de Error:**
- Sempre verifique os logs do Railway primeiro
- Procure por `error` ou `failed`
- Stack trace completa está nos logs

---

**Sucesso no Deploy! 🚀**
