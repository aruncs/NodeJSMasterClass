var environments = {};

environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'externalService' : {
    'stripe' : {
      'apiKey' : 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
    },
    'mailgun' : {
      'apiKey' : '12808eece3bfb0fd5db2bb2ae97d371e-a4502f89-4f711aa5'
    }
  }
};

environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret'
};

var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var envToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = envToExport;
