const {convertDate, increaseDate} = require('../../Common/conversionOfDate');

module.exports = async function getOrderBook(conn){
    let sql = 'SELECT * FROM order_book'
    const data = await new Promise(async (resolve, reject) => {
        conn.query(sql, async(err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    });

    const {isin, date, stockNameMap} = await findUnique(data);

    return{data, isin, date, stockNameMap};
}


async function findUnique(data){
    var isin = new Set();
    var stockNameMap = new Map();
    var date = new Set();

    data.forEach(element => {
        isin.add(element.isin)
        stockNameMap.set(element.isin, element.stockName);
        date.add(convertDate(element.Date));
    });

    //convert set to array
    isin = Array.from(isin);
    date = Array.from(date);

    return {isin, date, stockNameMap};
}