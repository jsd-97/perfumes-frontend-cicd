FROM nginx:stable-alpine

EXPOSE 80

WORKDIR /usr/share/app

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY . .