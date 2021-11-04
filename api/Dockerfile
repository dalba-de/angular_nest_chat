FROM node:14

WORKDIR /dalba-de/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000