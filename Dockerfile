# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Generate the Prisma client
RUN npm run prisma:generate

# Step 7: Build the application
RUN npm run build

# Step 8: Make the entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

# Step 9: Expose the port the app runs on
EXPOSE 3000

# Step 10: Use the entrypoint script to run the container
CMD ["sh","./docker-entrypoint.sh"]
