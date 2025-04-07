const knex = require('knex')
const knexConfig = require('../../knexfile.js');

const knexConn = knex(knexConfig);
module.exports = knexConn;
