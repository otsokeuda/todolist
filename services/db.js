const mysql = require('mysql');
const conn = mysql.createConnection({
 host: "127.0.0.1",
 port: "3306",
 user: "root",
 password: "v2k4dDbE5#%123",
 database: "todos",
});

conn.connect();

module.exports = conn;
