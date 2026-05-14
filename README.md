# ChangeMe

ChangeMe is a template full-stack issue tracking application. It is intended as a practical starter repository for building and extending a modern web app with a typed frontend, a layered .NET backend, authentication, persistence, and automated testing already in place.

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
  <!--#endif-->
  <!--#if (SqlServer) -->
- Database: SQL Server
<!--#endif-->
- Background jobs: Hangfire
- Local email testing: MailHog
- Testing: Angular test runner, .NET unit tests, .NET integration tests with Testcontainers
- Local orchestration: Docker Compose

## Repository Structure

- `src/ChangeMe.Frontend` - Angular application
- `src/ChangeMe.Backend` - .NET solution with source projects and tests
- `docs/` - implementation and testing guidance
<!--#if (PostgreSQL) -->
- `docker-compose.yml` - local full-stack environment (frontend, backend, PostgreSQL, MailHog)
  <!--#endif-->
  <!--#if (SqlServer) -->
- `docker-compose.yml` - local full-stack environment (frontend, backend, SQL Server, MailHog)
<!--#endif-->
- `AGENTS.md` - working guide for AI agents and contributors

## Main Features

- user registration and login
- authenticated issue creation, editing, and deletion
- issue listing and issue details views
- layered backend architecture with separate Web, UseCases, Domain, and Infrastructure projects
- integration-ready local development stack

## Getting Started

## Install As a `dotnet new` Template

Install the template from NuGet:

```powershell
dotnet new install ChangeMe
```

Or install the template directly from the repository root during local development:

```powershell
dotnet new install .
```

Create a new solution from the installed template:

<!--#if (PostgreSQL) -->

```powershell
dotnet new changeme -n IssuesDemo -o IssuesDemo
```

This variant uses PostgreSQL for persistence, Hangfire storage, Docker Compose, and integration tests.

<!--#endif-->
<!--#if (SqlServer) -->

```powershell
dotnet new changeme -n IssuesDemo -o IssuesDemo --Database SqlServer
```

This variant uses SQL Server for persistence, Hangfire storage, Docker Compose, and integration tests. Add an EF Core migration for SQL Server before the first run if none are present yet.

<!--#endif-->

The installed short name is visible in the `Short Name` column of `dotnet new list`.

This replaces `ChangeMe` across the solution, project names, folders, Docker configuration, docs, and frontend package metadata. Use a .NET-friendly project name such as `IssuesDemo` so generated solution and namespace names stay valid. Avoid embedding the substring `ChangeMe` in secrets you expect to stay literal after generation (template renames that token everywhere).

### Publish The NuGet Package

Create the template package:

```powershell
dotnet pack template-pack/ChangeMe.Templates.csproj -c Release
```

Publish it to NuGet:

```powershell
dotnet nuget push template-pack/bin/Release/ChangeMe.<version>.nupkg --source https://api.nuget.org/v3/index.json --api-key <your-api-key>
```

The packaging project targets `net10.0` only as a carrier for NuGet metadata and `dotnet pack`. It does not affect the generated solution structure or the target frameworks used by the projects created from the template.

### Frontend

Run from `src/ChangeMe.Frontend`:

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

Run from `src/ChangeMe.Backend`:

```powershell
dotnet build ChangeMe.Backend.sln
dotnet run --project src/ChangeMe.Backend.Web
```

Useful commands:

```powershell
dotnet test tests/ChangeMe.Backend.UnitTests
dotnet test tests/ChangeMe.Backend.IntegrationTests
```

### Full Stack with Docker

Run from the repository root:

```powershell
docker compose up --build
```

This starts the frontend, backend, MailHog, and the database service defined in this solution's Compose file.

## Documentation

The `docs/` directory contains the focused guidance for working in this repository:

- `docs/repo-map.md` - where code lives and which layer owns what
- `docs/frontend-coding-guidelines.md` - frontend conventions
- `docs/backend-coding-guidelines.md` - backend conventions
- `docs/testing-playbook.md` - how to verify changes
- `docs/feature-recipes.md` - implementation recipes for common feature work
- `docs/req/` - functional requirements documents for specific product areas
- `docs/templates/` - reusable document templates

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
- Backend endpoints live in `src/ChangeMe.Backend.Web`.
- Use case contracts and handlers live in `src/ChangeMe.Backend.UseCases`.
- Domain rules live in `src/ChangeMe.Backend.Domain`.
- Persistence and integrations live in `src/ChangeMe.Backend.Infrastructure`.

## Testing

Use the smallest relevant test scope for the change:

- frontend UI or service change: `npm run lint` and `npm test`
- backend domain change: unit tests
- backend endpoint or auth change: integration tests

For more detail, see `docs/testing-playbook.md`.

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
