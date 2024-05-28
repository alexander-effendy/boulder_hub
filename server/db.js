// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'alexandereffendy',          
//   host: 'localhost',                     
//   database: 'boulder_hub',                 
//   password: 'testdatabase',      
//   port: 5432,                            
// });

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: 'boulder_hub',
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// module.exports = pool;

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
