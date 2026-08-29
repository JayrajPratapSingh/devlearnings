# syntax=docker/dockerfile:1
#
# DevPrep web client — Vite/React. Build to static files, then serve them with a
# tiny nginx. Nothing Node runs in production; the output is plain HTML/JS/CSS.
#
# VITE_API_URL is baked in at BUILD time (Vite inlines VITE_* into the bundle).
# In production the client and API share an origin behind Caddy, so the default
# of "/api" is correct and you normally do not need to pass this arg.

# ----------------------------------------------------------------------------- #
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build            # tsc -b && vite build -> dist/

# ----------------------------------------------------------------------------- #
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
