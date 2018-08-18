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
      'apiKey' : 'key-3ax6xnjp29jd6fds4gc373sgvjxteol0'
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
