    // payrexx.js module content:
const qs = require('qs')
const axios = require('axios')
const Base64 = require('crypto-js/enc-base64')
const hmacSHA256 = require('crypto-js/hmac-sha256')





const baseUrl = 'https://api.payrexx.com/v1.0/'

exports.init = function (instance, secret) {

  function buildSignature (data) {
    let queryStr = '';
    if (data) {
      queryStr = qs.stringify(data, {format: 'RFC1738'});
      queryStr = queryStr.replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
    }
    return Base64.stringify(hmacSHA256(queryStr, secret));
  }

  function buildBaseUrl (path) {
    return baseUrl + path + '?instance=' + instance
  }

  return {
    getGateway: function (id) {
      const baseUrl = buildBaseUrl('Gateway/' + id + '/')
      const url = baseUrl + '&ApiSignature=' + buildSignature()
      return axios.get(url)
    },
    createGateway: function (params) {
      if (!params.amount) {
        throw new Error('Amount required!')
      }

      const defaultParams = {
        currency: 'CHF'
      }

      let queryParams = Object.assign({}, defaultParams, params)

      const signature = buildSignature(queryParams)

      queryParams.ApiSignature = signature
      const queryStrSigned = qs.stringify(queryParams)

      const baseUrl = buildBaseUrl('Gateway/')
      return axios.post(baseUrl, queryStrSigned)
    }
  }
}

// where you want to consume the payrexx module:
const payrexx = payrexx.init(instance, api_secret)
const response = await payrexx.createGateway({
  amount: 100,
  // add more fields here
})

if (response.status === 200) {
  const gateway = response.data.data[0]
  // here you will get the gateway
}
