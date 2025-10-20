# 🏢 M&M Conecta Imóveis - Deploy Railway

## ✅ ERRO RESOLVIDO!

**Problema:** `error: undefined variable 'nodejs-20'`

**Solução:** Deletei o arquivo `nixpacks.toml` que estava causando o erro. Agora o Railway vai detectar automaticamente tudo que precisa!

---

## 🚀 QUICK START (3 Passos)

### **1️⃣ Push para GitHub**
```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### **2️⃣ Railway Setup**
1. Vá em https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório
4. "+ New" → "Database" → "PostgreSQL"
5. Conecte o database ao serviço

### **3️⃣ Criar Tabelas do Banco**

**Adicione temporariamente ao `package.json`:**
```json
"postinstall": "npm run db:push"
```

**Push novamente:**
```bash
git add package.json
git commit -m "Init database"
git push
```

**Depois remova e faça push de novo!**

---

## 📚 Documentação Completa

| Arquivo | Conteúdo |
|---------|----------|
| **`COMECE_AQUI.md`** | 👈 **Guia passo a passo detalhado** |
| `RESUMO_FUNCIONALIDADES.md` | Todas as funcionalidades do sistema |
| `BACKEND_DOCUMENTATION.md` | Documentação técnica da API |
| `DEPLOY_RAILWAY_SIMPLES.md` | Troubleshooting e dicas |

---

## ⚠️ IMPORTANTE: Tabelas do Banco

**As tabelas NÃO são criadas automaticamente!**

Você PRECISA executar `npm run db:push` após o deploy.

**3 formas de fazer:**

1. **Script temporário** (mais fácil) - explicado no `COMECE_AQUI.md`
2. **Railway CLI** - `railway run npm run db:push`
3. **Shell do Railway** - acessar terminal e rodar comando

---

## 📊 Status do Projeto

- ✅ Backend completo e funcional
- ✅ Sistema de leads com distribuição automática
- ✅ Autenticação e 3 níveis de usuário
- ✅ 8 tabelas no banco de dados
- ✅ Pronto para deploy no Railway

---

**Leia o arquivo `COMECE_AQUI.md` para instruções detalhadas!** 📖
