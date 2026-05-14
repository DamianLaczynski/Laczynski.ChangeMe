# ChangeMe Full Stack Templates

`ChangeMe` is a full-stack starter template for `dotnet new`.

It generates:

- an Angular frontend
- a layered ASP.NET backend
- **PostgreSQL** (default) or **SQL Server** for EF Core, Hangfire, integration tests, and Docker Compose
- MailHog for local email capture
- backend unit and integration test projects

## Install

```powershell
dotnet new install ChangeMe
```

## Create a project

**PostgreSQL** (default) - Npgsql, Hangfire.PostgreSql, Postgres in Docker:

```powershell
dotnet new changeme -n IssuesDemo -o IssuesDemo
```

**SQL Server** - EF Core SqlServer, Hangfire.SqlServer, SQL Server in Docker (PostgreSQL-specific EF migrations are not copied; add a migration before first run):

```powershell
dotnet new changeme -n IssuesDemo -o IssuesDemo --Database SqlServer
```

Parameter name: `--Database` with values `PostgreSQL` or `SqlServer`.

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
