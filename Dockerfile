FROM node:14-alpine

USER node
ENV NODE_ENV development
WORKDIR /home/node/app
RUN sudo mkdir .build