# Use Node 20, which works well with Vite 5+
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package info and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
