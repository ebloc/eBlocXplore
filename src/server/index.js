/* eslint-disable no-console */
const chokidar = require('chokidar');
const app = require('./app');

const watcher = chokidar.watch(__dirname);

async function start() {
  try {
    await app.initGlobals();
    global.web3 = await app.initBlockchain();
    global.db = await app.initDB();

    await app.start();

    // restart module and http server when a file changed in server
    watcher.on('ready', () => {
      watcher.on('change', async (path) => {
        console.log('File changed: ', path);
        delete require.cache[path];
        await app.restart();
      });
    });

    // command line arguments
    // const args = yargs
    //   .default('cron', true) // start cronjobs
    //   .argv;
  } catch (err) {
    console.log('Errör');
    console.error(err);
  }
}

start();
