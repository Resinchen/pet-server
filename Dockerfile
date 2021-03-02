FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
COPY ormconfig.json.prod ormconfig.json
EXPOSE 3000

CMD ["node", "build/server.js"]