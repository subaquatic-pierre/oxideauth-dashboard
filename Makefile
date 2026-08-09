.DEFAULT_GOAL := help

.PHONY: help deploy build clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

deploy: ## Deploy dashboard via version bump (major|minor|patch), container build, and tag push
	bash scripts/deploy.sh --yes $(filter-out $@,$(MAKECMDGOALS))

build: ## Build the runtime application
	npm run build 2>/dev/null || echo "Warning: no build step configured for dashboard"

clean: ## Remove build output and Docker artifacts
	rm -rf dist build public .next out
	-docker rmi oxideauth-dashboard:local 2>/dev/null || true

%:
	@:
