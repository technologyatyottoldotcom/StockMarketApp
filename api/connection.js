const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config({
    path : '../config.env'
});

var conn = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});

exports.conn = conn;