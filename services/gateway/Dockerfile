FROM nginx:alpine

# Copy custom configuration
COPY services/gateway/nginx.conf /etc/nginx/nginx.conf

# Copy static frontend files
COPY public /usr/share/nginx/html
