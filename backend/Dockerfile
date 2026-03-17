# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
COPY dist /app/dist

RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 8080

# Command to start your app
CMD ["node", "dist/server.js"]
