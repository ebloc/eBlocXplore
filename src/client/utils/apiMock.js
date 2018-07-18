import { blocks, txs } from './mock';

exports.getBlocks = async (start, count) => {
  return blocks.slice(start, count);
};

exports.getTxs = async (start, count) => {
  return txs.slice(start, count);
};

exports.getBlock = async (number) => {
  return blocks.find(block => block && block.number == number);
};

exports.getTx = async (hash) => {
  return txs.find(tx => tx.hash == hash);
};

exports.getAccountData = async (account) => {
  const accountTxs = txs.filter(tx => tx.from === account || tx.to === account);
  const balance  = 10e18;
  return {
    balance,
    txs: accountTxs,
  };
};
