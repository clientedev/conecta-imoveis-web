# 🔧 Solução para Erro do Railway

## ❌ ERRO ENCONTRADO

```
error: undefined variable 'nodejs-20'
```

## ✅ SOLUÇÕES APLICADAS

### **Solução 1: Corrigir nixpacks.toml**
Mudei de `nodejs-20` para `nodejs_20` (underscore em vez de hífen)

### **Solução 2: Simplificar railway.toml**
Removi a referência ao nixpacks.toml customizado para deixar o Railway detectar automaticamente.

### **Solução 3: Deixar Railway auto-detectar** (RECOMENDADO)

Se os erros persistirem, delete estes arquivos e deixe o Railway detectar automaticamente:
- `railway.toml` (opcional)
- `nixpacks.toml` (opcional)

O Railway é inteligente o suficiente para detectar:
- ✅ package.json → sabe que é Node.js
- ✅ bun.lock → vai usar Bun para instalar
- ✅ Scripts de build no package.json

---

## 🚀 COMO FAZER DEPLOY (Método Simplificado)

### **Opção A: Usar configuração atual**

1. **Faça commit das correções:**
```bash
git add .
git commit -m "Fix Railway deployment config"
git push origin main
```

2. **No Railway:**
- O deploy deve funcionar agora com `nodejs_20`

---

### **Opção B: Remover configurações customizadas** (Se Opção A não funcionar)

1. **Delete os arquivos de configuração:**
```bash
rm railway.toml
rm nixpacks.toml
```

2. **Adicione estas variáveis de ambiente no Railway:**
```
NODE_VERSION=20
BUILD_COMMAND=npm run build
START_COMMAND=npm start
```

3. **Faça commit:**
```bash
git add .
git commit -m "Use Railway auto-detection"
git push origin main
```

4. **Railway vai detectar automaticamente:**
- Usa Node.js 20
- Roda `npm install` (ou `bun install` se detectar bun.lock)
- Roda `npm run build`
- Inicia com `npm start`

---

## 📋 CHECKLIST DE DEPLOY

### **No Railway Dashboard:**

1. ✅ **Adicionar PostgreSQL Database**
   - Click "+ New" 
   - Selecione "Database" → "PostgreSQL"
   - Conecte ao seu serviço

2. ✅ **Configurar Variáveis de Ambiente**
   ```
   DATABASE_URL = (gerado automaticamente pelo Railway)
   NODE_ENV = production
   PORT = (gerado automaticamente pelo Railway)
   ```

3. ✅ **Aguardar Deploy**
   - Railway vai fazer build automaticamente
   - Acompanhe os logs em tempo real

4. ✅ **Inicializar Database**
   - Após deploy bem-sucedido
   - No Railway, abra o terminal (CLI)
   - Execute: `npm run db:push`

---

## 🐛 SE O ERRO PERSISTIR

### **Tente esta abordagem:**

**1. Remova TODOS os arquivos de config customizados:**
```bash
rm railway.toml nixpacks.toml
```

**2. Crie um arquivo `.npmrc` na raiz do projeto:**
```
engine-strict=false
```

**3. Atualize package.json para especificar a versão do Node:**
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

**4. Faça commit e push:**
```bash
git add .
git commit -m "Simplify Railway config"
git push origin main
```

---

## 📊 ESTRUTURA CORRETA DO PACKAGE.JSON

Certifique-se que seu `package.json` tem estes scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"vite\"",
    "server": "tsx server/index.ts",
    "build": "vite build",
    "start": "tsx server/index.ts",
    "db:push": "drizzle-kit push"
  }
}
```

**IMPORTANTE:** O script `start` deve iniciar apenas o backend, não o frontend.

---

## ✅ ARQUIVO CORRETO: nixpacks.toml

Se você quiser manter o nixpacks.toml, use esta versão corrigida:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "bun"]

[phases.install]
cmds = ["bun install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

**Nota:** Mudei `nodejs-20` para `nodejs_20` (underscore)

---

## 🎯 RECOMENDAÇÃO FINAL

**Melhor abordagem para Railway:**

1. ✅ **Mantenha apenas o arquivo `package.json`**
2. ✅ **Delete `railway.toml` e `nixpacks.toml`**
3. ✅ **Configure variáveis de ambiente no dashboard**
4. ✅ **Deixe Railway detectar automaticamente**

Isso é mais simples e menos propenso a erros!

---

## 📞 AINDA COM PROBLEMAS?

### **Verifique os logs do Railway:**

1. Acesse seu projeto no Railway
2. Vá em "Deployments"
3. Clique no deployment que falhou
4. Veja os logs detalhados
5. Procure por:
   - `error`
   - `failed`
   - `Cannot find module`

### **Erros comuns e soluções:**

**"Cannot find module"**
→ Certifique-se que todas as dependências estão no package.json

**"Build failed"**
→ Teste localmente primeiro: `npm run build`

**"Database connection failed"**
→ Verifique se DATABASE_URL está configurado

**"Port already in use"**
→ Não precisa configurar PORT, Railway faz automaticamente

---

**Última atualização:** 20 de Outubro de 2025
**Status:** Correções aplicadas ✅
