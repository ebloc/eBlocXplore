# eBlocXplore

**Website:** http://ebloc.cmpe.boun.edu.tr:8000/blocxplore4.html

**Installation**

- Install [MongoDB](https://docs.mongodb.com/manual/installation/)


- Navigate into downloaded folder and do: `npm install` 


- Setup your environment variables (Easiest way is to use .env file: `cp .env.example .env ` )

**To run:**

- `nohup nodejs src/server &`

**To start development:**

- Make sure you have __[ESLint](https://eslint.org/)__ integrated in your IDE
- (Optional) Open __about:inspect__ or __chrome://inspect__ on a chromium browser (>57) and click __Open dedicated DevTools for Node__ in order to debug NodeJS in Chrome DevTools
- `npm run debug`
- By default, server starts to synchronize transactions into database, you can disable with `—no-cron` if it is not your concern (`npm run debug -- --no-cron`)