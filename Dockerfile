FROM nginx:alpine

# Copy game files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY game3d.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY photos/ /usr/share/nginx/html/photos/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
