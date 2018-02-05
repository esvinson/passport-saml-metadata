const assert = require('assert');
const { DOMParser } = require('xmldom');
const xpath = require('xpath');
const camel = require('camelcase');
const debug = require('debug')('passport-saml-metadata');

class MetadataReader {
  constructor(metadata, options = {}) {
    assert.equal(typeof metadata, 'string', 'metadata must be an XML string');
    const doc = new DOMParser().parseFromString(metadata);

    this.options = options;

    const select = xpath.useNamespaces({
      md: 'urn:oasis:names:tc:SAML:2.0:metadata',
      claim: 'urn:oasis:names:tc:SAML:2.0:assertion',
      sig: 'http://www.w3.org/2000/09/xmldsig#'
    });

    this.query = (query) => {
      try {
        return select(query, doc);
      } catch (e) {
        debug(`Could not read xpath query "${query}"`, e);
        throw e;
      }
    };
  }

  get identifierFormat() {
    try {
      return this.query('//md:IDPSSODescriptor/md:NameIDFormat/text()')[0].nodeValue;
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }

  get identityProviderUrl() {
    try {
      return this.query('//md:IDPSSODescriptor/md:SingleSignOnService[@Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"]/@Location')[0].value;
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }

  get logoutUrl() {
    try {
      return this.query('//md:IDPSSODescriptor/md:SingleLogoutService[@Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"]/@Location')[0].value;
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }

  get encryptionCerts() {
    try {
      return this.query('//md:IDPSSODescriptor/md:KeyDescriptor[@use="encryption"]/sig:KeyInfo/sig:X509Data/sig:X509Certificate')
        .map((node) => node.firstChild.data);
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }

  get encryptionCert() {
    try {
      return this.encryptionCerts[0];
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }

  get signingCerts() {
    try {
      return this.query('//md:IDPSSODescriptor/md:KeyDescriptor[@use="signing"]/sig:KeyInfo/sig:X509Data/sig:X509Certificate')
        .map((node) => node.firstChild.data);
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }

  get signingCert() {
    try {
      return this.signingCerts[0];
    } catch (e) {
      if (this.options.throwExceptions) throw e;
    }
  }
  
  get claimSchema() {
    try {
      return this.query('//md:IDPSSODescriptor/claim:Attribute/@Name')
        .reduce((claims, node) => {
          try {
            const name = node.value;
            const description = this.query(`//md:IDPSSODescriptor/claim:Attribute[@Name="${name}"]/@FriendlyName`)[0].value;
            const camelCase = camel(description);
            claims[node.value] = { name, description, camelCase };
          } catch (e) {
            if (this.options.throwExceptions) throw e;
          }
          return claims;
        }, {});
    } catch (e) {
      if (this.options.throwExceptions) throw e;
      return {};
    }
  }
}

module.exports = MetadataReader;
