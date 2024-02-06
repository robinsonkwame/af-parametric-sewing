# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json (and package-lock.json if available) into the image
COPY ./app/package.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY ./app .

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "run", "dev"]


# # Use the official Node.js 18 image as the base
# FROM node:18

# # Set the working directory in the container
# WORKDIR /app

# # Initialize a new Next.js TypeScript project
# RUN npx create-next-app@latest --ts .

# # Copy the OpenAPI-generated client library
# COPY ./client ../client

# # Copy your Next.js pages
# COPY ./app/pages ./pages

# # Expose the port that Next.js will run on
# EXPOSE 3000

# # Run the development server
# CMD ["npm", "run", "dev"]
