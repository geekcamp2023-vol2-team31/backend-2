# stage: deps

FROM node:18-slim as deps
WORKDIR /usr/src/app
# 1. Install deps needed to run the app
COPY ./package.json .
RUN npm install --omit=dev

# stage: builder

FROM node:18-slim as builder
WORKDIR /usr/src/app
# 1. Install dev-dependencies
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY ./package.json .
RUN npm install
# 2. Copy files needed to build the app
# COPY ./scripts ./scripts
COPY ./src ./src
# COPY tailwind.config.js .
COPY tsconfig*.json ./
# 3. Build the app
ENV NODE_ENV=production
# RUN sed -i -z -E 's/  \"exports\"\:.*\n.*\n.*\n.*\n.*\n//mg' ./node_modules/esbuild-plugin-inline-worker/package.json
RUN npm run build

# stage: runtime

FROM node:18-slim as runtime
WORKDIR /usr/src/app
# 1. Copy files needed to run the app
# COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package.json .
COPY --chown=node:node --from=builder /usr/src/app/production ./production
# 2. Install dumb-init
RUN apt-get update\
	&& apt-get install -y --no-install-recommends dumb-init\
	&& apt-get -y clean\
	&& rm -rf /var/lib/apt/lists/*
# 3. Run the app
USER node
EXPOSE 80
CMD ["dumb-init", "node", "./production/server/index.js"]
