FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy proto package
COPY --from=protos /protos /protos

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose gRPC port
EXPOSE 50051

# Run the server
CMD ["npm", "start"]