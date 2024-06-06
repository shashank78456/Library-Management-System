const mysql = require("mysql2");
require("dotenv").config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DATABASE;

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
});

db.connect((err) => {
    if(err)
        throw err;
    else
        console.log("Connected to Database");
});

module.exports = db;