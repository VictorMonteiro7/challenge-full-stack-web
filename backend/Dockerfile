FROM node:20.12.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src ./src

CMD ["npm", "start"]
