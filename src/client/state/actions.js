import { api } from 'Utils';

/**
 * returns a function that dispatches an action and attaches root state to it
 * @param {function} actionCreator function that returns action
 */
const attachRootState = (actionCreator) => {
  return (...args) => {
    return (dispatch, getState) => {
      const action = actionCreator(...args);
      action.rootState = getState();
      dispatch(action);
    }
  }
}

exports.addAccount = attachRootState(
  (account, name) => ({ type: 'ADD_ACCOUNT', account, name })
);
exports.removeAccount = (account) => ({ type: 'REMOVE_ACCOUNT', account });
exports.setAccountName = attachRootState(
  (account, name) => ({ type: 'SET_ACCOUNT_NAME', account, name })
);

const requestBlocks = () => ({ type: 'HOME_FETCH_BLOCKS', status: 'request' });
const receiveBlocks = (blocks) => ({ type: 'HOME_FETCH_BLOCKS', status: 'success', blocks });
const failBlocks = (error) => ({ type: 'HOME_FETCH_BLOCKS', status: 'error', error });

exports.fetchBlocks = () => {
  const BLOCK_CHUNK_SIZE = 10;

  return (dispatch, getState) => {
    const { blocks, loading } = getState().home.blockData;
    if (loading) return;
    dispatch(requestBlocks());
    // start from the latest block if there is none
    const newStartingBlockNum = blocks.length
      ? blocks[blocks.length - 1].number - BLOCK_CHUNK_SIZE
      : 'last';

    api.getBlocks(newStartingBlockNum, BLOCK_CHUNK_SIZE)
      .then(newBlocks => dispatch(receiveBlocks(newBlocks.reverse())))
      .catch(err => dispatch(failBlocks(err.message)));
  }
}

const requestHomeTxs = () => ({ type: 'HOME_FETCH_TXS', status: 'request' });
/**
 * @param {[Tx]} txs
 * @param {number} start the starting number of new incoming txs, used for next calculation
 */
const receiveHomeTxs = (txs, start) => ({ type: 'HOME_FETCH_TXS', status: 'success', txs, start });
const failHomeTxs = (error) => ({ type: 'HOME_FETCH_TXS', status: 'error', error });

exports.fetchHomeTxs = () => {
  const TX_CHUNK_SIZE = 10;

  return (dispatch, getState) => {
    const { start, loading } = getState().home.txData;
    if (loading) return;
    dispatch(requestHomeTxs());
    // start from the latest tx if there is none
    const nextStart = start
      ? start - TX_CHUNK_SIZE
      : 'last';

    api.getTxs(nextStart, TX_CHUNK_SIZE)
      .then(res => dispatch(receiveHomeTxs(res.txs.reverse(), res.start)))
      .catch(err => dispatch(failHomeTxs(err.message)));
  }
}

const requestBlock = (number) => ({ type: 'FETCH_SINGLE_BLOCK', status: 'request', number });
const receiveBlock = (block) => ({ type: 'FETCH_SINGLE_BLOCK', status: 'success', block });
const failBlock = (number) => ({ type: 'FETCH_SINGLE_BLOCK', status: 'error', number });

// block detail page
exports.fetchSingleBlock = (blockNumber) => {
  return (dispatch, getState) => {
    const { block, loading, error, number } = getState().blockPage;
    if (loading) return;
    if (error && blockNumber == number) return; // if requested block is tried to fetch and not found
    if (block && blockNumber == block.number) return; // if requested block is already fetched
    dispatch(requestBlock(blockNumber));
    api.getBlock(blockNumber)
      .then(block => dispatch(receiveBlock(block)))
      .catch(() => dispatch(failBlock(blockNumber)));
  }
}

const requestTx = (hash) => ({ type: 'FETCH_SINGLE_TX', status: 'request', hash });
const receiveTx = (tx) => ({ type: 'FETCH_SINGLE_TX', status: 'success', tx });
const failTx = (hash) => ({ type: 'FETCH_SINGLE_TX', status: 'error', hash });

// tx detail page
exports.fetchSingleTx = (nextHash) => {
  return (dispatch, getState) => {
    const { tx, loading, error, hash } = getState().txPage;
    if (loading) return;
    if (error && nextHash == hash) return; // if requested block is tried to fetch and not found
    if (tx && nextHash == tx.hash) return; // if requested block is already fetched
    dispatch(requestTx(nextHash));
    api.getTx(nextHash)
      .then(tx => dispatch(receiveTx(tx)))
      .catch(() => dispatch(failTx(nextHash)));
  }
}

const requestAccountTxs = () => ({ type: 'ACCOUNT_FETCH_TXS', status: 'request' });
/**
 * @param {[Tx]} txs
 * @param {number} start the starting number of new incoming txs, used for next calculation
 * @param {number} total total # of txs
 */
const receiveAccountTxs = (account, txs, start, total) => ({ type: 'ACCOUNT_FETCH_TXS', status: 'success', account, txs, start, total });
const failAccountTxs = (error) => ({ type: 'ACCOUNT_FETCH_TXS', status: 'error', error });

exports.fetchAccountTxs = (nextAccount) => {
  const TX_CHUNK_SIZE = 50;

  return (dispatch, getState) => {
    const { account, start, loading } = getState().accountPage.txData;

    if (loading) return;
    dispatch(requestAccountTxs());
    // start from the latest tx if there is none
    let nextStart = start
      ? start - TX_CHUNK_SIZE
      : 'last';

    // set starting index to 0 if there are txs left less then chunk size
    let newChunkSize = TX_CHUNK_SIZE;
    if (nextStart < 0) {
      newChunkSize += nextStart;
      nextStart = 0;
    }

    // if route chnaged
    if (account != nextAccount) {
      nextStart = 'last';
      newChunkSize = TX_CHUNK_SIZE;
    }

    api.getTxsByAccount(nextAccount, nextStart, newChunkSize)
      .then(res => dispatch(receiveAccountTxs(nextAccount, res.txs.reverse(), res.start, res.total)))
      .catch(err => dispatch(failAccountTxs(err.message)));
  }
}

const receiveAccountBalance = (balance) => ({ type: 'ACCOUNT_FETCH_BALANCE', balance });

exports.fetchAccountBalance = (account) => {
  return (dispatch) => {
    api.getAccountBalance(account)
      .then(balance => dispatch(receiveAccountBalance(balance)));
  }
}