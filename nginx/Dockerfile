FROM nginx:alpine
COPY --from=murhyun2/theramzee-frontend:latest /usr/share/nginx/html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
#COPY nginx.conf /etc/nginx/conf.d/nginx.conf
RUN mkdir -p /etc/letsencrypt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]