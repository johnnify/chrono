FROM alpine:latest

# https://github.com/pocketbase/pocketbase/releases
# https://github.com/pocketbase/pocketbase/blob/master/CHANGELOG.md
ARG PB_VERSION=0.22.17

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    # this is needed only if you want to use scp to copy later your pb_data locally
    openssh

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# copy the local pb_migrations dir into the container
# https://pocketbase.io/docs/js-migrations/
COPY ./pb_migrations /pb/pb_migrations

# copy the local pb_hooks dir into the container
# https://pocketbase.io/docs/js-overview/
COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8090

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
