import api from './apiMock';

/**
 * @param {string} account
 * @param {object} accountsMap
 */
exports.getAccountText = (account, accountsMap) => {
  if (accountsMap[account]) {
    return accountsMap[account];
  }
  return `${account.slice(20)}...`;
};

exports.api = api;