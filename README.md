
# eBlocXplore

## [Demo](http://35.227.120.240/)

## Run

`docker-compose up`

This will build the React application, run a NodeJS web server, an ethereum node on private ebloc network and a MongoDB instance. You can check the app on `localhost`

## Development

- Install [MongoDB](https://docs.mongodb.com/manual/installation/)


- Install [geth](https://github.com/ethereum/go-ethereum/wiki/Installing-Geth)


- Navigate into downloaded folder and do: `npm install`


- Setup your environment variables (Easiest way is to use .env file: `cp .env.example .env ` )

### Start geth client:

- `bin/start-geth.sh`
- This will start geth client (initialize if not already) on your with given network configuration. It uses `NETWORK_NAME` environment variable in `.env` file. Network name can be one of `main` (default ethereum blockchain), `ebloc-poa` (our educational school network) and `local` (for test purposes). If local, client will start mining automatically.
- After geth instance started to run, blockchain will be stored in `blockchain/{NETWORK_NAME}`

### Start MongoDB

### Start NodeJS server:

- Run `npm run debug:server`.

- This will start to fetch transactions from geth client in chunks (200 blocks per time) and store the key informations of transactions into database. It will check new blocks every minute once synchronization is complete.

### Start webpack dev server

- Run `npm run debug:client`

- This will run webpack and serve React application on `8080`