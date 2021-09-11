const {conn} = require('../../../server/connection');
const { convertDate } = require("../../Common/conversionOfDate");
const findLatestClose = require("../../Common/findLatestClose");
const {FindStockName} = require("./FindStockName");


async function FetchPortfolio(req, res, next){

    let { strategy, pan } = req.body;

    strategy = strategy.split(' ').join('_');

    let sql = `SELECT stockCode AS StockCode, isin, stockWeight AS PortfolioWeight, stockWeight AS OldWeight FROM smallCase_portfolios WHERE pName='${strategy}' AND user='${pan}'`;
    let portfolio = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })
    portfolio = (portfolio.length>0)? await FindStockName(conn, portfolio): [];

    let weightSum = 0;
    portfolio.forEach(elem => {
        elem.PortfolioWeight = parseFloat(elem.PortfolioWeight).toFixed(1);
        weightSum += parseFloat(elem.PortfolioWeight);
    })

    portfolio[0].PortfolioWeight = parseFloat(portfolio[0].PortfolioWeight)+(100-weightSum);

    res.send({portfolio});
}

async function updateValue(req, res, next){
    let { pan, strategy, portfolio } = req.body;
    strategy = strategy.split(' ').join('_')
    await pushPortfolio(conn, pan, strategy, portfolio)
    res.send({success: true});
}


async function pushPortfolio(conn, pan, strategy, portfolio){

    let sql = `DELETE FROM smallCase_portfolios WHERE user='${pan}' AND pName='${strategy}'`
    let deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })

    let updatedDate = convertDate(new Date());
    let TotalValue = await findLatestTotal(conn, pan, strategy);
    portfolio = await calculateStockQuantity(portfolio, TotalValue, conn);


    let values = [];
    for(let i=0; i<portfolio.length; i++){
        let row = [];
        row.push(pan);
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
    let columnValue = `('${pan}', '${strategy}', '${new Date().toJSON()}', '${TotalValue-portfolio[0].stocks}', '${portfolio[0].stocks}')`

    sql = `INSERT INTO smallCase_daily_valuation ${columnName} VALUES ${columnValue}`;
    let insert = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })
}


function findISIN(portfolio){
    let isin = [];
    portfolio.forEach(element => {
        isin.push((element.isin).replace(/(\r\n|\n|\r)/gm, ""))
    });

    return isin;
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
    portfolio[0].PortfolioWeight = parseFloat(portfolio[0].stocks*1/TotalValue*100).toFixed(2);

    return portfolio;
}

async function findLatestTotal(conn, pan, strategy){
    let sql = `SELECT cashValue+stockValue AS TotalValue FROM smallCase_daily_valuation WHERE pan='${pan}' AND pName='${strategy}' ORDER BY Date DESC LIMIT 1`
    let TotalValue = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            else resolve(result)
        })
    })

    return parseFloat(TotalValue[0].TotalValue);
}

module.exports = {FetchPortfolio,updateValue}