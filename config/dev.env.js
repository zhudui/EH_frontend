var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK_API: '"http://127.0.0.1:8080/api"',
  BASE_API: '"http://127.0.0.1:3000/api"'
});
