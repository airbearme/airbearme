# AirBear verification protocol

AirBear uses layered verification so every meaningful change receives the same baseline review.

## Automatic checks

`npm run verify` runs the dependency-free repository health check. It validates:

- required app, PWA, environment, and database files;
- `package.json` and `package-lock.json` consistency;
- required route coverage and npm scripts;
- manifest metadata and Next.js configuration;
- tracked environment files and common credential patterns;
- Supabase RLS coverage, migration ordering, and hardening safeguards.

The GitHub Actions workflow runs `npm run verify`, lint, TypeScript, and the production build on every push and pull request. A scheduled run executes every Monday at 03:17 UTC as a periodic health check.

## Before merging a major change

Run the full local sequence:

```bash
npm ci
npm run verify
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

For UI or flow changes, also exercise authentication, booking, inventory, payments, ride status, and travel-log routes in a browser with test credentials. Never use production payment or service-role credentials for local verification.

## Interpreting failures

The health check is intentionally structural and deterministic; it does not claim that external Supabase, Stripe, or Vercel services are reachable. Those integrations require configured non-production credentials and should be verified separately in a protected environment.
