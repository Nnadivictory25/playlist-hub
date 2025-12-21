# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build the application
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun --bun run build

# Final production image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/build build
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/drizzle drizzle
COPY --from=prerelease /app/drizzle.config.ts drizzle.config.ts
COPY --from=prerelease /app/src/lib/server/db/ src/lib/server/db/
COPY --from=prerelease /app/start.sh .

# Ensure start.sh is executable
USER root
RUN chmod +x start.sh
USER bun

EXPOSE 3000/tcp
ENTRYPOINT [ "./start.sh" ]