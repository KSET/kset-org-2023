FROM node:18-alpine as base


########################
# INSTALL DEPENDENCIES #
########################
FROM base as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .yarn* ./
# Install dependencies based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn install --non-interactive --frozen-lockfile --emoji true; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


#############
# BUILD APP #
#############
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION 1
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma .
RUN yarn prisma generate
COPY . .
RUN yarn build


###############
# RUN THE APP #
###############
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# Disable telemetry, again
ENV NEXT_TELEMETRY_DISABLED 1
ARG user=runner
ARG user_id=1001
ARG group_id=1001
RUN addgroup --system --gid ${group_id} ${user}
RUN adduser --system --uid ${user_id} ${user}
COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=${user}:${user} /app/.next/standalone ./
COPY --from=builder --chown=${user}:${user} /app/.next/static ./.next/static
USER ${user}
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
