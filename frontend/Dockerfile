FROM node:14.16.1-alpine3.13 as builder

WORKDIR /usr/src/app

COPY . .

RUN npm install

# prod
RUN npm run build-prod
# dev
# RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist/frontend /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
