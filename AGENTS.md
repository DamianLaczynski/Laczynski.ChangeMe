# AI Working Guide

> Scope: fast-start context for AI agents and contributors working in this repository. Load this file first, then open the focused docs under `docs/` for the area you are changing.

## Repository shape

- `src/ChangeMe.Frontend` - Angular 21 frontend.
- `src/ChangeMe.Backend` - .NET backend solution.
- `docker-compose.yml` - local full-stack environment with frontend, backend, PostgreSQL, and MailHog.
- `docs/` - repo-specific implementation and testing guidance.

## Start here by task

- Frontend change: read `docs/repo-map.md` and `docs/frontend-coding-guidelines.md`.
- Backend change: read `docs/repo-map.md` and `docs/backend-coding-guidelines.md`.
- Test work or bugfix verification: read `docs/testing-playbook.md`.
- Cross-stack feature: read all four docs above before editing.

## Commands

### Frontend

- Install dependencies: `npm install` in `src/ChangeMe.Frontend`
- Run dev server: `npm start`
- Lint: `npm run lint`
- Format: `npm run format`
- Tests: `npm test`

### Backend

- Restore/build solution: `dotnet build ChangeMe.Backend.sln`
- Run web app: `dotnet run --project src/ChangeMe.Backend.Web`
- Unit tests: `dotnet test tests/ChangeMe.Backend.UnitTests`
- Integration tests: `dotnet test tests/ChangeMe.Backend.IntegrationTests`

Run backend commands from `src/ChangeMe.Backend`.

### Full stack

- Start dependencies and app containers: `docker compose up --build`

## Repo navigation rules

### Frontend

- Routes live in `src/app/app.routes.ts`.
- Feature code lives under `src/app/features/<feature>/`.
- Shared HTTP wrapper lives in `src/app/shared/api/services/api.service.ts`.
- Cross-cutting user/session concerns live under `src/app/core/` and `features/auth/`.
- Shared data models live under `src/app/shared/`.

### Backend

- HTTP endpoints live in `src/ChangeMe.Backend.Web`.
- Query and command contracts live in `src/ChangeMe.Backend.UseCases/<Feature>/`.
- Keep only `*Query.cs` and `*Command.cs` files at the top level of each `UseCases` feature folder.
- Place feature DTOs in `src/ChangeMe.Backend.UseCases/<Feature>/Dtos/`.
- Place feature services in `src/ChangeMe.Backend.UseCases/<Feature>/Services/`.
- Handlers still live with their matching command or query file.
- Domain rules and aggregates live in `src/ChangeMe.Backend.Domain`.
- EF Core, persistence, auth, and adapters live in `src/ChangeMe.Backend.Infrastructure`.
- Integration tests mirror API behavior under `tests/ChangeMe.Backend.IntegrationTests`.
- Unit tests cover domain/infrastructure helpers under `tests/ChangeMe.Backend.UnitTests`.

## Change coupling checklist

- If you change a backend request/response contract, check matching frontend models and services.
- If you add or change an endpoint, check validator, handler, and integration tests.
- If you change persistence shape, check EF configuration, migrations, and tests.
- If you change auth behavior, check backend auth config, frontend auth service, guards, and integration tests.
- If you change pagination or shared API result handling, check both backend shared models and frontend `ApiService`.

## Working agreements

- Follow the current code structure instead of inventing a new layer or folder layout.
- Prefer extending an existing feature slice over creating a parallel pattern.
- Keep docs current when introducing a new enforced convention.
- Do not assume files visible in the IDE are committed; verify against the filesystem first.
