const { Writable, Readable } = require('stream');
const debug = require('debug');

const utils = require('./index');

const debugRead = debug('worker:tx:read');
const debugWrite = debug('worker:tx:write');

const CHUNK_SIZE = 100; // 100 blocks per read

/**
 * change current block in settings db
 * @param {number} blockNum block number
 * @return {Promise}
 */
const setCurrentBlock = (blockNum) => {
  return db.collection('settings').updateOne(
    { collection: 'txs' },
    { $set: { currentBlock: blockNum } },
    { upsert: true }
  );
}

const writeStream = new Writable({
  objectMode: true,
  /**
   * @param {Array} chunk.documents tx documents to be saved to db
   * @param {Number} chunk.currentBlock to be saved to continue later on
   */
  write: function (chunk, encoding, cb) {
    const { documents, currentBlock } = chunk;

    // just update settings if there is no tx to save
    if (documents.length === 0) {
      debugWrite('No tx found');
      setCurrentBlock(currentBlock).then(() => {
        debugWrite('settings changed');
        cb();
      });
      return;
    }

    db.collection('txs').insertMany(documents)
    .then(res => {
      debugWrite(`${res.insertedCount} of ${documents.length} indexed`);
      return setCurrentBlock(currentBlock);
    })
    .then(() => {
      debugWrite('settings changed');
      cb();
    });
  }
});

const readStream = new Readable({
  objectMode: true,
  read: function () {
    let chunkSize = CHUNK_SIZE; // 100 by default, dynamically set if synchronized
    // get last block number and decide next chunk size
    web3.eth.getBlockNumber().then(lastBlockNumber => {
      if (this.currentBlock + CHUNK_SIZE > lastBlockNumber) {
        chunkSize = lastBlockNumber - this.currentBlock;
      }
      return utils.bc.getTxsByBlocks(this.currentBlock, chunkSize)
    }).then(txs => {
      debugRead(`Fetched ${txs.length} txs of from blocks #${this.currentBlock} to #${this.currentBlock + chunkSize}`);
      const txDocuments = txs.map(tx => ({
        _id: tx.hash,
        from: tx.from,
        to: tx.to,
        blockNumber: tx.blockNumber
      }));

      this.currentBlock += chunkSize;
      // wait 5 seconds if indexing process is synchronized with blockchain
      const idleTime = chunkSize === CHUNK_SIZE ? 0 : 5000;
      setTimeout(() => {
        this.push({
          documents: txDocuments,
          currentBlock: this.currentBlock
        });
      }, idleTime);

    }).catch(err => {
      console.error(err); // eslint-disable-line no-console
    })
  }
});

/**
 * initialize collections for txs and settings accordingly
 */
const initDB = async () => {
  // store last indexed tx in settings collection
  await db.createCollection('settings', { autoIndexId: false });
  await db.collection('txs').createIndex({ from: 1, to: 1 });

  let txsSettings = await db.collection('settings').findOne({ collection: 'txs' });
  if (!txsSettings) {
    txsSettings = {
      collection: 'txs',
      currentBlock: 0,
    };
    await db.collection('settings').insertOne(txsSettings);
  }
};

const resetDB = async () => {
  await db.collection('settings').findOneAndDelete({ collection: 'txs' });
  await db.dropCollection('txs');
}

exports.start = async () => {
  // await resetDB();
  await initDB();
  const currentBlock = (await db.collection('settings').findOne({ collection: 'txs' })).currentBlock;
  debugRead(`starting to index txs from ${currentBlock}`)
  readStream.currentBlock = currentBlock;
  readStream.pipe(writeStream);
}

// exports.restart = async () => {
//   readStream.unpipe(writeStream);
//   console.log('restarting tx indexer');
//   await exports.start();
// }

exports.stop = async () => {
  writeStream.end()
  readStream.push(null);
}