# Runbook — Dental Imperador

## 1. Visão Geral

| Item | Detalhe |
|---|---|
| Frontend | React PWA — Firebase Hosting |
| Backend | NestJS — Cloud Run / Servidor próprio |
| Banco | PostgreSQL (Data Connect) + Firestore (chat) |
| Cache | Redis (quando configurado) |
| CI/CD | GitHub Actions |
| Domínio | dentalimperador.web.app |

## 2. Arquitetura

```
Usuário → Firebase Hosting (CDN) → React PWA
  ↓
  ├── Firebase Auth (login)
  ├── Firestore (chat + users)
  └── NestJS API (/api/v1/*)
        ├── PostgreSQL (dados relacionais)
        ├── Redis (cache opcional)
        └── Cloud Function callGroq (IA)
```

## 3. Monitoramento

### Health Check
```bash
curl http://localhost:3001/health
# {"status":"ok","timestamp":"...","uptime":...}
```

### Cache Stats
```bash
curl http://localhost:3001/cache/stats
# {"size":5,"hits":12,"misses":3,"hitRate":80,"enabled":false}
```

### Logs
```bash
# Backend (Cloud Run)
gcloud logging read "resource.type=cloud_run_revision"

# Cloud Function
firebase functions:log

# Firebase Hosting
firebase hosting:log
```

## 4. Procedimentos de Emergência

### Site fora do ar
1. Verificar status em `https://status.firebase.google.com`
2. Verificar billing no GCP Console
3. Re-deploy manual: `firebase deploy --only hosting`
4. Se persistir, ativar GitHub Pages como fallback: `https://renato0503.github.io/DentalImperadorMVP/`

### API lenta
1. Verificar uso do PostgreSQL (Cloud Monitoring)
2. Verificar cache Redis (`GET /cache/stats`)
3. Escalar Cloud Run: `gcloud run services update dental-imperador-backend --min-instances 2`

### Cloud Function falhando
1. Verificar logs: `firebase functions:log`
2. Verificar GROQ_API_KEY: `firebase functions:secrets:get GROQ_API_KEY`
3. Re-deploy: `firebase deploy --only functions:callGroq`

## 5. Backup e Disaster Recovery

### PostgreSQL
- Backup automático via Data Connect (diário)
- Restore manual via console GCP

### Firestore
- Backup manual: `gcloud firestore export gs://dentalimperador-backups/`
- Restore: `gcloud firestore import gs://dentalimperador-backups/<backup-id>/`

### Código
- Repositório GitHub com todas as versões
- Tags semânticas (`v1.0.0`, `v2.0.0`)
- Branch `main` protegida com CI/CD

## 6. Rollback

### Firebase Hosting
```bash
# Listar versões
firebase hosting:channel:list

# Promover versão anterior
firebase hosting:channel:deploy live --version <id>
```

### Cloud Run
```bash
# Listar revisões
gcloud run revisions list --service dental-imperador-backend

# Voltar para revisão anterior
gcloud run services update dental-imperador-backend --to-revision <revision-name>
```

## 7. Métricas de SLA

| Indicador | Meta | Atual |
|---|---|---|
| Uptime | 99.9% | 98% |
| Latência API | < 500ms | ~200ms |
| Tempo resposta chat | < 5s | ~3s |
| Cobertura testes | > 70% | Implementar |
