# syntax=docker/dockerfile:1
FROM node:8.5.0

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g nodemon
RUN npm install express --save
RUN npm install mongoose
RUN npm install dotenv --save

COPY . .

CMD ["npm", "start"]