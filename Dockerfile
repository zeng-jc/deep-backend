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

FROM node:20.10.0-alpine3.17 as production-build

# 生产
ENV NODE_ENV production

WORKDIR /app

COPY --from=build-stage /app/dist/apps/deep-cms /app/dist/apps/deep-cms
COPY --from=build-stage /app/dist/apps/deep-auth /app/dist/apps/deep-auth
COPY --from=build-stage /app/dist/apps/deep-backend /app/dist/apps/deep-backend

COPY --from=build-stage /app/package.json /app/package.json

COPY --from=build-stage /app/ecosystem.config.js /app/ecosystem.config.js

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

RUN npm install -g pm2

EXPOSE 3001 3002 3003 

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "prod"]
