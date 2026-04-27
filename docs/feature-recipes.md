# Feature Recipes

> Scope: short implementation recipes for common tasks in this repository.

## Add a backend endpoint

1. Create or update the endpoint in `src/Laczynski.ChangeMe.Backend.Web/<Feature>/`.
2. Add or update the validator in the same file.
3. Add the request contract and handler in `src/Laczynski.ChangeMe.Backend.UseCases/<Feature>/`.
4. Reuse domain behavior or add it in `Domain` if new invariants are introduced.
5. Add integration tests under `tests/Laczynski.ChangeMe.Backend.IntegrationTests/Endpoints/<Feature>/`.

## Add a persisted field

1. Update the domain model if the field is part of business state.
2. Update the EF configuration in `Infrastructure/Persistence/Config`.
3. Add a migration in `Infrastructure/Persistence/Migrations`.
4. Update use case DTOs and frontend models if the field crosses the API.
5. Add unit and integration coverage for the new behavior.

## Add a frontend screen backed by an existing endpoint

1. Add or extend the model in `features/<feature>/models`.
2. Add or extend the service in `features/<feature>/services`.
3. Create a standalone component under `features/<feature>/components/<name>/`.
4. Register the route in `src/app/app.routes.ts` if it is navigable directly.
5. Run lint and relevant tests.

## Change auth-sensitive behavior

1. Check backend endpoint auth defaults in `BaseEndpoint`.
2. Check route guards under `features/auth/guards`.
3. Check token/session handling in `features/auth/services/auth.service.ts`.
4. Add or update integration coverage for authenticated and anonymous flows.
