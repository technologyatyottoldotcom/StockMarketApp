const { conn } = require('../../server/connection');
const {getExchangeCode} = require('../../src/exports/MessageStructure');
const Common = require('express').Router();

function getStockFromISIN(req,res)
{
    let isin = req.params.isin;
    // console.log(isin);

    conn.query(`SELECT T1.*,T2.company,T2.code,T2.symbol,T2.exchange,T2.trading_symbol AS filter FROM stock_list_master_reuters_screener_original as T1 
    JOIN master_security_list_NSE as T2 
    ON T2.symbol = T1.nse_code AND T1.ISIN='${isin}'`,(error,result)=>{
        if(!error && result.length > 0)
        {
            let row = result[0];
            res.send({
                error : false,
                message : 'success',
                stock : {
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
                }
            });
        }
        else
        {
            res.send({
                error : true,
                message : error.message
            });
        }
    })

}

function getStockFromSymbol(req,res)
{
    let symbol = req.params.symbol;
    conn.query(`SELECT code,exchange_code FROM master_security_list_NSE WHERE symbol = '${symbol}'
                    UNION
                SELECT code,exchange_code FROM master_security_list_BSE WHERE symbol= '${symbol}' OR code='${symbol}'`,(error,result)=>{
                    if(!error && result.length > 0)
                    {
                        let row = result[0];
                        res.send({
                            error : false,
                            message : 'success',
                            stock : {
                                code : row.code,
                                exchange : row.exchange_code,
                            }
                        });
                    }
                    else
                    {
                        res.send({
                            error : true,
                            message : error.message
                        });
                    }    
                });
}

Common.get('/StockFromISIN/:isin',getStockFromISIN);

Common.get('/StockFromSymbol/:symbol',getStockFromSymbol);

exports.Common = Common;
