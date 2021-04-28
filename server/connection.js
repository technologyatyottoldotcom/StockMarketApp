const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require('path');


dotenv.config({
    path : path.join(__dirname,'../config.env')
});

var conn = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    multipleStatements : true
});


exports.conn = conn;