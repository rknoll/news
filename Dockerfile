FROM node:8

ARG NEWSAPI__API_KEY
ARG WEBPUSH__PRIVATE_KEY
ARG WEBPUSH__PUBLIC_KEY

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --production

EXPOSE 3000

ENV PORT=3000
ENV NEWSAPI__API_KEY=$NEWSAPI__API_KEY
ENV WEBPUSH__PRIVATE_KEY=$WEBPUSH__PRIVATE_KEY
ENV WEBPUSH__PUBLIC_KEY=$WEBPUSH__PUBLIC_KEY

CMD [ "npm", "start" ]
