# Makefile for Node.js TypeScript Express Application
# Provides automation for common development tasks

.PHONY: help dev build start test lint format clean docker-build docker-run docker-stop docker-logs

# Default target
help:
	@echo "Available targets:"
	@echo "  make dev          - Start development server with auto-restart"
	@echo "  make build        - Compile TypeScript to JavaScript"
	@echo "  make start        - Run the compiled application"
	@echo "  make test         - Run tests (requires test setup)"
	@echo "  make lint         - Run ESLint (requires lint setup)"
	@echo "  make format       - Format code with Prettier (requires setup)"
	@echo "  make clean        - Remove dist/ and node_modules/"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container"
	@echo "  make docker-stop  - Stop Docker container"
	@echo "  make docker-logs  - View Docker container logs"

# Development
dev:
	npm run dev

# Build TypeScript to JavaScript
build:
	npm run build

# Start the compiled application
start:
	npm start

# Test (placeholder - requires test setup)
test:
	@echo "Tests not configured yet. See CLAUDE.md for test setup instructions."
	@echo "After setting up tests, update this target to run: npm test"

# Lint (placeholder - requires lint setup)
lint:
	@echo "Linting not configured yet. See CLAUDE.md for lint setup instructions."
	@echo "After setting up linting, update this target to run: npm run lint"

# Format (placeholder - requires format setup)
format:
	@echo "Formatting not configured yet. See CLAUDE.md for format setup instructions."
	@echo "After setting up formatting, update this target to run: npm run format"

# Clean build artifacts and dependencies
clean:
	rm -rf dist/
	rm -rf node_modules/
	npm cache clean --force
	@echo "Cleaned dist/, node_modules/, and npm cache"

# Docker operations
docker-build:
	docker build -t nodejs-docker-example .

docker-run:
	docker run -d -p 3000:3000 --name nodejs-app nodejs-docker-example

docker-stop:
	docker stop nodejs-app

docker-logs:
	docker logs -f nodejs-app

# Development with Docker (live reload)
docker-dev:
	docker run -d -p 3000:3000 \
	  -v $(PWD)/src:/usr/src/app/src \
	  -v $(PWD)/tsconfig.json:/usr/src/app/tsconfig.json \
	  --name nodejs-dev \
	  nodejs-docker-example \
	  npm run dev

# Full Docker development workflow
docker-up: docker-build docker-run

docker-down: docker-stop
	docker rm nodejs-app

.PHONY: help dev build start test lint format clean docker-build docker-run docker-stop docker-logs docker-dev docker-up docker-down