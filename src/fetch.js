const assert = require('assert');
const request = require('superagent');
const debug = require('debug')('passport-saml-metadata');

const defaults = {
  timeout: 2000,
  backupStore: new Map()
};

module.exports = (config = {}) => {
  const { url, timeout, backupStore } = Object.assign({}, defaults, config);

  assert.ok(url, 'url is required');
  assert.ok(backupStore, 'backupStore is required');
  assert.equal(typeof backupStore.get, 'function', 'backupStore must have a get(key) function');
  assert.equal(typeof backupStore.set, 'function', 'backupStore must have a set(key, value) function');

  debug('Loading metadata', url);

  return request.get(url)
    .timeout(timeout)
    .buffer(true)
    .then((res) => {
      debug('Metadata loaded', res.text.length);
      backupStore.set(url, res.text);
      return res.text;
    })
    .catch((err) => {
      let error = err;

      // Superagent emits errors with error.response instead of error.message
      if (err.response) {
        error = new Error(err.response.body.message);
        error.status = err.response.status;
      }

      debug('Metadata request failed, attempting backup store');
      return Promise.resolve(backupStore.get(url))
        .then((data) => {
          if (!data) {
            debug('Backup store was empty');
            return Promise.reject(error);
          }

          debug('Metadata loaded from backupStore', data.length);
          return data;
        })
        .catch((err) => {
          debug('Backup store request error', err);
          return Promise.reject(error);
        });
    });
};
