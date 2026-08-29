# The execution service itself. It never runs submitted code in-process — it
# shells out to the host Docker daemon to start a throwaway sibling container
# per submission, so only the Docker CLI is needed here.
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runtime

RUN apk add --no-cache docker-cli

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

EXPOSE 4001
CMD ["node", "dist/index.js"]
