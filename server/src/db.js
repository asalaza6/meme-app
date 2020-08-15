const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "hippomeat21",
    host: "localhost",
    port: 5432,
    database: "memelogin"
})

module.exports = pool;