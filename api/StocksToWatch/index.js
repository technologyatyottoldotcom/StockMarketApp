const { conn } = require('../../server/connection');
const StocksToWatch = require('express').Router();
const {getExchangeCode} = require('../../src/exports/MessageStructure');

function getStocks(req,res)
{

    // console.log(req.params);
    let industry = req.params.industry;
    let isin = req.params.isin;
    let quantity = req.params.quantity


    conn.query('SELECT T1.ISIN,T1.name,T1.nse_code,T1.bse_code,T1.ric_code,T1.reuters_industry,T2.*,T3.* FROM stock_list_master_reuters_screener_original T1 JOIN NSE_500_stockList T2 JOIN master_security_list_NSE T3 ON T1.`ISIN` = T2.`ISIN Code` AND T1.reuters_industry="'+industry+'" AND T1.ISIN != "'+isin+'" AND T1.nse_code=T3.symbol',(error,result)=>{
            if(!error)
            {
                if(result.length > 0)
                {


                    let stocks = [];
                    result.forEach(row => {

                        // console.log(row.name);
                        stocks.push({
                            isin : row.ISIN,
                            company : row.company,
                            code : row.code,
                            symbol : row.symbol,
                            exchange : getExchangeCode(row.exchange),
                            ric_code : row.ric_code,
                            nse_code : row.nse_code,
                            bse_code : row.bse_code,
                            name : row.name,
                            industry : row.reuters_industry 
                        })
                    });

                    res.send({
                        error : false,
                        message : 'success',
                        stocks : stocks.sort(() => .5 - Math.random()).slice(0,quantity)
                    })

                    
                }
                else
                {
                    res.send({
                        error : true,
                        message : 'Nothing Similar',
                        stocks : result
                    })
                }
                
            }
            else
            {
                console.log(error);
                res.send({
                    error : true,
                    message : 'connection error',
                    stocks : null
                })
            }
        })
    // res.send({
    //     'msg' : 'hello'
    // })
}

StocksToWatch.get('/api/stockstowatch/:industry/:isin/:quantity',getStocks);

exports.StocksToWatch = StocksToWatch;