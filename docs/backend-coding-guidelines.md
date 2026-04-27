# Backend Coding Guidelines

> Scope: current conventions for implementing backend work in this repository.

## Stack summary

ASP.NET Core on .NET 10 with FastEndpoints, MediatR-style request handling, EF Core for persistence, FluentValidation validators declared near endpoints, and xUnit v3 tests. The backend is split into `Web`, `UseCases`, `Domain`, and `Infrastructure`.

## Layer ownership

### Web

- Owns application startup in `Program.cs`.
- Owns HTTP endpoint declarations.
- Owns API-facing validation classes placed next to endpoint definitions.
- Owns endpoint base behavior such as auth scheme and `Result<T>` to HTTP status mapping through `Common/BaseEndpoint.cs`.

### UseCases

- Owns commands, queries, handlers, and API DTOs.
- Orchestrates domain operations and infrastructure dependencies.
- Should not duplicate domain invariants that already belong in aggregates.

### Domain

- Owns aggregates, entities, enums, interfaces, and business rules.
- Should be the place for invariants like issue title/description constraints.

### Infrastructure

- Owns EF Core `ApplicationDbContext`, entity configuration, migrations, auth adapters, email service, and application service registrations.

## Standard path for a new endpoint

1. Add or extend the endpoint in `Web/<Feature>/`.
2. Add or update the validator in the same file if the request shape changes.
3. Add or update the command/query and handler in `UseCases/<Feature>/`.
4. Reuse or extend domain methods in `Domain/`.
5. Update EF configuration or migrations in `Infrastructure/` if persistence changes.
6. Add or update integration tests under `tests/...IntegrationTests/Endpoints/<Feature>/`.

## Endpoint conventions

- Derive endpoints from `BaseEndpoint<TRequest, TResponse>`.
- Configure route and summary in `ConfigureEndpoint()`.
- Let the base endpoint handle `Result<T>` serialization and status codes.
- Validators should stay close to the endpoint they protect.

## Handler conventions

- Handlers currently live in the same file as their request contract in `UseCases`.
- Return `Result<T>` consistently.
- Use `ApplicationDbContext` for persistence from the handler layer.
- Use mediator chaining when the workflow should return a fully built DTO already supported by an existing query.

## Persistence conventions

- EF Core configuration lives under `Infrastructure/Persistence/Config`.
- Migrations live under `Infrastructure/Persistence/Migrations`.
- Database startup and migration behavior are configured through `Database` options and startup configuration.

## Auth and cross-cutting concerns

- JWT configuration lives in `Web/Configurations/AuthConfig.cs` and environment settings.
- Endpoint auth defaults come from `BaseEndpoint`.
- Email is abstracted behind `IEmailService`.

## Test expectations

- Endpoint behavior belongs in integration tests.
- Pure domain rules and utility behavior belong in unit tests.
- If you change route behavior, status code mapping, auth requirements, validation, or persistence side effects, add or update integration tests.

## Guardrails for AI agents

- Do not bypass the existing layered structure by placing domain logic directly in `Web`.
- Do not access the database directly from endpoint classes.
- Do not return ad hoc response envelopes; reuse the existing `Result<T>` flow.
- Before adding a new abstraction, inspect the closest feature in `Issues` or `Auth` and extend that pattern first.
