const assert = require('assert');
const fs = require('fs');
const path = require('path');
const transform = require('../src/transform');

const metadata = fs.readFileSync(path.join(__dirname, 'metadata.xml')).toString();

describe('transform()', () => {
  it('loads', () => {
    assert.ok(transform);
  });

  it('parses SAML 2.0 metadata', () => {
    const config = transform(metadata);
    assert.equal(typeof config, 'object');
    assert.equal(config.entryPoint, 'https://adfs.server.url/adfs/ls/');
    assert.equal(config.logoutUrl, 'https://adfs.server.url/adfs/ls/');
    assert.equal(config.identifierFormat, 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress');
    assert.equal(config.cert, 'MIIC3DCCAcSgAwIBAgIQUpAeTBr76KxOOZBzPIhjujANBgkqhkiG9w0BAQsFADAqMSgwJgYDVQQDEx9BREZTIFNpZ25pbmcgLSBzdHMudW5pbGV2ZXIuY29tMB4XDTE0MDEzMDIzMzIwMFoXDTE1MDEzMDIzMzIwMFowKjEoMCYGA1UEAxMfQURGUyBTaWduaW5nIC0gc3RzLnVuaWxldmVyLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKrpuk2psb1teCft5zrrBGzWPtiIA3Ts5opVz/bIBIVaSDnysrUi3JPUuDyx/vVf9F7D7yrPO2IfBI/bSs96fKmXFE5Rg1zsHqBJ58mOuKxwuhL2OffqPZQOyxAthJihayISSqR6mP4Z9J4O8cj6N+pWC3j1wx0Fbu1Nfeo15DHB7U+9N63Ycn7KizSdE2XiRn1veBIOG06RdznoQgK4uTpNJ6hyc+cJjsLid/tWGr4VjXa9qUK/zsVj63TalEKgVf2m8kVaD+8qBecSP9v3wIqW5my+MvCOE3EphfDcWZEPydrEZ2d3aOVMvjjGqDZtdJUBIm0Rmz4dQH8x9aB+PPkCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAAXvZ4ZfFlUGU/y4mB2VYEpxdFBPW8JUT5jeCXRVvGGCyTacDUNJ3w3h0TZ0fTc5jJOZCtFhNOKJQtcCUVxhJbwEBQ4HxuZBUFox0ERohYUcitEntdCU1BYvuHOgAyjpLT4nuCQ5ChomZjs5txPbFZhFKI14G/kwq4A5LRbMT0YCEBBtaqlz+C4ad7WKCq5poS6z825DrsbOBLFj8+FLQtqwiiGhHqxNFtAM1mBq/ES8GNxLANlZZ/Xw9DTnNzaM60hqYIxZmKMdGTCMs4Yu32yyCvQ7QkuKx4pL5N6LA8huxSH+EKuSKfpXOHLbE75oPMKKH+qIehWmVqyCXr2A9Ag==');
  });
});
