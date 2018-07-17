/* eslint-disable no-console */
const chokidar = require('chokidar');

const app = require('./app');
const txIndexer = require('./utils/txIndexer');

const watcher = chokidar.watch(__dirname);
const debug = require('debug');

debug.log = console.log.bind(console);

async function start() {
  try {
    await app.initGlobals();
    global.web3 = await app.initBlockchain();
    global.db = await app.initDB();

    await app.start();
    await txIndexer.start();

    // restart module and http server when a file changed in server
    watcher.on('ready', () => {
      watcher.on('change', async (path) => {
        console.log('File changed: ', path);
        delete require.cache[path];
        await require('./app').restart();
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

process.on('uncaughtException', function(err) {
  // handle the error safely
  console.error('UNCAUGHT EXCEPTION', err)
})

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('UNHANDLED REJECTION', error);
});

start();
