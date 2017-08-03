const entries = require('core-js/library/fn/object/entries');
const debug = require('debug')('passport-saml-metadata');

function toPassportConfig(reader = {}) {
  const { identifierFormat, identityProviderUrl, logoutUrl, signingCert } = reader;

  const config = {
    identityProviderUrl,
    logoutUrl,
    cert: signingCert,
    identifierFormat
  };

  debug('Extracted configuration', config);

  return config;
}

function claimsToCamelCase(claims, claimSchema) {
  const obj = {};

  for (let [key, value] of entries(claims)) {
    try {
      obj[claimSchema[key].camelCase] = value;
    } catch (e) {
      debug(`Error while translating claim ${key}`, e);
    }
  }

  return obj;
}

module.exports = {
  toPassportConfig,
  claimsToCamelCase
};
