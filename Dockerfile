FROM registry.gitlab.com/4s1/docker/node:14-alpine

WORKDIR /app

COPY package.json     .
COPY pnpm-lock.yaml   .
RUN pnpm i -r
COPY . .

RUN pnpm run build

EXPOSE 3001
CMD ["pnpm", "run", "start"]
