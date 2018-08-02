import { combineReducers } from 'redux';

function getAccountsFromStorage() {
  let accounts = localStorage.getItem('accounts');

  if (accounts) {
    return JSON.parse(accounts);
  } else {
    // test accounts
    accounts = {
      '0x42B085Db58Fd54176CFE935dc52e782A8B36DA05': 'Test 1',
      '0x3B027ff2D229dD1C7918910dEe32048F5F65b70d': 'Test 2',
      '0x128c9F368F12C24Cc2a4f88dCDCf3daA13C9667e': 'Test 3'
    };
    localStorage.setItem('accounts', JSON.stringify(accounts));
    return accounts;
  }
}

function saveAccountsToStorage(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

/**
 * check if there is already an account with given name
 * @param {[object]} accounts rootState.accounts
 * @param {string} account
 * @param {string} name
 */
function accountExists(accounts, account, name) {
  for (const nextAccount in accounts) {
    const nextName = accounts[nextAccount];
    if (nextName == name && nextAccount != account) {
      return true;
    }
  }
  return false;
}

/**
 * @param {object} state rootState.account
 * @param {string} action (ADD|REMOVE|CHANGE)_ACCOUNT
 * @return {object} { account: name }
 */
function accounts(state=getAccountsFromStorage(), action) {
  // validaiton
  if (
    action.name &&
    action.rootsState &&
    accountExists(action.rootState.accounts, action.account, action.name)
  ) {
    return state;
  }

  let newState;
  switch (action.type) {
    case 'ADD_ACCOUNT':
      newState = { ...state,  [action.account]: action.name };
      break;
    case 'REMOVE_ACCOUNT': {
      newState = { ...state };
      delete newState[action.account];
      break;
    }
    case 'SET_ACCOUNT_NAME':
      newState = { ...state, [action.account]: action.name }
      break;
    default:
      return state;
  }

  saveAccountsToStorage(newState);
  return newState;
}

/**
 * @param {object} state rootState.home
 * @param {string} action HOME_FETCH_(BLOCKS|TXS)
 * @return {object} {
 *  blockData: { blocks: [Block], loading: bool, error: string }
 *  txData: { txs: [Block], loading: bool, error: string }
 * }}
 */
function home(state, action) {
  switch (action.type) {

    case 'HOME_FETCH_BLOCKS': {
      let newBlockData;
      switch (action.status) {
        case 'request':
          newBlockData = {
            ...state.blockData,
            loading: true
          };
          break;
        case 'success':
          newBlockData = {
            blocks: [...state.blockData.blocks, ...action.blocks],
            loading: false
          };
          break;
        case 'error':
          // @todo
          break;
      }
      return { ...state, blockData: newBlockData };
    }

    case 'HOME_FETCH_TXS': {
      let newTxData;
      switch (action.status) {
        case 'request':
          newTxData = {
            ...state.txData,
            loading: true
          };
          break;
        case 'success':
          newTxData = {
            txs: [...state.txData.txs, ...action.txs],
            start: action.start,
            loading: false
          };
          break;
        case 'error':
          // @todo
          break;
      }
      return { ...state, txData: newTxData };
    }

    default: {
      return {
        blockData: { blocks: [], loading: false },
        txData: { txs: [], loading: false, start: undefined }
      };
    }
  }
}

function blockPage(state={}, action) {
  switch (action.type) {
    case 'FETCH_SINGLE_BLOCK':
      if (action.status == 'request') return { number: action.number, loading: true };
      if (action.status == 'success') return { block: action.block };
      if (action.status == 'error') return { number: action.number, error: 'Not found' };
      return state;
    default:
      return state;
  }
}

function txPage(state={}, action) {
  switch (action.type) {
    case 'FETCH_SINGLE_TX':
      if (action.status == 'request') return { number: action.hash, loading: true };
      if (action.status == 'success') return { tx: action.tx };
      if (action.status == 'error') return { number: action.hash, error: 'Not found' };
      return state;
    default:
      return state;
  }
}

/**
 * @param {object} state rootState.accaountPage.txData
 * @param {{ status, txs, start, total, error }} action
 * @return {{ loading, error, txs }}
 */
function accountTxData(state={ txs: [] }, action) {
  switch (action.type) {
    case 'ACCOUNT_FETCH_TXS':
    switch (action.status) {
      case 'request':
        return {
          ...state,
          error: false,
          loading: true
        };
      case 'success':
        return {
          ...state,
          account: action.account,
          error: false,
          loading: false,
          start: action.start,
          total: action.total,
          txs: state.account != action.account ? action.txs : [...state.txs, ...action.txs]
        };
      case 'error':
        return {
          ...state,
          loading: false,
          error: 'ERROR'
        }
      default:
      return state;
    }
    case 'ACCOUNT_FETCH_BALANCE':
      return { ...state, balance: action.balance };
    default:
      return state;
  }
}

function accountForm(state={}, action) {
  switch (action.type) {
    case 'ADD_ACCOUNT':
    case 'SET_ACCOUNT_NAME':
      if (accountExists(action.rootState.accounts, action.account, action.name)) {
        return { error: 'Account already exists' }
      }
      return { ...state, error: undefined };
    default:
      return state;
  }
}

export default combineReducers({
  accounts,
  home,
  blockPage,
  accountPage: combineReducers({
    form: accountForm,
    txData: accountTxData
  }),
  txPage
});
