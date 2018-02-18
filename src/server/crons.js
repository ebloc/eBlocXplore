
/**
 * start a cronjob get new blocks and index txs per min
 */
const startSyncingTxsCron = async () => {
  // @TODO
  console.error('Transactions cronjobs not implemented'); // eslint-disable-line no-console
};

/**
 * continue to fetch txs of {chunkSize} blocks, get their txs and insert into 'txs' collections,
 * store the last block # in 'settings' collection, and continue from it when server restarted
 * if synchronization is complete, meaning that left blocks are less then {chunkSize},
 * then start a cronjob to fetch txs per minute,
 * else call self recursively after all blocks are synchronized
 *
 * @param {integer} chunkSize # of blocks to sync
 * @return {@TODO}
 */
const continueSyncingTxs = async (chunkSize) => {
  // find the last block with indexed transactions
  const txsSettings = await global.db.collection('settings').findOne({ collection: 'txs' });
  const lastSyncingBlock = txsSettings.lastSyncingBlock || 0;
  // find the last block on the blockchain
  const lastBlock = await global.web3.eth.getBlockNumber();

  // if initial bulk synchronizations are done, only check last txs on cronjob
  if (lastSyncingBlock + chunkSize >= lastBlock) {
    await startSyncingTxsCron();
    return;
  }

  // get blocks which have non-empty txs
  const promises = [...Array(chunkSize).keys()].map(i =>
    global.web3.eth.getBlock(lastSyncingBlock + i));

  const blocks = await Promise.all(promises);
  const blocksWithTx = blocks.filter(block => block.transactions.length);

  // accumulate txs into one array
  const txHashes = blocksWithTx.reduce((acc, block) => {
    acc.push(...block.transactions);
    return acc;
  }, []);

  // insert txs into db
  const txDocuments = txHashes.map(txHash => ({ _id: txHash }));

  let outputStr = `Blocks from ${lastSyncingBlock} to ${lastSyncingBlock + chunkSize} syncing, `;
  if (txDocuments.length) {
    try {
      const result = await global.db.collection('txs').insertMany(txDocuments, { ordered: false });
      outputStr += `${result.insertedCount} of ${txHashes.length} txs indexed`;
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  } else {
    outputStr += 'No transaction found';
  }
  console.log(outputStr); // eslint-disable-line no-console

  // lastSyncingBlock += chunkSize;
  await global.db.collection('settings').updateOne(
    { collection: 'txs' },
    { $set: { lastSyncingBlock: lastSyncingBlock + chunkSize } },
    { upsert: true },
  );
  await continueSyncingTxs(chunkSize);
};

module.exports.start = async () => {
  try {
    await global.db.createCollection('settings', { autoIndexId: false });
    await continueSyncingTxs(100);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};
