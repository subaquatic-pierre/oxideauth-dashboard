.DEFAULT_GOAL := help

.PHONY: help deploy build clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

deploy: ## Deploy dashboard via version bump (major|minor|patch) and tag push
	bash scripts/deploy.sh --yes $(filter-out $@,$(MAKECMDGOALS))

build: ## Build the static site
	npm run build 2>/dev/null || echo "Warning: no build step configured for dashboard"

clean: ## Remove build output
	rm -rf dist build public

%:
	@:
