FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

COPY tsconfig.json ./

COPY . .

# Install dependencies
RUN npm install

RUN npx prisma generate

# Bundle app source

# Run app
CMD [ "npm", "start" ]
