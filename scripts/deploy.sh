#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { printf "${GREEN}[deploy]${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}[deploy] WARNING:${NC} %s\n" "$*" >&2; }
err()  { printf "${RED}[deploy] ERROR:${NC} %s\n" "$*" >&2; exit 1; }

# ── pre-flight checks ─────────────────────────────────────────────────

command -v git >/dev/null 2>&1 || err "git is required but not found."

if ! git diff-index --quiet HEAD --; then
  err "Working tree is dirty. Commit or stash changes before deploying."
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [ -z "${CURRENT_BRANCH}" ]; then
  err "Not on any branch (detached HEAD). Checkout a branch first."
fi
if [ "${CURRENT_BRANCH}" != "main" ]; then
  err "Must be on 'main' branch. Current branch: ${CURRENT_BRANCH}"
fi
log "Current branch: ${CURRENT_BRANCH}"

# ── parse arguments ────────────────────────────────────────────────────

YES=false

while [ $# -gt 0 ]; do
  case "$1" in
    -y|--yes) YES=true; shift ;;
    *)        break ;;
  esac
done

# ── determine version tag ──────────────────────────────────────────────

TAG=""

if [ -f "package.json" ]; then
  if [ $# -eq 0 ]; then
    NEW_VERSION="$(npm version patch --no-git-tag-version)"
    TAG="${NEW_VERSION#v}"
    log "Bumped package.json version to ${TAG}"
  elif [ $# -eq 1 ]; then
    case "$1" in
      major|minor|patch)
        NEW_VERSION="$(npm version "$1" --no-git-tag-version)"
        TAG="${NEW_VERSION#v}"
        log "Bumped package.json version to ${TAG}"
        ;;
      *)
        TAG="$1"
        ;;
    esac
  else
    err "Too many arguments. Usage: ./scripts/deploy.sh [-y|--yes] [major|minor|patch|X.Y.Z]"
  fi
else
  LATEST="$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")"
  log "Latest tag: ${LATEST}"

  BASE="${LATEST}"
  MAJOR="${BASE%%.*}"
  REST="${BASE#*.}"
  MINOR="${REST%%.*}"
  PATCH="${REST#*.}"

  if ! [[ "${PATCH}" =~ ^[0-9]+$ ]]; then
    PATCH=0
  fi

  if [ $# -eq 0 ]; then
    PATCH=$((PATCH + 1))
    TAG="${MAJOR}.${MINOR}.${PATCH}"
  elif [ $# -eq 1 ]; then
    case "$1" in
      major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0; TAG="${MAJOR}.${MINOR}.${PATCH}" ;;
      minor) MINOR=$((MINOR + 1)); PATCH=0;       TAG="${MAJOR}.${MINOR}.${PATCH}" ;;
      patch) PATCH=$((PATCH + 1));                TAG="${MAJOR}.${MINOR}.${PATCH}" ;;
      *)     TAG="$1" ;;
    esac
  else
    err "Too many arguments. Usage: ./scripts/deploy.sh [-y|--yes] [major|minor|patch|X.Y.Z]"
  fi
fi

log "Deployment tag will be: ${TAG}"

# ── confirm ────────────────────────────────────────────────────────────

if [ "${YES}" = false ]; then
  read -r -p "$(printf "${YELLOW}Proceed with deploy tag ${TAG}?${NC} [y/N] ")" CONFIRM </dev/tty
  if [ "${CONFIRM}" != "y" ] && [ "${CONFIRM}" != "Y" ]; then
    log "Aborted."
    exit 0
  fi
fi

# ── build ──────────────────────────────────────────────────────────────

if [ -f "package.json" ]; then
  if npm run build >/dev/null 2>&1; then
    log "Build completed successfully."
  else
    warn "dashboard has no build step yet — skipping build"
  fi
else
  warn "dashboard has no build step yet — skipping build"
fi

# ── determine output directory ─────────────────────────────────────────

OUTPUT_DIR=""
if [ -d "dist" ]; then
  OUTPUT_DIR="dist"
elif [ -d "build" ]; then
  OUTPUT_DIR="build"
elif [ -d "public" ]; then
  OUTPUT_DIR="public"
else
  OUTPUT_DIR="dist"
  mkdir -p "${OUTPUT_DIR}"
  warn "No output directory found — created empty ${OUTPUT_DIR} directory for pages artifact"
fi

log "Using output directory: ${OUTPUT_DIR}"

# ── tag source branch ──────────────────────────────────────────────────

VERSION_TAG="${TAG}"

log "Creating tag ${VERSION_TAG}..."
git tag -a "${VERSION_TAG}" -m "deploy: ${VERSION_TAG}" 2>/dev/null || {
  warn "Tag ${VERSION_TAG} already exists locally. Skipping tag creation."
}

log "Pushing tag ${VERSION_TAG} to origin..."
git push origin "${VERSION_TAG}"

# ── commit version bump ────────────────────────────────────────────────

if [ -f "package.json" ] && ! git diff --quiet package.json; then
  log "Committing version bump..."
  git add package.json

  if [ -f "package-lock.json" ] && ! git diff --quiet package-lock.json; then
    git add package-lock.json
  fi

  git commit -m "chore: bump version to ${TAG}"
  git push origin "${CURRENT_BRANCH}"
fi

# ── deploy to gh-pages ─────────────────────────────────────────────────

log "Deploying build output to gh-pages branch..."

TMP_DIR="$(mktemp -d)"
trap "rm -rf '${TMP_DIR}'" EXIT

cp -a "${OUTPUT_DIR}/." "${TMP_DIR}/"

cd "${TMP_DIR}"
git init -q
git checkout -B gh-pages
git add -A
git commit -m "deploy: ${TAG} [skip ci]" --allow-empty

GIT_REMOTE="$(git -C "${ROOT_DIR}" remote get-url origin)"
git push -f "${GIT_REMOTE}" gh-pages

cd "${ROOT_DIR}"

log "Deployed to gh-pages branch successfully."
