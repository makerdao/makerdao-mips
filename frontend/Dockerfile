FROM node:14.16.1-alpine3.13 as builder
#FROM node:18.8.0-alpine3.16 TODO Upgrade

WORKDIR /usr/src/app

COPY . .

RUN npm install

ARG ENV=dev
RUN if [ "$ENV" = "prod" ]; then npm run build-prod; else npm run build; fi

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist/frontend /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
