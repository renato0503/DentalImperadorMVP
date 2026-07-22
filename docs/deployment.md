# Guia de Deploy — Dental Imperador

## Sumário
1. [Pré-requisitos](#pré-requisitos)
2. [Deploy Manual](#deploy-manual)
3. [CI/CD Automático](#cicd-automático)
4. [Rollback](#rollback)
5. [Monitoramento](#monitoramento)
6. [Solução de Problemas](#solução-de-problemas)

---

## Pré-requisitos

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Acesso ao projeto Firebase `dentalimperador-d2529`
- Acesso ao repositório GitHub `renato0503/DentalImperador`

### Variáveis de Ambiente

| Variável | Onde configurar | Descrição |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | Conexão PostgreSQL (Data Connect ou local) |
| `GROQ_API_KEY` | Firebase Console > Functions > Secrets | Chave da API Groq |
| `FIREBASE_TOKEN` | GitHub Secrets (`FIREBASE_TOKEN`) | Token de deploy do Firebase (opcional) |

---

## Deploy Manual

### Frontend (Firebase Hosting)

```bash
# 1. Build do frontend
cd frontend
npm run build

# 2. Deploy para Firebase Hosting
cd ..
firebase deploy --only hosting

# URL: https://dentalimperador.web.app
```

### Backend (NestJS)

```bash
cd backend
npm run build

# Opção 1: Cloud Run
gcloud run deploy dental-imperador-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# Opção 2: Servidor próprio
npm run start:prod
```

### Cloud Functions

```bash
# Deploy da callGroq
firebase deploy --only functions

# Ou deploy específico:
firebase deploy --only functions:callGroq
```

### Firestore Rules

```bash
firebase deploy --only firestore:rules
```

---

## CI/CD Automático

### GitHub Actions

O repositório possui 2 workflows:

#### 1. GitHub Pages (protótipo estático)
- **Arquivo:** `.github/workflows/deploy.yml`
- **Gatilho:** push na branch `main`
- **Ação:** Publica raiz do repo na branch `gh-pages`
- **URL:** `https://renato0503.github.io/DentalImperadorMVP/`

#### 2. Firebase Hosting (app React)
- **Arquivo:** `.github/workflows/deploy-firebase.yml`
- **Gatilho:** push na branch `main` (apenas alterações em `frontend/`, `firebase/`)
- **Ação:** Build + Deploy para Firebase Hosting
- **URL:** `https://dentalimperador.web.app`
- **Requer:** `FIREBASE_SERVICE_ACCOUNT_DENTALIMPERADOR_D2529` ou `FIREBASE_TOKEN` no GitHub Secrets

### Setup do CI/CD

#### Opção 1: Service Account (recomendado)
```bash
# 1. Baixar chave JSON no Firebase Console:
#    Config. projeto > Contas de serviço > Gerar nova chave privada

# 2. Codificar em base64:
base64 -w0 firebase-service-account.json

# 3. Adicionar como secret no GitHub:
#    Settings > Secrets and variables > Actions
#    Nome: FIREBASE_SERVICE_ACCOUNT_DENTALIMPERADOR_D2529
#    Valor: (base64 output)
```

#### Opção 2: CI Token (se a org bloquear criação de chaves)
```bash
firebase login:ci
# Copiar o token e adicionar como secret:
# Nome: FIREBASE_TOKEN
```

---

## Rollback

### Firebase Hosting
```bash
# Listar versões anteriores
firebase hosting:channel:list

# Promover versão específica
firebase hosting:channel:deploy live --version <version-id>
```

### Cloud Functions
```bash
# Listar versões
gcloud functions list --project dentalimperador-d2529

# Deploy de versão anterior
firebase deploy --only functions:callGroq --source=<commit-hash>
```

### GitHub Actions
1. Acesse o repositório no GitHub
2. Vá em **Actions** > workflow desejado
3. Selecione o run anterior que estava funcionando
4. Clique em **Re-run all jobs**

---

## Monitoramento

### Google Cloud Monitoring
- **Dashboard:** https://console.cloud.google.com/monitoring
- **Alertas Configurados:**
  - Falha de Cloud Function
  - Latência > 1s
  - Erros 5xx > 1%
  - Uso de Firestore > 80% da cota

### Comandos úteis
```bash
# Ver logs do backend
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dental-imperador-backend" --limit 20

# Ver logs da Cloud Function
firebase functions:log

# Monitorar uso do Firestore
firebase firestore:usage
```

---

## Solução de Problemas

### "GROQ_API_KEY não configurada"
```bash
firebase functions:secrets:set GROQ_API_KEY
# Cole a chave da Groq (https://console.groq.com)
```

### "Prisma não conectou ao PostgreSQL"
```bash
# Verificar se o container está rodando
docker compose ps

# Iniciar banco local
docker compose up -d

# Rodar migrations
cd backend
npx prisma migrate dev
```

### "Firebase deploy: Permissão negada"
```bash
# Reautenticar
firebase login --reauth

# Verificar projeto ativo
firebase projects:list
firebase use dentalimperador-d2529
```

### "Porta 3001 já em uso"
```bash
# PowerShell
Stop-Process -Name node -Force
# OU
netstat -ano | findstr :3001
# Identificar PID e matar
```
