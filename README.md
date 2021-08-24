## Distroless NodeJS ##

NodeJS is commonly used to deploy micro-services. However default node images often contain a base distribution and many additional libraries & dependencies.

Staying true with micro-services being _micro_ and reducing the security footprint of deployment, a distro-less deployment is preferred.

Distro-less means the deployed images will only contain the bare essentials (i.e. NodeJS) and the compiled NodeJS application artifacts.

### Setup ###

Creating the base images used for the distro-less setup is done by using multi-stage Dockerfile builds (or any other OCI compliant builder supporting this).

### node-builder ###

The `node-builder` image is a based on Alpine, which lends itself best for statically compiling NodeJS because of the muslc library.

The node-builder image is built against a specified version of NodeJS and associated NPM.
Additionally it contains the basic compilation environment required for both NodeJS and native code NPM packages.

Note that NodeJS is not fully compiled static, but rather `--partly-static` which allows the NodeJS process to dynamically load libraries. This is required when using NPM modules with native code during runtime.

### node-runtime ###

The `node-runtime` image derives from the `node-builder` image and contains only the NodeJS executable. It is a bare-minimum distroless NodeJS application server image of about 80MB in size.

### Usage ###

In order to deploy a NodeJS application it should be built using the `node-builder` image and the resulting artifacts should be placed in a `node-runtime` based image.

Example Dockerfile build
   
    FROM node-builder as builder

    ENV NODE_ENV=production

    # Copy NodeJS application source to build
    COPY ./ /usr/src/app

    RUN set -x && \
        npm install node-gyp && \
        EXTRA_LDFLAGS="-s -w -static-libgcc -static-libstdc++" npm ci && \
        npm prune --production && \
        npm run copy:dist --if-present

    
    FROM node-runtime

    # Insert build artifacts into the runtime image
    COPY --from=builder ["/usr/src/app/output", "/usr/src/app/"]

The `node-runtime` image itself uses `/usr/src/app` as working directory, `/opt/bin/node` as entrypoint and `.` as command.

Executing

    docker run -ti --rm my-app

Runs the following command inside the docker container (/usr/src/app working directory)

    /usr/src/app # /opt/bin/node .
