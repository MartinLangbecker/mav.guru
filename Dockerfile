FROM node:22-alpine

WORKDIR /app-src
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY assets ./assets
COPY src ./src

USER node

ENV PORT=3000

CMD ["node", "src/index.js"]
