const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['endpoints/auth.js', 'endpoints/customers.js', 'endpoints/products.js']

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./server.js')
})
