FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune the workspace for the worker app
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@leadflow/worker --docker

# 2. Install dependencies and build
FROM base AS builder
WORKDIR /app

# First install the dependencies
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Generate Prisma client before building
RUN pnpm --filter=@leadflow/db generate

# Build the project
RUN pnpm turbo run build --filter=@leadflow/worker...

# 3. Production runner
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker
USER worker

# Copy necessary runtime files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

COPY --from=builder /app/apps/worker/package.json ./apps/worker/package.json
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist

COPY --from=builder /app/packages/config ./packages/config
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/db/dist ./packages/db/dist

# Install production dependencies only
USER root
RUN pnpm install --prod --frozen-lockfile
USER worker

ENV NODE_ENV production

CMD ["node", "apps/worker/dist/index.js"]
