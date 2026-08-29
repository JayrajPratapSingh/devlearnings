# Runtime image for JavaScript / Node.js submissions.
# Deliberately minimal: no package manager cache, no shell tooling, no network
# clients. The container is started with --network none and a read-only rootfs,
# so nothing here can phone home or persist anything.
FROM node:20-alpine

# Non-root user the sandbox runs as (matches --user 1000:1000).
RUN addgroup -g 1000 -S runner 2>/dev/null || true \
 && adduser -u 1000 -S runner -G runner 2>/dev/null || true

# npm/yarn are not needed to run a single file and only widen the attack surface.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
 && rm -rf /opt/yarn* /usr/local/bin/yarn /usr/local/bin/yarnpkg

WORKDIR /sandbox
USER 1000:1000

# Overridden by the sandbox with the real command; kept explicit for `docker run`.
ENTRYPOINT []
CMD ["node", "--version"]
