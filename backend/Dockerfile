# Use the lightweight Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first so dependencies are cached
COPY package*.json ./

# Install only the packages needed to run the app
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# The API runs on port 5000
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
