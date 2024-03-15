FROM node:18.8.0-alpine3.16 as appbuild
WORKDIR /usr/src/backend
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM mongo:7.0

ARG DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl gnupg software-properties-common git

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /usr/src/backend
COPY . .
COPY --from=appbuild /usr/src/backend/dist ./dist
COPY --from=appbuild /usr/src/backend/package*.json ./
RUN npm install

EXPOSE 3000

# parse the mips entries
RUN mongod --fork --logpath=/dev/null && \
    npm run pre-start && \
    npx nestjs-command drop:db && \
    npx nestjs-command parse:mips

# start mongo and the app
CMD mongod --fork --logpath=/dev/null && \
    npm run start:prod
