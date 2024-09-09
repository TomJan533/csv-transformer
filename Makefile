# Variables
PYTHON := poetry run python
LINT_FILES := .

# Targets
.PHONY: help format lint test all setup

help:  ## Show help
	@echo "Usage: make <TARGET>"
	@echo ""
	@echo "Targets:"
	@echo "  format    - Run code formatters (black, isort)"
	@echo "  lint      - Run linters (flake8)"
	@echo "  test      - Run tests (pytest)"
	@echo "  all       - Run formatters, linters, and tests"
	@echo "  setup     - Install dependencies and prepare the environment"

format:  ## Run code formatters (black, isort)
	@echo "Running black..."
	cd backend && poetry run black $(LINT_FILES)
	@echo "Running isort..."
	cd backend && poetry run isort $(LINT_FILES)

lint:  ## Run linters (flake8)
	@echo "Running flake8..."
	cd backend && poetry run flake8 $(LINT_FILES)

test:  ## Run tests (pytest)
	@echo "Running tests..."
	cd backend && poetry run pytest

all: format lint test  ## Run all checks: format, lint, and test

setup:  ## Install dependencies and prepare the environment
	@echo "Setting up the environment..."
	cd backend && poetry install
	@echo "Installing pre-commit hooks..."
	cd backend && poetry run pre-commit install
	@echo "Installing node modules"
	cd frontend && npm install
	@echo "Setup completed!"
