FROM node:20.9.0-alpine3.18

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install && npm install -g ts-node

COPY . /app

CMD run start:dev

EXPOSE 3000