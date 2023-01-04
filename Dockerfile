FROM node:16-alpine

USER root
ENV NODE_ENV development
WORKDIR /home/node/app