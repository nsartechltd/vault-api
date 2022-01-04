FROM node:14

USER node
ENV NODE_ENV development
WORKDIR /home/node/app
RUN sudo mkdir .build