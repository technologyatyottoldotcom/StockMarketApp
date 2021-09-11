const {conn} = require('../../../server/connection');
const {convertDate, increaseDate} = require('../../Common/conversionOfDate');


async function sendValue(req, res, next){

        let exchange = req.params.type && req.params.type.toLowerCase();
        let code = req.params.code;

        if(exchange === 'nse'){

            let sql = `SELECT TIMESTAMP, SERIES, CLOSE FROM ${exchange}_bhav_latest WHERE SYMBOL='${code}' ORDER BY TIMESTAMP DESC`;
            let price = await new Promise((resolve, reject) => {
                conn.query(sql, (err, result) => {
                    if(err) throw(err);
                    resolve(result);
                })
            })

            if(price.length == 1 || price[0].SERIES == 'EQ')   res.send({CLOSE: price[0].CLOSE})
            else{
                let i=1
                while(convertDate(price[0].TIMESTAMP) == convertDate(price[i].TIMESTAMP)){
                    if(price[i].TIMESTAMP == 'EQ')  res.send({CLOSE: price[i].CLOSE})
                    i++
                }
                res.send({CLOSE: price[0].CLOSE})
            }
        }

        else{

            let sql = `SELECT CLOSE FROM ${exchange}_bhav_latest WHERE SC_CODE='${code}' ORDER BY TRADING_DATE DESC`;
            let price = await new Promise((resolve, reject) => {
                conn.query(sql, (err, result) => {
                    if(err) throw(err);
                    resolve(result);
                })
            })

            res.send({CLOSE: price[0].CLOSE});
        }

}

module.exports = sendValue;
