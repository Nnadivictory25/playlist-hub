#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting deployment script..."

# 1. Run migrations
echo "Running database migrations..."
# Run the standalone migration script
bun --bun run migrate.ts

# 2. Start the application
echo "Starting the application..."
# Svelte-adapter-bun builds the app into the 'build' directory
# The entry point is build/index.js
exec bun --bun run build/index.js