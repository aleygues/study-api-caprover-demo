FROM node:alpine

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

CMD cd dist && node index.js