import api from './api';

/**
 * @param {string} account
 * @param {object} accountsMap
 */
exports.getAccountText = (account, accountsMap) => {
  if (!account) {
    return '-';
  }
  if (accountsMap[account]) {
    return accountsMap[account];
  }
  return account;
};

/**
 * @param {date} date
 */
exports.formatDate = (date) => {
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

exports.api = api;
