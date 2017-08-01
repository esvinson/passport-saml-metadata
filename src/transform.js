const xpath = require('xpath');
const { DOMParser } = require('xmldom');

function metadataToConfig(metadata = '') {
  if (typeof metadata !== 'string') {
    throw new Error('metadata must be an XML string');
  }

  const doc = new DOMParser().parseFromString(metadata);
  const select = xpath.useNamespaces({
    md: 'urn:oasis:names:tc:SAML:2.0:metadata',
    sig: 'http://www.w3.org/2000/09/xmldsig#'
  });

  let identifierFormat, entryPoint, logoutUrl, certs;

  try {
    identifierFormat = select('//md:IDPSSODescriptor/md:NameIDFormat/text()', doc)[0].nodeValue;
  } catch (e) {
    // ignore
  }

  try {
    entryPoint = select('//md:IDPSSODescriptor/md:SingleSignOnService[@Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"]/@Location', doc)[0].value;
  } catch (e) {
    throw new Error('Missing //IDPSSODescriptor/SingleSignOnService/@Location');
  }

  try {
    logoutUrl = select('//md:IDPSSODescriptor/md:SingleLogoutService[@Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"]/@Location', doc)[0].value;
  } catch (e) {
    throw new Error('Missing //IDPSSODescriptor/SingleLogoutService/@Location');
  }

  try {
    certs = select('//md:IDPSSODescriptor/md:KeyDescriptor[@use="signing"]/sig:KeyInfo/sig:X509Data/sig:X509Certificate', doc)
      .map((node) => node.firstChild.data);
  } catch (e) {
    throw new Error('Missing //IDPSSODescriptor/KeyDescriptor[@use="signing"]/KeyInfo/X509Data/X509Certificate');
  }

  return {
    entryPoint,
    logoutUrl,
    cert: certs[0],
    identifierFormat
  };
}

module.exports = metadataToConfig;
