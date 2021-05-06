const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require('path');


dotenv.config({
    path : path.join(__dirname,'../config.env')
});

// var conn = mysql.createConnection({
//     host : process.env.HOST,
//     user : process.env.USER,
//     password : process.env.PASSWORD,
//     database : process.env.DATABASE,
//     multipleStatements : true
// });

var conn = mysql.createConnection({
    host : 'yottol-rds.copzpeo4bk3d.ap-south-1.rds.amazonaws.com',
    user : 'root',
    password : 'BxCdkbmW8gVG1Cj5jpA0',
    database : 'yottol-stocks',
    multipleStatements : true
});


exports.conn = conn;