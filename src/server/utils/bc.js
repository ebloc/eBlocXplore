exports.isHash = hash => /^(0x)?[0-9a-f]{64}$/.test(hash) || /^(0x)?[0-9A-F]{64}$/.test(hash);

exports.isBlockNumber = blockNumber => /^\d{1,7}$/.test(blockNumber);

exports.isContract = async (address) => {
  if (!web3.utils.isAddress(address)) return false;
  const bytecode = await web3.eth.getCode(address);
  return bytecode !== '0x';
};

/**
 * get all blocks between {start} and {start + length}
 * @param  {number} start  first block
 * @param  {number} length
 * @return {array}          blocks in descending order
 */
exports.getBlocks = async (start, length) => {
  const promises = [];
  for (let i = start; i <= start + length; i++) {
    promises.push(web3.eth.getBlock(i));
  }
  const blocks = await Promise.all(promises);
  // first block is the most recent one
  return blocks.sort((a, b) => b.number - a.number);
}

/**
 * get all txs between {start} and {start + length}
 * @param  {number} start  first tx index
 * @param  {number} length
 * @return {array}  blocks in descending order
 */
exports.getTxs = async (start, length) => {
  const txDocs = await db.collection('txs')
    .find({})
    .skip(start)
    .limit(length)
    .toArray();

  const promises = txDocs.map(tx => web3.eth.getTransaction(tx._id));
  const txs = await Promise.all(promises);

  /** @todo handle this */
  // get block numbers and remove duplicates
  // const blockNumbers = txs
  //   .map(tx => tx.blockNumber)
  //   .filter((blockNum, i, arr) => arr.indexOf(blockNum) === i);

  // get globks and transform into object as { blockNumber: block }
  // const blockArr = await Promise.all(blockNumbers.map(web3.eth.getBlock));
  // const blockObj = {};
  // for (const block of blockArr) {
  //   blockObj[block.number] = block;
  // }

  // for (const tx of txs) {
  //   tx.blockTimestamp = blockObj[tx.blockNumber].timestamp;
  //   tx.value = web3.utils.fromWei(tx.value);
  // }
  return txs;
}

/**
 * get txs of an address
 * @todo pagination
 * @param  {string} address
 * @return {[Transaction]}
 */
exports.getTxsByAddress = async (address) => {
  const query = {
    $or: [
      { from: address },
      { to: address },
    ],
  };
  const txDocs = await db.collection('txs').find(query).toArray();

  const promises = txDocs.map(tx => web3.eth.getTransaction(tx._id));
  const txs = await Promise.all(promises);

  for (const tx of txs) {
    tx.value = web3.utils.fromWei(tx.value);
  }

  return txs;
}

/**
 * get txs of an address together with contract internal txs
 * @param  {string} address
 * @return {mixed}
 */
exports.getTxsWithInternals = async (address) => {
  const txs = await exports.getTxsByAddress(address);
  const promises = txs.map(tx => web3.debug.traceTransaction(tx.hash, { tracer: 'callTracer' }));
  const traces = await Promise.all(promises);

  // assign logs to the relevant tx
  traces.forEach((trace, i) => {
    if (trace.calls) {
      // remove non-transaction calls like events
      trace.calls = trace.calls.filter((call) => {
        call.value = web3.utils.fromWei(web3.utils.toBN(call.value));
        return call.value !== '0x0' || call.value !== '0x';
      });

      txs[i].calls = trace.calls;
    }
  });

  return txs;
}

/**
 * get txs within gien blocks by order
 * @param {number} startBlock
 * @param {number} length
 */
exports.getTxsByBlocks = async (startBlock, length) => {
  const promises = [];
  for (let i = startBlock; i < startBlock + length; i++) {
    promises.push(web3.eth.getBlock(i, true));
  }

  const blocks = await Promise.all(promises);
  const blocksWithTx = blocks.filter(block => block.transactions.length);

  const txs = blocksWithTx.reduce((acc, block) => {
    acc.push(...block.transactions);
    return acc;
  }, []);

  return txs;
}

/**
 * @return {number}
 */
exports.getLastTxNumber = async () => {
  const count = (await db.collection('txs').count());
  return count - 1;
}
