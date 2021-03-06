const API_ROOT = `${process.env.API_ENDPOINT}:${process.env.PORT}/api/`; /** @todo get from environment */
const MOCK_API_ROOT = `${process.env.API_ENDPOINT}:${process.env.PORT}/apiMock/`;

const get = async (path, options) => {
  const res = await fetch(API_ROOT + path, options);
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
};

exports.getBlocks = async (start, length) => {
  return await get(`blocks?start=${start}&length=${length}`);
};

exports.getTxs = async (start, length) => {
  return await get(`txs?start=${start}&length=${length}`);
};

exports.getLastTxs = async (length) => {
  return await get(`txs?length=${length}`);
};

exports.getBlock = async (number) => {
  return await get(`blocks/${number}`);
};

exports.getTx = async (hash) => {
  return await get(`txs/${hash}`);
};

exports.getTxsByAccount = async (account, start, length) => {
  return await get(`accounts/${account}/txs?start=${start}&length=${length}`);
};

exports.getAccountBalance = async (account) => {
  return await get(`accounts/${account}/balance`);
}

exports.search = async (query) => {
  return await get(`search/${query}`);
}

