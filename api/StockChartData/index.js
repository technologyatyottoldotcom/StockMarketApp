const { conn } = require('../../server/connection');
const axios = require('axios');
const StockChartData = require('express').Router();
const getQuery = require('./StockQuery');

function getStockData(req,res){

    let options = req.query;

    // console.log(options);

    getData(options).then((data)=>{
        res.json(data);
    })
    .catch((error)=>{
        res.json(error);
    })
}


function getData(options)
{
    return new Promise((resolve,reject)=>{

        let stockArray = [];
        
        let url = `https://masterswift.mastertrust.co.in/api/v1/charts/tdv?exchange=${options.exchange}&token=${options.token}&candletype=${options.ct}&starttime=${options.starttime}&endtime=1632583718&data_duration=${options.dd}`;
        // console.log(url);
        axios.get(url)
        .then(res=>{
            const data = res.data;
            if(data.status === 'success')
            {
                let apiArray = data.data.candles;
                // console.log('api array : ',apiArray.length);

                if(options.mixed == 'true')
                {
                    //get data from database also
                    getQuery({
                        exchange : options.exchange,
                        code : options.code,
                        time : options.starttime,
                        type : options.type
                    }).then((data)=>{
                        let query = data.query;
                        skip = 1;
                        // console.log(query);
                        // console.log(skip);
                        if(query)
                        {
                            conn.query(query,(err,result)=>{
                                if(!err)
                                {
                                    console.log(result.length);
                                    let dbArray = result.map(obj => Object.values(obj));
                                    // console.log('db Array Temp : ',dbArrayTemp.length);


                                    // console.log('db Array : ',dbArray.length);
                                    // console.log('db Array : ',dbArray.length);
                                    stockArray = stockArray.concat(dbArray);
                                    stockArray = stockArray.concat(apiArray);
                                    console.log('length : ',stockArray.length);
                                    resolve({
                                        data : stockArray,
                                        status : 'success',
                                        params : options
                                    })
                                }
                                else
                                {
                                    console.log(err);
                                    reject({
                                        error : err
                                    })
                                }
                            })
                        }
                        else
                        {
                            console.log('table not found');
                        }
                    })
                   
                    
                }
                else
                {
                    stockArray = stockArray.concat(apiArray);
                    // console.log('length : ',stockArray.length);
                    resolve({
                        data : stockArray,
                        status : 'success',
                        params : options
                    })
                }
                
            }
            else
            {
                reject({
                    error : 'Failure'
                })
            }
            
        })
        .catch(error=>{
            reject({
                error : error
            })
        })
    });
}



StockChartData.get('/api/stockdata',getStockData);

exports.StockChartData = StockChartData;