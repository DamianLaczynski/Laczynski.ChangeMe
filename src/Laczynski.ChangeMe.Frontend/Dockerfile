# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./src/Laczynski.ChangeMe.Frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY ./src/Laczynski.ChangeMe.Frontend/ ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /app/dist/laczynski-change-me-frontend/browser/ .

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"] 