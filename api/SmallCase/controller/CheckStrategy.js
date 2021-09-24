const {conn} = require('../../../server/connection');
const { convertDate } = require("../../Common/conversionOfDate");
const { FindStockName } = require("../../Common/FindStockName");

async function sendValue(req, res, next){

    let pan = req.body.pan;
    let strategy = req.body.strategy.trim();

    if(strategy=='New Strategy' || strategy==''){
        res.send({details: false, portfolios: [], backTestResult: []});
        return;
    }

    strategy = strategy.split(' ').join('_');

    const details = await fetchDetails(conn, pan, strategy);

    let portfolios = details? await fetchPortfolios(conn, pan, strategy): [];

    portfolios = details? await FindStockName(conn, portfolios): [];

    let backTestResult = details? await fetchBackTestResult(conn, pan, strategy, details.benchmark.split(' ').join('_')): [];

    res.send({details, portfolios, backTestResult});
}

async function fetchDetails(conn, pan, strategy){

    let sql = `SELECT * FROM smallCase_portfolios_details WHERE pan='${pan}' AND pName='${strategy}'`
    const data = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err);
            resolve(result);
        })
    })

    if(data.length!=0){

        const details = new Object();
        
        details.createdDate = convertDate(data[0].createdDate);
        details.strategy = data[0].pName.split('_').join(' ');
        details.objective = data[0].objective;
        details.methodology = data[0].methodology;
        details.benchmark = data[0].benchmark[0] + data[0].benchmark.toLowerCase().split('_').join(' ').slice(1);
        details.frequency = data[0].rebalancing_frequency.split('_').join(' ');
        details.price = data[0].price;

        return details;

    }   else   return false;
}

async function fetchPortfolios(conn, pan, strategy){

    let sql = `SELECT stockCode AS StockCode, stockWeight AS PortfolioWeight, isin, dateCreated FROM smallCase_initial_portfolios WHERE user='${pan}' AND pName='${strategy}'`

    let data = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err);
            resolve(result);
        })
    })

    //data.push({StockCode: 'HDFCBANK', PortfolioWeight: 25, isin: 'INE040A01034'});

    return data;
}

async function fetchBackTestResult(conn, pan, strategy, benchmark){
    
    let sql = `SELECT indexValue AS ${benchmark}, Date FROM smallCase_backtest_results WHERE pan='${pan}' AND pName='${strategy}'`

    let backTestResult = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

    return backTestResult;
}

module.exports = {sendValue}