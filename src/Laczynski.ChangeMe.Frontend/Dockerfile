FROM node:22-alpine AS build
WORKDIR /app

COPY src/Laczynski.ChangeMe.Frontend/package*.json ./
RUN npm ci

COPY src/Laczynski.ChangeMe.Frontend/ ./
RUN npm run build

FROM nginx:1.29-alpine AS final
WORKDIR /usr/share/nginx/html

COPY src/Laczynski.ChangeMe.Frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/Laczynski.ChangeMe.Frontend/browser/ ./

EXPOSE 80
