FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@monorepo/cms --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile
# Alpine (musl) + arm64/amd64: ensure sharp native binary matches the container.
RUN pnpm rebuild sharp

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=@monorepo/cms

FROM base AS runner
WORKDIR /app

# Додаємо wget для healthcheck
RUN apk add --no-cache wget

COPY --from=installer /app/apps/cms/next.config.mjs .
COPY --from=installer /app/apps/cms/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer /app/apps/cms/.next/standalone ./
COPY --from=installer /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=installer /app/apps/cms/public ./apps/cms/public

ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

CMD node apps/cms/server.js