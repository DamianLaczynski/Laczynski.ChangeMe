# ChangeMe Full Stack Templates

`ChangeMe` is a full-stack starter template for `dotnet new`.

It generates:

- an Angular frontend
- a layered ASP.NET backend
- **PostgreSQL** (default) or **SQL Server** for EF Core, Hangfire, integration tests, and Docker Compose
- MailHog for local email capture
- backend unit and integration test projects
- `docs/` with database and Docker notes (`docs/database-and-docker.md`)

## Install

```powershell
dotnet new install ChangeMe
```

## Create a project

**PostgreSQL** (default):

```powershell
dotnet new changeme -n IssuesDemo -o IssuesDemo
```

**SQL Server:**

```powershell
dotnet new changeme -n IssuesDemo -o IssuesDemo --Database SqlServer
```

Parameter: `--Database` (`PostgreSQL` or `SqlServer`).

## After generation

- Read `docs/database-and-docker.md` for the first `dotnet ef migrations add`, Compose, `ApplyMigrationsOnStartup`, and production migration guidance.

## Verify the install

```powershell
dotnet new list changeme
```

## Update

```powershell
dotnet new install ChangeMe --force
```

## Uninstall

```powershell
dotnet new uninstall ChangeMe
```

## Source repository

https://github.com/damianlaczynski/ChangeMe
