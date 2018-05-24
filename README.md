# eBlocXplore

**Website:** http://ebloc.cmpe.boun.edu.tr:8000/blocxplore4.html

**Installation**

- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [geth](https://github.com/ethereum/go-ethereum/wiki/Installing-Geth)


- Navigate into downloaded folder and do: `npm install` 


- Setup your environment variables (Easiest way is to use .env file: `cp .env.example .env ` )

__Start geth client:__

- Make sure you have installed geth
- `bin/start-geth.sh`
- This will start geth client (initialize if not already) on your with given network configuration. It uses `NETWORK_NAME` environment variable in `.env` file. Network name can be one of `main` (default ethereum blockchain), `ebloc-poa` (our educational school network) and `local` (for test purposes). If local, client will start mining automatically.
- After geth instance started to run, blockchain will be stored in `blockchain/{NETWORK_NAME} `folder and logs will be saved to `logs/geth-{NETWORK_NAME}.log` file.
- You can watch geth output by command `tail -f logs/geth-{NETWORK_NAME}.log`.
- use `bin/reset-geth.sh` un order to reset current blockchain by deleting all related files and folders.

__Index transaction into database:__

- Run `node bin/index-txs.js`.
- This will start to fetch transactions from geth client in chunks (100 blocks per time) and store the key informations of transactions into database. It will check new blocks every 30 seconds once synchronization is complete.

**Start development:**

- Make sure you have __[ESLint](https://eslint.org/)__ integrated in your IDE
- (Optional) Open __about:inspect__ or __chrome://inspect__ on a chromium browser (>57) and click __Open dedicated DevTools for Node__ in order to debug NodeJS in Chrome DevTools
- `npm run debug`