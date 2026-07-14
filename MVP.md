# MVP — Status e pendências

Este arquivo registra tudo que foi feito até agora, o que falta, e os problemas que encontrei ao tentar publicar o site no GitHub Pages.

## O que foi feito
- Scaffold do MVP estático em `mvp/` com: `index.html`, `assets/css/style.css`, `assets/js/app.js` e `mvp/README.md`.
- Workflow de deploy criado em `.github/workflows/deploy.yml` que faz deploy por push para a branch `gh-pages` (abordagem git-based).
- Várias iterações de correção da workflow para evitar ações obsoletas e dependências quebradas.
- Testes locais e commits efetuados; push para `main` realizado. Disparei runs do GitHub Actions para testar o deploy.

## O que falta / próximos passos
- Corrigir definitivamente o deploy automatizado (GitHub Actions) até que o site fique publicado em: `https://renato0503.github.io/DentalImperadorMVP/`.
- Confirmar que todos os arquivos do `mvp/` estão versionados em `main` (devem estar) e que a workflow copia/resgata corretamente antes de trocar para `gh-pages`.
- Verificar e remover ações obsoletas caso surjam outros erros transitivos no Actions runner.

## Problemas de commit / deploy encontrados
- Várias runs falharam por dependências de ações obsoletas (ex.: `actions/upload-artifact@v3` e transitive deps). Por isso mudei para um deploy por git direto.
- Erro crítico observado no runner: a workflow fazia `git checkout gh-pages` seguido de `git rm -rf .` antes de copiar os arquivos de `mvp/`, e aí a cópia falhava porque o diretório `mvp/` não estava presente no working tree naquele momento.
  - Causa: ao alternar para `gh-pages` o conteúdo do `main` foi removido do working tree — o job precisava preservar os arquivos do `main` antes de trocar de branch.
  - Mitigação aplicada: atualizei o workflow para primeiro copiar `mvp/` para um diretório temporário (`mktemp -d`), depois criar/limpar `gh-pages` e restaurar os arquivos desse diretório temporário antes de commitar/push.
- Alguns runs continuam em andamento; estou monitorando e ajustarei se surgir outro erro.

## Onde estão os outros arquivos `.md` (context.md, implementation.md, contrato_de_acordo_comercial.md, etc.)
- Na raiz do workspace atualmente só existem:
  - `README.md`
  - `mvp/README.md`
- Os arquivos `context.md`, `implementation.md`, `contrato_de_acordo_comercial.md` e `MVP.md` mencionados anteriormente não existem nesta cópia do repositório — por isso não foram lidos/atualizados. Se você tem versões locais desses arquivos em outro lugar, por favor coloque-os na raiz do repositório ou envie-os aqui para eu adicioná-los.

## Observações finais e pedido de autorização
- Atualizei o workflow e disparei um novo run; estou monitorando. Se quiser, eu:
  1) espero o run terminar e trago o log/resultado, ou
  2) aplico ajustes adicionais (ex.: checkout de `main` em um segundo path antes de trocar para `gh-pages`) proativamente.

---
Atualizado pelo agente em: 2026-07-13
