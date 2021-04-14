FROM node:14

# Create app directory
WORKDIR ./user/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
RUN npm build

# Bundle app source
COPY . .

CMD [ "npm", "start"]