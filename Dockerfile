

# Use the official Node.js image as a base
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Installing build tools (for Debian-based images)
RUN apt-get update && apt-get install -y build-essential python3

# Copy package.json and package-lock.json for both client and server
COPY ./client/package*.json ./client/
COPY ./server/package*.json ./server/

# Install dependencies for both client and server
RUN cd client && npm install
RUN cd server && npm install

# Copy the rest of the client and server directories
COPY ./client ./client
COPY ./server ./server

# Expose the port that your app will run on
EXPOSE 8080

# Define the command to run your app
# CMD sh -c 'cd server && npm start & cd client && npx serve -s .next/build -l tcp://0.0.0.0:$PORT'
# CMD sh -c 'cd /app/server && npm start & cd /app/client && npx serve -s .next/build -l tcp://0.0.0.0:$PORT'
CMD sh -c 'cd /app/server && npm start & cd /app/client && npx serve -s .next/build -l tcp://0.0.0.0:8080'


# *****************************************************************************


# # Use the official Node.js image as a base
# FROM node:18.13.0
# # Set the working directory
# WORKDIR /app

# # Installing build tools (for Debian-based images)
# RUN apt-get update && apt-get install -y build-essential python3

# # Copy server package.json and package-lock.json
# COPY ./server/package*.json ./server/

# # Install dependencies for the server
# RUN cd server && npm install

# # Copy the rest of the server directory
# COPY ./server ./server

# # Expose the port that your app will run on
# EXPOSE 8080

# # Define the command to run your app
# CMD ["sh", "-c", "cd /app/server && npm start"]










# ******************************************************************

# # Use the official Node.js image as a base
# FROM node:18-slim

# # Set the working directory
# WORKDIR /app

# # Installing build tools
# # RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

# # Copy package.json and package-lock.json for both client and server
# COPY ./client/package*.json ./client/
# COPY ./server/package*.json ./server/



# # Install dependencies for both client and server
# # RUN npm ci --only=production
# RUN cd client && npm install
# RUN cd server && npm install

# # Remove build dependencies after npm install
# RUN apk del .build-deps


# # Copy the rest of the client and server directories
# COPY ./client ./client
# COPY ./server ./server

# # Build the Next.js app
# # RUN cd client && npm run build

# # Expose the port that your app will run on
# EXPOSE 8080

# # Define the command to run your app
# CMD sh -c 'cd server && npm start & cd client && npx serve -s .next/build -l tcp://0.0.0.0:$PORT'
