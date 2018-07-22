import api from './api';

/**
 * @param {string} account
 * @param {object} accountsMap
 */
exports.getAccountText = (account, accountsMap) => {
  if (!account) {
    return '';
  }
  if (accountsMap[account]) {
    return accountsMap[account];
  }
  return `${account.slice(20)}...`;
};

exports.api = api;
