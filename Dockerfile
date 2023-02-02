FROM node:19-alpine as builder

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

COPY . ./

RUN npm run build

FROM nginx:1.23-alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY docker-assets/nginx.conf /etc/nginx/conf.d/default.conf
