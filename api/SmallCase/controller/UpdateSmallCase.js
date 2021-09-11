const {conn} = require('../../../server/connection');
const { convertDate } = require("../../Common/conversionOfDate");
const findLatestClose = require("../../Common/findLatestClose");

async function updateSmallCase(body){

    let { isStrategyExist, createdDate, pan, strategy, methodology, objective, frequency, benchmark, price, portfolio, withBacktest, index } = body;
    
    strategy = strategy.split(' ').join('_')
    benchmark = benchmark.toUpperCase();
    benchmark = benchmark.split(' ').join('_')
    frequency = frequency.split(' ').join('_')

    let updatedDate = convertDate(new Date())

    updateStrategy(createdDate,updatedDate, pan, strategy, methodology, objective, frequency, benchmark, price, conn);
    updateInitialPortfolio(portfolio, updatedDate, pan, strategy, conn);
    if(!isStrategyExist)    updatePortfolio(portfolio, updatedDate, pan, strategy, conn);
    if(withBacktest)    saveBackTest(pan, strategy, index, benchmark, conn);
}


async function updateStrategy(createdDate, updatedDate, pan, strategy, methodology, objective, frequency, benchmark, price, conn){

    let sql = `DELETE FROM smallCase_portfolios_details WHERE pan='${pan}' AND pName='${strategy}'`
    let deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })


    let columnName = '(createdDate, updatedDate, pan, pName, objective, methodology, benchmark, rebalancing_frequency, price)'
    let columnValue = `('${createdDate}', '${updatedDate}', '${pan}', '${strategy}', '${objective}', '${methodology}', '${benchmark}', '${frequency}', '${price}')`

    sql = `INSERT INTO smallCase_portfolios_details ${columnName} VALUES ${columnValue}`;
    let insert = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

}


async function updateInitialPortfolio(portfolio, updatedDate, user, strategy, conn){

    let sql = `DELETE FROM smallCase_initial_portfolios WHERE user='${user}' AND pName='${strategy}'`
    let deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })

    let values = [];
    for(let i=0; i<portfolio.length; i++){
        let row = [];
        row.push(user);
        row.push(strategy);
        row.push(portfolio[i].isin);
        row.push(portfolio[i].StockCode);
        row.push(portfolio[i].PortfolioWeight);
        row.push(updatedDate);
        row.push(convertDate(new Date(portfolio[i].dateCreated)));

        values.push(row)
    }

    sql = 'INSERT INTO smallCase_initial_portfolios (user, pName, isin, stockCode, stockWeight, lastUpdateDt, dateCreated) VALUES ?';
    let inserts = await new Promise((resolve, reject) => {
        conn.query(sql, [values], (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

}


async function updatePortfolio(portfolio, updatedDate, user, strategy, conn){

    let sql = `DELETE FROM smallCase_portfolios WHERE user='${user}' AND pName='${strategy}'`
    let deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })

    //let TotalValue = await findLatestTotal(conn, user, strategy);
    let TotalValue = 10000000;
    portfolio = await calculateStockQuantity(portfolio, TotalValue, conn);

    let values = [];
    for(let i=0; i<portfolio.length; i++){
        let row = [];
        row.push(user);
        row.push(strategy);
        row.push(portfolio[i].isin);
        row.push(portfolio[i].StockCode);
        row.push(portfolio[i].PortfolioWeight);
        row.push(portfolio[i].stocks)
        row.push(updatedDate);

        values.push(row)
    }

    sql = 'INSERT INTO smallCase_portfolios (user, pName, isin, stockCode, stockWeight, noofStocks, lastUpdateDt) VALUES ?';
    let inserts = await new Promise((resolve, reject) => {
        conn.query(sql, [values], (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

    let columnName = '(pan, pName, Date, stockValue, cashValue)'
    let columnValue = `('${user}', '${strategy}', '${new Date().toJSON()}', '${TotalValue-portfolio[0].stocks}', '${portfolio[0].stocks}')`

    sql = `INSERT INTO smallCase_daily_valuation ${columnName} VALUES ${columnValue}`;
    let insert = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })
}


async function saveBackTest(pan, strategy, index, benchmark, conn){
    let sql = `DELETE FROM smallCase_backtest_results WHERE pan='${pan}' AND pName='${strategy}'`
    let deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })

    benchmark = benchmark.split('_').join(' ');

    let values = [];
    for(let i=1; i<index.length; i++){
        let row = [];
        row.push(pan);
        row.push(strategy);
        row.push(index[i].date);
        row.push(parseFloat(index[i].Portfolio).toFixed(4));

        values.push(row)
    }

    sql = 'INSERT INTO smallCase_backtest_results (pan, pName, Date, indexValue) VALUES ?';
    let inserts = await new Promise((resolve, reject) => {
        conn.query(sql, [values], (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

}


async function calculateStockQuantity(portfolio, TotalValue, conn){

    let isin = findISIN(portfolio);
    let { close } = await findLatestClose(isin, conn);

    let stockPriceSum = 0;

    for(let i=1; i<portfolio.length; i++){
        portfolio[i].stocks = Math.round(TotalValue*parseFloat(portfolio[i].PortfolioWeight)/100/close[i]);
        portfolio[i].PortfolioWeight = parseFloat(portfolio[i].stocks*close[i]/TotalValue*100).toFixed(2);
        stockPriceSum += portfolio[i].stocks*close[i];
    }

    portfolio[0].stocks = parseFloat(TotalValue-stockPriceSum).toFixed(2);
    portfolio[0].PortfolioWeight = parseFloat(portfolio[0].stocks*close[0]/TotalValue*100).toFixed(2);

    return portfolio;
}


function findISIN(portfolio){
    let isin = [];
    portfolio.forEach(element => {
        isin.push((element.isin).replace(/(\r\n|\n|\r)/gm, ""))
    });

    return isin;
}


/*
async function findLatestTotal(conn, pan, strategy){
    let sql = `SELECT cashValue+stockValue AS TotalValue FROM smallCase_daily_valuation WHERE pan='${pan}' AND pName='${strategy}' ORDER BY Date DESC LIMIT 1`
    let TotalValue = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            else resolve(result)
        })
    })

    if(TotalValue.length <= 0)  return 10000000;

    return parseFloat(TotalValue[0].TotalValue);
}
*/

module.exports = {updateSmallCase}
