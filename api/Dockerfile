FROM node:18-alpine as builder

WORKDIR /app

RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm i

COPY . .

RUN pnpm prisma generate

FROM builder as production

ENV NODE_ENV production

RUN pnpm run build \
    && pnpm prune --production

CMD ["node", "dist/main.js"]

FROM builder as development

CMD ["npm", "run", "start:dev"]
