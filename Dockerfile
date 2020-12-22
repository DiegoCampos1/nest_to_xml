FROM node:12-alpine AS builder
ARG NODE_ENV=development
ENV NODE_ENV ${NODE_ENV}
ENV NPM_CONFIG_PREFIX /home/node/.npm-global
WORKDIR /home/node/app
COPY package*.json ./
RUN \
yarn add global typescript && \
yarn install --only=development && \
yarn cache clean
COPY . .
RUN \
yarn build || exit 1

# Produção

FROM node:12-alpine as prod
WORKDIR /home/node/app
COPY --from=builder /home/node/app/package*.json /home/node/app/.env ./
RUN apk --no-cache add curl && \
yarn install --production && \
yarn cache clean
COPY --chown=node:node --from=builder /home/node/app/dist ./dist
USER node
ENV PATH ${NPM_CONFIG_PREFIX}/bin:$PATH
CMD ["node", "./dist/main"]