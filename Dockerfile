# 构建
FROM node:20.10.0-alpine3.17 as build-stage

WORKDIR /app

COPY package.json .

COPY ecosystem.config.js .

RUN npm config set registry http://registry.npmmirror.com/

RUN npm install 

COPY  . . 

RUN npm run build deep-cms && \
    npm run build deep-auth && \
    npm run build deep-backend

# 生产
FROM node:20.10.0-alpine3.17 as production-build

ARG APP_ENV=production

ENV NODE_ENV=${APP_ENV}

WORKDIR /app

COPY --from=build-stage /app/dist/apps/ ./dist/apps/
COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/ecosystem.config.js ./
COPY --from=build-stage /app/secretKey ./secretKey

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --only=--production
RUN npm install -g pm2

EXPOSE 3001 3002 3003 

CMD pm2-runtime ecosystem.config.js --env {APP_ENV}
