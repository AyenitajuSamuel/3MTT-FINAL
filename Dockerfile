FROM nginx:alpine

# Copy static web page files
COPY . /usr/share/nginx/html/

# Expose default HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]