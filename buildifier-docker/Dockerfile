ARG DEBIAN_VERSION
FROM debian:${DEBIAN_VERSION}

ARG BUILDIFIER_VERSION="5.1.0"
ARG OS="linux"
ARG ARCH="amd64"

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    curl ca-certificates \
    # Clean cache
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/bazelbuild/buildtools/releases/download/${BUILDIFIER_VERSION}/buildifier-${OS}-${ARCH} -o buildifier

RUN chmod +x buildifier && mv buildifier /usr/bin/

ENTRYPOINT ["/usr/bin/buildifier"]