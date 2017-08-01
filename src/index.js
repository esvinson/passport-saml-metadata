const fetch = require('./fetch');
const transform = require('./transform');

const defaults = {
  timeout: 2000,
  backupStore: new Map()
};

module.exports = (config = {}) => {
  const options = Object.assign({}, defaults, config);
  return fetch(options).then(transform);
};
