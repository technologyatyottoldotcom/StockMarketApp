const { conn } = require('../../server/connection');
const IndexChartData = require('express').Router();

function getIndexData(req,res){
    let symbol = req.params.symbol;

    conn.query(`SELECT * FROM IndexData_NSE_BSE_Minute WHERE SYMBOL='${symbol}' 
            AND DATE(TIMESTAMP) = (SELECT DATE(T1.TRADE_DATE) AS TRADE_DATE FROM 
            (SELECT MAX(T2.TIMESTAMP) AS TRADE_DATE FROM IndexData_NSE_BSE_Minute T2) T1)`,(error,result)=>{
        if(!error && result.length > 0)
        {
            // console.log(result);
            res.send({
                symbol : symbol,
                count : result.length,
                chartdata : result
            });
        }
    })    
}

IndexChartData.get('/api/indexdata/:symbol',getIndexData);

exports.IndexChartData = IndexChartData;