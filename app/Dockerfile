FROM node:20.9.0-alpine3.18

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

CMD run start:dev

EXPOSE 3000