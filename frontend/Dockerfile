FROM node:18-alpine as builder
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN npm install -g pnpm
COPY . .
RUN pnpm i
RUN pnpm build

FROM builder as development
CMD ["pnpm", "dev"]

FROM caddy:2 as production
COPY ./Caddyfile /etc/caddy/Caddyfile  
COPY --from=builder /app/dist /srv  
