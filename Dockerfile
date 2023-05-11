FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm install


# Bundle app source

COPY . .

# Run app
CMD [ "npm", "start" ]
