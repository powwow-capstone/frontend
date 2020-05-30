FROM node:12.2.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install and cache app dependencies
COPY package.json  /usr/src/app/package.json

RUN npm install

COPY .  /usr/src/app


CMD [ "npm", "start" ]




