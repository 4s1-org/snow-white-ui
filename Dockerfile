FROM registry.gitlab.com/4s1/docker/node:14-alpine

WORKDIR /app

COPY package.json     .
COPY pnpm-lock.yaml   .
RUN pnpm i

COPY .prettierignore   .
COPY tsconfig.json     .
COPY .eslintrc.yaml     .
COPY src/    ./src/
COPY public/ ./public/

RUN pnpm run build

EXPOSE 3001
CMD ["pnpm", "run", "start:prod"]
