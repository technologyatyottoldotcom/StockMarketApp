const { conn } = require('../../server/connection');
const  moment   = require('moment');
const IndexChartData = require('express').Router();

function getIndexData(req,res){
    let symbol = req.params.symbol;

    conn.query(`SELECT * FROM IndexData_NSE_BSE WHERE Symbol='${symbol}' ORDER BY Date DESC LIMIT 60`,(error,result)=>{
        if(!error && result.length > 0)
        {
            res.send({
                symbol : symbol,
                count : result.length,
                chartdata : result
            });
        }
    })

    
}


IndexChartData.get('/indexdata/:symbol',getIndexData);

exports.IndexChartData = IndexChartData;