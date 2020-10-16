FROM node:10
WORKDIR /app

COPY ./src/ /app/src
COPY ./package.json /app/

RUN npm install --production

CMD ["npm", "run", "start"]

EXPOSE 8080