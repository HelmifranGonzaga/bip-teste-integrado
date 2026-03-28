FROM node:22-alpine AS build
WORKDIR /app

# CI build: avoid lifecycle scripts (e.g., husky prepare) during dependency install
ENV CI=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --configuration production

# Run stage
FROM nginx:alpine
# Copy the built app to nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
