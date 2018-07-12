require('dotenv').config()
const environment = process.env.NODE_ENV;
<<<<<<< Updated upstream
const config = require('../../knexfile.js')[environment]
=======
const config = require('../../knexfile.js')["development"]
>>>>>>> Stashed changes

module.exports = require('knex')(config)