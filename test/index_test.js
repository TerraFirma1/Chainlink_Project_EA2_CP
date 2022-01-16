const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { cpkey: 'link-chainlink'} } },
      { name: 'cpkey', testData: { id: jobID, data: { cpkey: 'link-chainlink'} } },
      { name: 'token', testData: { id: jobID, data: { token: 'link-chainlink'} } },
      { name: 'coin', testData: { id: jobID, data: { coin: 'link-chainlink'} } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'cpkey not supplied', testData: { id: jobID, data: { quote: 'USD' } } },
      { name: 'unknown cpkey', testData: { id: jobID, data: { cpkey: 'not_real', quote: 'USD' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
