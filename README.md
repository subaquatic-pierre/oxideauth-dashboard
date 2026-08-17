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

## Features

- Workspace management
- Profile & user management (workspace members) — profiles are the workspace-scoped identity; users are created via membership onboarding by email
- Role & permission configuration
- Membership oversight (members identified by their workspace profile)
- OAuth provider setup
- Audit log viewer
- API key management

## Deployment

### Container Build & K8s Deployment (PENDING 🚧)

The dashboard is built as a container image in CI. Deployment to Kubernetes
is pending cluster provisioning.

**Current CI pipeline** (`.github/workflows/deploy.yml`):

1. Triggers on semantic version tag push (`*.*.*`) or manual `workflow_dispatch`
2. Builds Docker image using Next.js `output: "standalone"`
3. Verifies the container starts and responds to HTTP requests
4. Images are ephemeral — built, verified, and discarded (not pushed to a registry)

**Manual deploy** (`make deploy`):

```sh
make deploy patch    # bump patch version, build container, push tag
make deploy minor    # bump minor version
make deploy major    # bump major version
make deploy 1.2.3    # use explicit version
```

**When K8s is ready**:

1. Uncomment `docker/login-action` step in the CI workflow
2. Switch `load: true` → `push: true` in `docker/build-push-action`
3. Add `kubectl apply` or Helm upgrade deployment step

### Option 1: Git Tag Push (CI Trigger)

```sh
# From the dashboard/ directory, create and push a semantic version tag:
git tag 0.1.0
git push origin 0.1.0
```

Pushing a tag matching `*.*.*` triggers the GitHub Actions workflow at
`.github/workflows/deploy.yml`, which builds the container image and verifies it.

### Option 2: Manual Deploy via Script

```sh
make deploy patch    # bump patch version
make deploy minor    # bump minor version
make deploy major    # bump major version
make deploy 1.2.3    # use explicit version
```

The `make deploy` command runs `scripts/deploy.sh`, which:
1. Bumps the version (from `package.json` or git tags)
2. Builds the application (`npm run build`)
3. Builds a Docker container image
4. Creates and pushes an `X.Y.Z` tag

All tags use semantic versioning (e.g., `1.2.3`). Deployments target the `main` branch.

### Legacy: GitHub Pages Deployment (deprecated)

The dashboard was previously deployed to GitHub Pages as a static site.
The `gh-pages` deployment path has been removed and replaced with the
container-based pipeline described above.
