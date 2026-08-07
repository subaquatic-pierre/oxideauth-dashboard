# OxideAuth Dashboard

Admin dashboard for managing the OxideAuth IAM platform.

## Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

TBD — choose from:
- React + Vite + shadcn/ui
- Next.js
- Vue + Nuxt

## Features (planned)

- Workspace management
- Account management
- Role & permission configuration
- Membership oversight
- OAuth provider setup
- Audit log viewer
- API key management

## Deployment

The dashboard is deployed to GitHub Pages (static site). **Note**: The dashboard is currently a placeholder with no build step — deployments will warn and skip the build but still create version tags.

### Option 1: Git Tag Push (CI Trigger)

```sh
# From the dashboard/ directory, create and push a semantic version tag:
git tag 0.1.0
git push origin 0.1.0
```

Pushing a tag matching `*.*.*` triggers the GitHub Actions workflow at `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages. If no build step is configured, the workflow warns and continues.

### Option 2: Manual Deploy via Script

```sh
make deploy patch    # bump patch version
make deploy minor    # bump minor version
make deploy major    # bump major version
make deploy 1.2.3    # use explicit version
```

The `make deploy` command runs `scripts/deploy.sh`, which:
1. Bumps the version (from `package.json` or git tags)
2. Builds the static site (`npm run build`, with warning if unavailable)
3. Creates and pushes an `X.Y.Z` tag
4. Force-pushes build output to the `gh-pages` branch

All tags use semantic versioning (e.g., `1.2.3`). Deployments target the `main` branch.
