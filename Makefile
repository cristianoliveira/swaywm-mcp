.PHONY: help
help: ## Lists the available commands. Add a comment with '##' to describe a command.
	@grep -E '^[a-zA-Z_-].+:.*?## .*$$' $(MAKEFILE_LIST)\
		| sort\
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: nix-build
nix-build: ## Builds the project using Nix.
	nix build .#

.PHONY: tail-logs
tail-logs: ## Tails the logs of the SwayWM MCP.
	@echo "Tailing logs..."
	tail -f /tmp/swaywm-mcp.log
