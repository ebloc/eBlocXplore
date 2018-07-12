import { blocks, txs } from './mock';

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.getBlocks = async (start, count) => {
  return blocks.slice(start, count);
};

exports.getTxs = async (start, count) => {
  return txs.slice(start, count);
};
