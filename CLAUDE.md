# cine-dash

Dashboard de filmes e séries (TMDB): Vite + React 19 + TypeScript + Tailwind v4 + Recharts + React Router. Detalhes de produto: [README.md](README.md).

## Ambiente

- **Runtime**: Node 18+ (testado com 24) + npm (`package-lock.json`).
- **Variáveis**: `cp .env.example .env` e preencher `VITE_TMDB_API_KEY` (chave gratuita do TMDB; o `.env` real não vem no clone).
- **Comandos**: `npm ci` → `npm run dev` (porta 5174 no `.claude/launch.json` da raiz) · `npm run build` · `npm run lint` (oxlint) ·
  `npm run test:run` (Vitest) · deploy: `npm run deploy` (`gh-pages -d dist`, precisa de remote e permissão de push).

## Regras

- Sem caminhos absolutos de máquina em arquivos versionados; regras comuns em `$PROJECTS_ROOT/CLAUDE.md`.
- Segredos e `.env` **não vêm no `git clone`** — ver `workspace/docs/segredos-e-arquivos-fora-do-git.md`.
- Commit/push só quando o usuário pedir.
