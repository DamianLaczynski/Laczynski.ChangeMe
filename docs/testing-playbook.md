# Testing Playbook

> Scope: how to verify changes in this repository and where each kind of test belongs.

## Test projects

- Backend unit tests: `src/ChangeMe.Backend/tests/ChangeMe.Backend.UnitTests`
- Backend integration tests: `src/ChangeMe.Backend/tests/ChangeMe.Backend.IntegrationTests`
- Frontend tests: run through Angular with `npm test` in `src/ChangeMe.Frontend`

## Backend unit tests

Use unit tests for:

- domain invariants
- aggregate/entity behavior
- small infrastructure helpers that do not need full app startup

Command:

```powershell
dotnet test tests/ChangeMe.Backend.UnitTests
```

Run from:

```powershell
src/ChangeMe.Backend
```

## Backend integration tests

Use integration tests for:

- endpoint routes and status codes
- auth behavior
- validation behavior visible through HTTP
- persistence side effects
- API contract behavior

Current setup:

- `BackendWebApplicationFactory` starts PostgreSQL via Testcontainers.
- Test environment variables override connection string, JWT settings, and email settings.
- `IEmailService` is replaced with `FakeEmailService`.
- `TestAuthHelper` creates a registered and authenticated client through real API calls.

Command:

```powershell
dotnet test tests/ChangeMe.Backend.IntegrationTests
```

## Frontend checks

Minimum checks for frontend work:

- `npm run lint`
- `npm test` when component or service behavior changes

Useful commands:

```powershell
npm run lint
npm test
npm run format:check
```

Run from:

```powershell
src/ChangeMe.Frontend
```

## Change-based checklist

### Backend endpoint change

- update or add integration tests
- verify auth expectation
- verify status code and response shape
- verify persistence side effects if data is written

### Domain or persistence change

- add or update unit tests for domain rules
- add or update integration tests if HTTP behavior or saved data changes
- verify migrations/configuration if schema changed

### Frontend API contract change

- update frontend model and service
- check auth flow if token use changed
- run lint and relevant tests

## AI verification rule

For any non-trivial change, prefer running the smallest relevant automated check before finishing:

- frontend-only UI/service change: lint plus affected frontend tests when available
- backend domain change: unit tests first
- backend endpoint change: integration tests for the affected area, then broader tests if needed
