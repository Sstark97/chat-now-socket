FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm run start

# Bundle app source

COPY . .

# Expose port 3000
EXPOSE 3000