FROM node:18.5.0 AS builder

WORKDIR /app

RUN chown -R node:node /app && mkdir /opt/node_modules && chown -R node:node /opt/node_modules

COPY --chown=node:node ["package.json", "package-lock.json", "/app/"]

USER node

RUN npm ci --loglevel verbose

COPY --chown=node:node [".", "/app/"]

RUN npm run build

FROM nginx:1.25.3-alpine3.18 AS prod

COPY --chown=nginx:nginx --from=builder ["/app/build", "/usr/share/nginx/html"]
COPY ["./default.conf", "/etc/nginx/conf.d/default.conf"]
COPY ["./nginx.conf", "/etc/nginx/nginx.conf"]
