# Set up build
FROM node:lts@sha256:6155ff062c403e99c1da7c317710c5c838c1e060f526d98baea6ee921ca61729 AS build

WORKDIR /usr/src

COPY . ./

RUN npm ci --no-optional --also=dev \
 && npm run skill \
 && rm -rf node_modules .git

# Set up runtime container
FROM atomist/skill:alpine_3.15-node_16@sha256:fbb280e625a68ab37088c43072235a68049c9a4fc358eb0bf164faad3a362b1a

# container-diff
RUN curl -sLO https://storage.googleapis.com/container-diff/latest/container-diff-linux-amd64 \
 && chmod +x container-diff-linux-amd64 \
 && mv container-diff-linux-amd64 /usr/bin/container-diff \
 && container-diff version

WORKDIR "/skill"

COPY package.json package-lock.json ./

RUN apk add --no-cache \
 npm=8.1.3-r0 \
 python3=3.9.7-r4 \
 make=4.3-r0 \
 g++=10.3.1_git20211027-r0 \
 && npm ci --no-optional \
 && npm cache clean --force \
 && apk del npm python3 make g++
    
COPY --from=build /usr/src/ .

ENTRYPOINT ["node", "--no-deprecation", "--no-warnings", "--expose_gc", "--optimize_for_size", "--always_compact", "--max_old_space_size=512", "/skill/node_modules/.bin/atm-skill"]
CMD ["run"]
