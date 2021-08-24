FROM alpine:latest

ENV	PATH="/opt/bin:${PATH}" \
	NODE_VERSION="14.17.5" \
	NPM_VERSION="7.21.0"

RUN	set -x && \
	apk add --no-cache \
	build-base \
	curl \
	git \
	gnupg \
	linux-headers \
	python3 \
	samurai \
	--repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
	ln -s /usr/bin/python3 /usr/bin/python && \
	mkdir -p /build && \
	cd /build && \
	set -- \
		4ED778F539E3634C779C87C6D7062848A1AB005C \
		B9E2F5981AA6E0CD28160D9FF13993A75599653C \
		94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
		B9AE9905FFD7803F25714661B63B535A4C206CA9 \
		77984A986EBC2AA786BC0F66B01FBB92821C587A \
		71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
		FD3A5288F042B6850C66B31F09FE44734EB7990E \
		8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
		C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
		DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
		A48C2BEE680E841632CD4E44F07496B3EB3C1762 \
		74F12602B6F1C4E913FAA37AD3A89613643B6201 \
		108F52B48DB57BB0CC439B2997B01419BD92F80A && \
	gpg --batch --keyserver hkps://keyserver.ubuntu.com --recv-keys $@ || \
	gpg --batch --keyserver hkps://peegeepee.com --recv-keys $@ && \
	gpg --yes --list-keys --fingerprint --with-colons | sed -E -n -e 's/^fpr:::::::::([0-9A-F]+):$/\1:6:/p' | gpg --import-ownertrust --yes && \
#
#	Mozilla CA cert bundle
#
	curl --location --silent --compressed --output /build/cacert.pem https://curl.haxx.se/ca/cacert.pem && \
	curl --location --silent --compressed --output /build/cacert.pem.sha256 https://curl.haxx.se/ca/cacert.pem.sha256 && \
	cd /build && \
	sha256sum -c /build/cacert.pem.sha256 && \
	rm /build/cacert.pem.sha256 && \
	mkdir -p /opt/etc && \
	mv /build/cacert.pem /opt/etc/ && \
#
#	node.js
#
	curl --location --silent --output /build/node-v${NODE_VERSION}.tar.xz "https://nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.xz" && \
	curl --location --silent --compressed --output /build/SHASUMS256.txt.sig "https://nodejs.org/download/release/v${NODE_VERSION}/SHASUMS256.txt.sig" && \
	curl --location --silent --compressed --output /build/SHASUMS256.txt "https://nodejs.org/download/release/v${NODE_VERSION}/SHASUMS256.txt" && \
	gpg --verify /build/SHASUMS256.txt.sig && \
	grep " node-v${NODE_VERSION}.tar.xz\$" SHASUMS256.txt | sha256sum -c | grep ': OK$' && \
	tar -xf /build/node-v${NODE_VERSION}.tar.xz && \
	rm -f /build/node-v${NODE_VERSION}.tar.xz /build/SHASUMS256.txt.sig /build/SHASUMS256.txt && \
#
#	Compile Node.js
#
	cd /build/node-v${NODE_VERSION} && \
	./configure \
		--ninja \
		--verbose \
		--prefix=/opt \
		--openssl-system-ca-path=/opt/etc/cacert.pem \
		--enable-static \
		--partly-static \
		--with-intl=full-icu && \
	CXXFLAGS="-O3" ninja -C out/Release && \
	make install && \
	strip /opt/bin/node && \
	npm install -g npm@${NPM_VERSION} && \
	curl -sf https://gobinaries.com/tj/node-prune | PREFIX=/opt/bin sh && \
	strip /opt/bin/node-prune && \
	rm -f -R /build

COPY ["npmrc", "/opt/etc/"]
