# FAQ — Suporte Dental Imperador

## Erros Comuns

### "GROQ_API_KEY não configurada"
- **Causa:** A chave da API Groq não foi definida no Firebase
- **Solução:** `firebase functions:secrets:set GROQ_API_KEY` e cole a chave

### "Prisma não conectou ao PostgreSQL"
- **Causa:** PostgreSQL não está rodando
- **Solução:** `docker compose up -d` ou configure `DATABASE_URL` no `.env`

### Erro 401 ao acessar API
- **Causa:** API Key ausente ou inválida (header `x-api-key`)
- **Solução:** Use a chave `demo-key-2026` para testes

### Workflow GitHub Actions falhando
- **Causa:** Secrets do Firebase não configuradas no repositório
- **Solução:** Adicionar `VITE_FIREBASE_*` secrets em Settings > Secrets and Variables > Actions

## Procedimentos

### Deploy manual do frontend
```bash
cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

### Deploy manual do backend
```bash
cd backend && npm run build && npm run start:prod
```

### Rollback de versão
```bash
firebase hosting:channel:deploy live --version <version-id>
```

### Backup do Firestore
```bash
gcloud firestore export gs://dentalimperador-backups/$(date +%Y%m%d)
```

## Contatos

| Área | Contato |
|---|---|
| Suporte Técnico | vendas@dentalimperador.com.br |
| WhatsApp | (65) 3615-0100 |
| Desenvolvimento | Cerrado Tech |
