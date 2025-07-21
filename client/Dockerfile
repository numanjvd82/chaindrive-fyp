FROM node:24.2.0-bookworm

# === Install client dependencies ===
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
# === Build the client application ===
# Increase memory limit for the build process
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Production stage with NGINX
FROM nginx:stable-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]