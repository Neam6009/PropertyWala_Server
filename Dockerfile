FROM node:alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3003
CHMOD +x /usr/src/app/node_modules/.bin/nodemon
CMD [ "npm", "run", "start" ]