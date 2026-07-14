Dental Imperador – MVP

Conteúdo: site estático (PWA-friendly) com chatbot mockado.

Para publicar neste repositório GitHub (`renato0503/DentalImperadorMVP`):

1. Inicialize o repositório local (se ainda não existir) e adicione remote:

```powershell
cd "c:\Users\Renato\Documents\DentalImperador"
git init
git remote add origin https://github.com/renato0503/DentalImperadorMVP.git
git add mvp .github/workflows/deploy.yml
git commit -m "Add MVP static site"
git branch -M main
git push -u origin main
```

2. O workflow em `.github/workflows/deploy.yml` publica a pasta `mvp/` para a branch `gh-pages` automaticamente via GitHub Actions.
3. Se quiser conectar ao modelo Groq, adicione um proxy e configure o secret `GROQ_API_KEY` no repositório e atualize `assets/js/app.js` para usar o proxy.

Após o push, aguarde o GitHub Actions rodar; o site ficará disponível em:
`https://renato0503.github.io/DentalImperadorMVP/`
