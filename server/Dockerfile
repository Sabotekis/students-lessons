FROM node:lts

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]