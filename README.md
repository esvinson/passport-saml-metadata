# passport-saml-metadata

This project provides Metadata-based configuration of the [passport-saml-restify](http://npmjs.org/packages/passport-saml-restify) strategy.

When called, it will attempt to load the metadata XML from the supplied URL. If it fails due to a request timeout or other error, it will attempt to load from the `backupStore` cache.

Metadata-based configuration of SAML login code is better than configuring URLs and certificates because it ensures certificates between a ID Provider and application stay in sync.

## Installation

```
npm install passport-saml-metadata
```

## Usage

```javascript
const os = require('os');
const fileCache = require('file-system-cache').default;
const loadMetadata = require('passport-saml-metadata');
const SamlStrategy = require('passport-saml-restify').Strategy;

loadMetadata({
  url: 'https://adfs.company.com/federationMetadata/2007-06/FederationMetadata.xml',
  timeout: 1500,
  backupStore: fileCache({ basePath: os.tmpdir() })
}).then((config) => {
  // config.entryPoint
  // config.logoutUrl
  // config.cert
  // config.identifierFormat
  passport.use(new SamlStrategy(
    Object.assign(config, {
      path: '/login/callback',
      issuer: 'passport-saml'
    }),
    function(profile, done) {
      done(null, profile);
    }
  ));
});
```

Example app: [compwright/passport-saml-example](https://github.com/compwright/passport-saml-example)
