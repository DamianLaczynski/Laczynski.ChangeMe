# Laczynski.ChangeMe

Laczynski.ChangeMe is a template full-stack issue tracking application. It is intended as a practical starter repository for building and extending a modern web app with a typed frontend, a layered .NET backend, authentication, persistence, and automated testing already in place.

The current feature set centers around user authentication and issue management: users can register, sign in, browse issues, and authenticated users can create, edit, and delete issues.

## Purpose

This repository is meant to provide:

- a clean full-stack starting point for product work
- a clear separation between frontend, API, domain, and infrastructure concerns
- a place to practice or extend real-world patterns such as auth, CRUD flows, validation, and integration testing
- a documented structure that is easy for both developers and AI agents to navigate

## Tech Stack

- Frontend: Angular 21, TypeScript, RxJS
- Backend: ASP.NET Core, FastEndpoints, MediatR-style use case flow
- Database: PostgreSQL
- Background jobs: Hangfire
- Local email testing: MailHog
- Testing: Angular test runner, .NET unit tests, .NET integration tests with Testcontainers
- Local orchestration: Docker Compose

## Repository Structure

- `src/Laczynski.ChangeMe.Frontend` - Angular application
- `src/Laczynski.ChangeMe.Backend` - .NET solution with source projects and tests
- `docs/` - repository-specific implementation and testing guidance
- `docker-compose.yml` - local full-stack environment
- `AGENTS.md` - working guide for AI agents and contributors

## Main Features

- user registration and login
- authenticated issue creation, editing, and deletion
- issue listing and issue details views
- layered backend architecture with separate Web, UseCases, Domain, and Infrastructure projects
- integration-ready local development stack

## Getting Started

### Frontend

Run from `src/Laczynski.ChangeMe.Frontend`:

```powershell
npm install
npm start
```

Useful commands:

```powershell
npm run lint
npm run format
npm test
```

### Backend

Run from `src/Laczynski.ChangeMe.Backend`:

```powershell
dotnet build Laczynski.ChangeMe.Backend.sln
dotnet run --project src/Laczynski.ChangeMe.Backend.Web
```

Useful commands:

```powershell
dotnet test tests/Laczynski.ChangeMe.Backend.UnitTests
dotnet test tests/Laczynski.ChangeMe.Backend.IntegrationTests
```

### Full Stack with Docker

Run from the repository root:

```powershell
docker compose up --build
```

This starts the frontend, backend, PostgreSQL, and MailHog together.

## Documentation

The `docs/` directory contains the focused guidance for working in this repository:

- `docs/repo-map.md` - where code lives and which layer owns what
- `docs/frontend-coding-guidelines.md` - frontend conventions
- `docs/backend-coding-guidelines.md` - backend conventions
- `docs/testing-playbook.md` - how to verify changes
- `docs/feature-recipes.md` - implementation recipes for common feature work

## About `AGENTS.md`

[`AGENTS.md`](AGENTS.md) is the fast-start guide for AI agents and contributors working in this repository. It explains:

- which docs to read first depending on the task
- the main repo structure
- standard frontend, backend, and Docker commands
- navigation rules for key folders
- change-coupling checks across frontend and backend
- working agreements for keeping changes aligned with the existing architecture

If you are making code changes, `AGENTS.md` should be treated as the first orientation document before opening area-specific docs in `docs/`.

## Development Notes

- Frontend routes are defined in `src/app/app.routes.ts`.
- Frontend feature code lives under `src/app/features/<feature>/`.
- Backend endpoints live in `src/Laczynski.ChangeMe.Backend.Web`.
- Use case contracts and handlers live in `src/Laczynski.ChangeMe.Backend.UseCases`.
- Domain rules live in `src/Laczynski.ChangeMe.Backend.Domain`.
- Persistence and integrations live in `src/Laczynski.ChangeMe.Backend.Infrastructure`.

## Testing

Use the smallest relevant test scope for the change:

- frontend UI or service change: `npm run lint` and `npm test`
- backend domain change: unit tests
- backend endpoint or auth change: integration tests

For more detail, see `docs/testing-playbook.md`.

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
