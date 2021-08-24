FROM node-builder:latest as builder

RUN set -x && \
	find /opt -type d -maxdepth 1 ! -name "opt" ! -name "bin" ! -name "etc" ! -name "lib" -exec rm -fR {} \; && \
	rm -fR /opt/bin/node-prune /opt/bin/npm /opt/bin/npx /opt/etc/npmrc /opt/lib && \
	mkdir -p /usr/src/app

FROM	scratch

ENV		PATH=$PATH:/opt/bin

COPY	--from=builder ["/opt", "/opt/"]
COPY	--from=builder ["/lib/ld-musl-*", "/lib/"]

ENTRYPOINT ["/opt/bin/node"]
CMD		["."]

WORKDIR /usr/src/app
