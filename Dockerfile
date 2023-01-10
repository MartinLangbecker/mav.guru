# install dependencies
FROM node:current-alpine3.16
RUN npm i -g pnpm

WORKDIR /app-src
COPY assets ./assets

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY src ./src
RUN pnpm run build

USER node

ENV PORT=3000

CMD ["pnpm", "run", "start"]
