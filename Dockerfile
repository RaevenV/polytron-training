FROM node:18-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add tzdata

RUN apk add --update

RUN npm i -g node-gyp
RUN npm i

COPY . .

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache
    
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
