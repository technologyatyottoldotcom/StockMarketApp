const { conn } = require('../../server/connection');
const StocksToWatch = require('express').Router();

function getStocks(req,res)
{

    // console.log(req.params);
    let industry = req.params.industry;
    let isin = req.params.isin;


    conn.query('SELECT T1.name AS Name,T1.ISIN,T1.reuters_industry,T2.*,T3.* FROM stock_list_master_reuters_screener T1 JOIN NSE_500_stockList T2 JOIN master_security_list_NSE T3 ON T1.`ISIN` = T2.`ISIN Code` AND T1.reuters_industry="'+industry+'" AND T1.ISIN != "'+isin+'" AND T1.nse_code=T3.symbol',(error,result)=>{
            if(!error)
            {
                if(result.length > 0)
                {

                    res.send({
                        error : false,
                        message : 'success',
                        stocks : result.sort(() => .5 - Math.random()).slice(0,5)
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

StocksToWatch.get('/stockstowatch/:industry/:isin',getStocks);

exports.StocksToWatch = StocksToWatch;