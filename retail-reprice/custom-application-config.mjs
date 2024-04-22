import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Retail Reprice',
  entryPointUriPath,
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  additionalEnv: {
    googleMapApiKey: '${env:GOOGLE_MAP_API_KEY}',
  },
  headers: {
    csp: {
      'connect-src': [
        'https://*.googleapis.com',
        '*.google.com',
        'https://*.gstatic.com',
      ],
      'script-src': [
        'https://*.googleapis.com',
        'https://*.gstatic.com',
        '*.google.com',
        'https://*.ggpht.com',
        '*.googleusercontent.com',
      ],
    },
  },
  oAuthScopes: {
    view: [
      'view_products',
      'view_standalone_prices',
      'view_stores',
      'view_key_value_documents',
      'view_business_units',
    ],
    manage: [
      'manage_products',
      'manage_standalone_prices',
      'manage_stores',
      'manage_key_value_documents',
      'manage_business_units',
    ],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/pricetag.svg}',
  mainMenuLink: {
    defaultLabel: 'Retail Reprice',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};

export default config;
