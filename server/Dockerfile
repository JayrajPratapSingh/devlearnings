# syntax=docker/dockerfile:1
#
# DevPrep API — Express + Prisma. Two stages:
#   build   — installs every dependency and compiles TypeScript to dist/
#   runtime — production deps only, regenerates the Prisma client, runs dist/
#
# The same image also runs the one-shot "migrate" service in
# docker-compose.prod.yml (prisma is a normal dependency, so `prisma db push`
# and the compiled seed both work here without any dev tooling).

# ----------------------------------------------------------------------------- #
FROM node:20-alpine AS build

RUN apk add --no-cache openssl            # Prisma engine needs it on Alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build                          # -> dist/src/**, dist/prisma/**

# ----------------------------------------------------------------------------- #
FROM node:20-alpine AS runtime

RUN apk add --no-cache openssl
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY prisma ./prisma
RUN npx prisma generate                    # schema-specific client + query engine

COPY --from=build /app/dist ./dist

EXPOSE 4000
USER node

# app.ts exposes GET /health
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:4000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/src/index.js"]
