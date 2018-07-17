exports.bc = require('./bc');

/**
 * surround a promise with try/catch block
 * @param  {AsyncFunction} fn
 * @return {AsyncFunction}
 */
exports.wrap = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.sendStatus(500);
    }
  };
}
