const ENDPOINT = 'http://localhost:8000'; /** @todo get from environment */

module.exports = {
  getBlocks: async (start, count) => {
    try {
      const res = await fetch(`${ENDPOINT}/blocks/start=${start}?count=${count}`);
      if (!res.ok) {
        throw Error('NO');
      }
    } catch (error) {
      return null;
    }
  },
};
