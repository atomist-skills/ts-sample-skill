# Set up build
FROM node:lts@sha256:5f21943fe97b24ae1740da6d7b9c56ac43fe3495acb47c1b232b0a352b02a25c AS build

WORKDIR /usr/src

COPY . ./

RUN npm ci --no-optional --include=dev \
 && npm run compile test \
 && rm -rf node_modules .git

# Set up runtime container
FROM atomist/skill:alpine_3.16-node_16@sha256:db6b383da5bc60839a7635d0d7e09940ee9b5b77d061f53fa77b2ddca4d33fdd

LABEL com.docker.skill.api.version="container/v2"
COPY skill.yaml /
COPY datalog /datalog

WORKDIR "/skill"

COPY package.json package-lock.json ./

RUN apk add --no-cache \
 npm=8.10.0-r0 \
 && npm ci --no-optional \
 && npm cache clean --force \
 && apk del npm
    
COPY --from=build /usr/src/ .

ENTRYPOINT ["node", "--no-deprecation", "--no-warnings", "--expose_gc", "--optimize_for_size", "--always_compact", "--max_old_space_size=512", "/skill/node_modules/.bin/atm-skill"]
CMD ["run"]
