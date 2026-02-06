# Multi-stage Dockerfile for LeadControl (Vite + React)

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
# We use placeholders for environment variables that will be replaced at runtime
ENV VITE_USER_TABLE_ID=VITE_USER_TABLE_ID_PLACEHOLDER
ENV VITE_BASEROW_BASE_URL=VITE_BASEROW_BASE_URL_PLACEHOLDER
ENV VITE_BASEROW_WORKSPACE_TOKEN=VITE_BASEROW_WORKSPACE_TOKEN_PLACEHOLDER
ENV VITE_CONFIGURATION_TABLE_ID=VITE_CONFIGURATION_TABLE_ID_PLACEHOLDER

RUN npm run build

# Final stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
