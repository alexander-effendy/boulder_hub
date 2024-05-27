const { Pool } = require('pg');

const pool = new Pool({
  user: 'alexandereffendy',          
  host: 'localhost',                     
  database: 'boulder_hub',                 
  password: 'testdatabase',      
  port: 5432,                            
});

module.exports = pool;