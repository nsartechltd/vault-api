FROM node:14-alpine

RUN apk --no-cache add curl

RUN echo $TRUE_LAYER_API_URL
RUN echo $TRUE_LAYER_CLIENT_ID

USER node
ENV NODE_ENV development
WORKDIR /home/node/app