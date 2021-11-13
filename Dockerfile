FROM registry.gitlab.com/4s1/docker/node:14-alpine AS builder

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY package.json .
RUN pnpm install --offline

COPY tsconfig.json .
COPY .npmrc .
COPY .eslintrc.yaml .
COPY src/ ./src/
COPY public/ ./public/
RUN pnpm run build

# -----------------------------
FROM nginx:stable-alpine
COPY --from=builder /app/public /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]
