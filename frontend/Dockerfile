FROM node:12.22.12-alpine3.15 as builder

WORKDIR /usr/src/app

COPY . .
RUN npm install --production
RUN npm run build --prod

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist/frontend /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
