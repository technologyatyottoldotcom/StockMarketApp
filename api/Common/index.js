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

function LatestPriceIndex(req,res)
{
    const symbol = req.params.symbol;
    let close;
    conn.query(`SELECT * FROM IndexData_NSE_BSE WHERE Symbol = '${symbol}' ORDER BY Date DESC LIMIT 2`,(err,result)=>{
        if(!err)
        {
            result.forEach((row)=>{
                close = row['Close'];
            });

            res.send({
                status : 'success',
                close : parseFloat(close)
            })
        }
        else
        {
            res.send({
                status : 'error'
            })
        }
    });

    
}

function IndicesList(req,res)
{
    const pan = req.params.pan;
    conn.query(`SELECT * FROM frontend_user_indices WHERE pan="${pan}"`,(err,result)=>{
        if(!err)
        {
            res.send({
                status : 'success',
                data : result
            })
        }
        else
        {
            console.log(err);
            res.send({
                status : 'failure'
            })
        }
    })
}

function SaveUserIndices(req,res)
{


    async function updateIndexOrder(pan,dataarray)
    {
        const promises = dataarray.map((data)=>{
            return new Promise((resolve,reject)=>{
                let index = data.index;
                let order = data.order;
            
                console.log(index,order);
            
                conn.query('UPDATE frontend_user_indices SET `index`="'+index+'" WHERE pan="'+pan+'" AND orderno="'+order+'"',(err,result)=>{
                    if(!err)
                    {
                        resolve('success');
                    }
                    else
                    {
                        reject(err.message);
                    }
                });
            })
        });

        return await Promise.all(promises).then(()=>{
            return true;
        }).catch(()=>{
            return false
        });

    }

    const pan = req.params.pan;
    const dataarray = req.body.indexlist;

    updateIndexOrder(pan,dataarray).then((response)=>{

        console.log(response);
        if(response){
            res.json({
                pan,
                status : 'success'
            });
        }
        else
        {
            res.json({
                pan,
                status : 'failure',
                err : 'Database Error'
            });
        }
    }).catch((err)=>{
        res.json({
            pan,
            status : 'failure',
            err : err.message
        });
    })

    
}

Common.get('/StockFromISIN/:isin',getStockFromISIN);

Common.get('/StockFromSymbol/:symbol',getStockFromSymbol);

Common.get('/LatestPriceIndex/:symbol',LatestPriceIndex);

Common.get('/IndicesList/:pan',IndicesList);

Common.post('/SaveUserIndices/:pan',SaveUserIndices);

exports.Common = Common;
