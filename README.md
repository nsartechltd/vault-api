# Vault API

## Prerequisites

To use this repo you will need the following:

1. [nvm][nvm] to install, run `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash` to install.
1. [Node.js v16][nodejs]: If you have `nvm` installed you can run `nvm install 14` to install (this is recommended).
1. [Docker >= 20.10.6][docker]: To run locally
1. [docker-compose >= 1.29.1][dockercompose]: To run locally

## Running locally

```bash
# install dependencies
$ npm i

# start docker compose start
$ docker compose up
```

[nvm]: https://github.com/creationix/nvm#installation-and-update
[nodejs]: https://nodejs.org/
[docker]: https://docs.docker.com/get-docker/
[dockercompose]: https://docs.docker.com/compose/install/
