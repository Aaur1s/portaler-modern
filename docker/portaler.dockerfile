FROM node:18.12-alpine as build

WORKDIR /usr/build

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY shared ./shared
COPY packages/api-server ./packages/api-server
COPY packages/bin-etl ./packages/bin-etl
COPY packages/discord-bot ./packages/discord-bot

RUN yarn install --non-interactive --pure-lockfile

RUN yarn build:shared
RUN yarn build:api
RUN yarn build:binetl
RUN yarn build:bot
RUN yarn clean
RUN yarn add dotenv -W

FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt update && \
    apt -qy full-upgrade && \
    apt -qy install sudo && \
    apt install -qy curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs && \
    apt install -qy screen && \
    apt install -qy redis-server

WORKDIR /home

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY --from=build /usr/build/node_modules /home/node_modules
COPY --from=build /usr/build/packages /home/packages
COPY --from=build /usr/build/shared /home/shared

EXPOSE 4242

COPY docker/entrypoint.sh ./entrypoint.sh
COPY docker/restart_api.sh ./restart_api.sh
COPY docker/kill_api.sh ./kill_api.sh
COPY docker/restart_etl.sh ./restart_etl.sh
COPY docker/kill_etl.sh ./kill_etl.sh
COPY docker/restart_bot.sh ./restart_bot.sh
COPY docker/kill_bot.sh ./kill_bot.sh
RUN ["chmod", "+x", "./restart_api.sh"]
RUN ["chmod", "+x", "./kill_api.sh"]
RUN ["chmod", "+x", "./restart_etl.sh"]
RUN ["chmod", "+x", "./kill_etl.sh"]
RUN ["chmod", "+x", "./restart_bot.sh"]
RUN ["chmod", "+x", "./kill_bot.sh"]
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]
