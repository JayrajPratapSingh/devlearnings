# Runtime image for Python submissions.
# Standard library only — pip is removed so a submission cannot install anything
# even if the network policy were ever relaxed.
FROM python:3.12-alpine

RUN addgroup -g 1000 -S runner 2>/dev/null || true \
 && adduser -u 1000 -S runner -G runner 2>/dev/null || true

RUN python3 -m ensurepip --version >/dev/null 2>&1 || true \
 && rm -rf /usr/local/lib/python3.12/ensurepip \
 && rm -rf /usr/local/lib/python3.12/site-packages/pip* \
 && rm -f /usr/local/bin/pip /usr/local/bin/pip3 /usr/local/bin/pip3.12

# Never write .pyc into the (read-only) sandbox mount; keep stdout unbuffered.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /sandbox
USER 1000:1000

ENTRYPOINT []
CMD ["python3", "--version"]
