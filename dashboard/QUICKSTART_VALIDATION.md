# Quickstart Validation Notes

The quickstart.md scenarios require a live OxideAuth API instance.
Without the API running at the configured NEXT_PUBLIC_API_URL,
full end-to-end validation is not possible.

## What can be tested without the API:
1. Build succeeds: `npm run build` produces static HTML in `out/`
2. Login/Register pages render correctly
3. Dashboard layout renders (redirects to login if not authenticated)
4. All static pages are generated

## To test with a live API:
1. Start the OxideAuth API server
2. Set NEXT_PUBLIC_API_URL in .env.local
3. Follow scenarios in specs/001-dashboard-scaffold/quickstart.md
