FROM node:14

USER node
ENV NODE_ENV development
WORKDIR /home/node/app
RUN mkdir /home/.build
RUN mv /home/.build /home/node/app/.build