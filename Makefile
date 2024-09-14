# Colors for better readability
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m

# Branches
MAIN_BRANCH := main

# Get current branch
CURRENT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

.PHONY: help update sync-main clean prune

help:
	@echo "Usage:"
	@echo "  make update [BRANCH=<branch_name>]  - Update specified branch or current branch with main"
	@echo "  make sync-main                      - Synchronize main with dev"
	@echo "  make clean                          - Clean up local branches"
	@echo "  make prune                          - Prune remote branches"
	@echo "  make help                           - Display this help message"

update:
	@BRANCH=$${BRANCH:-$(CURRENT_BRANCH)}; \
	echo -e "$(YELLOW)Updating branch: $$BRANCH$(NC)"; \
	git fetch origin $(MAIN_BRANCH) || (echo -e "$(RED)Error: Unable to fetch $(MAIN_BRANCH)$(NC)" && exit 1); \
	git checkout $$BRANCH || (echo -e "$(RED)Error: Unable to switch to $$BRANCH$(NC)" && exit 1); \
	git merge origin/$(MAIN_BRANCH) || (echo -e "$(RED)Error: Unable to merge $(MAIN_BRANCH) into $$BRANCH$(NC)" && exit 1); \
	git push origin $$BRANCH || (echo -e "$(RED)Error: Unable to push changes$(NC)" && exit 1); \
	echo -e "$(GREEN)Update completed successfully!$(NC)"

sync-main:
	@echo -e "$(YELLOW)Synchronizing $(MAIN_BRANCH) with dev$(NC)"; \
	git fetch origin dev $(MAIN_BRANCH) || (echo -e "$(RED)Error: Unable to fetch branches$(NC)" && exit 1); \
	git checkout $(MAIN_BRANCH) || (echo -e "$(RED)Error: Unable to switch to $(MAIN_BRANCH)$(NC)" && exit 1); \
	git merge origin/dev || (echo -e "$(RED)Error: Unable to merge dev into $(MAIN_BRANCH)$(NC)" && exit 1); \
	git push origin $(MAIN_BRANCH) || (echo -e "$(RED)Error: Unable to push changes$(NC)" && exit 1); \
	echo -e "$(GREEN)Synchronization of $(MAIN_BRANCH) completed successfully!$(NC)"

clean:
	@echo -e "$(YELLOW)Cleaning up local branches...$(NC)"
	@git branch --merged | grep -v "\*" | grep -v "main" | grep -v "dev" | xargs -n 1 git branch -d
	@echo -e "$(GREEN)Local branches cleaned up successfully!$(NC)"

prune:
	@echo -e "$(YELLOW)Pruning remote branches...$(NC)"
	@git remote prune origin
	@echo -e "$(GREEN)Remote branches pruned successfully!$(NC)"
