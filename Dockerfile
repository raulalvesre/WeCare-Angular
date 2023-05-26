# Stage 1: Build the Angular app
FROM node:19.9.0 as build
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm ci

# Copy the entire Angular app to the Docker image
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Serve the built app with a lightweight HTTP server
FROM nginx:1.25.0-alpine

# Copy the built app from the previous stage to the NGINX public directory
COPY --from=build /app/dist/we-care /usr/share/nginx/html

# Copy custom NGINX configuration, if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the NGINX server
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
