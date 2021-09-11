const {conn} = require('../../../server/connection');

async function changePortfolioName(req, res, next) {
    let { oldName, newName } = req.body;
    oldName = oldName.trim().split(' ').join('_');
    newName = newName.trim().split(' ').join('_');

    let sql = `UPDATE order_book SET portfolioName='${newName}' WHERE portfolioName='${oldName}'`;
    let updates = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err)  throw(err)
            resolve(result);
        })
    })

    sendPortfolio(req, res, next);
}

async function sendStrategy(req, res, next){

    let sql = 'SELECT DISTINCT pName FROM smallCase_portfolios_details';
    let strategy = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

    let Strategy = [];
    strategy.forEach(element => {
        Strategy.push(element.pName.split('_').join(' '));
    });

    res.send(Strategy);
}

async function sendPortfolio(req, res, next){
    let sql = 'SELECT DISTINCT portfolioName FROM order_book';
    let portfolio = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })

    let Portfolio = [];
    portfolio.forEach(element => {
        Portfolio.push(element.portfolioName.split('_').join(' '));
    });
    
    res.send(Portfolio);
}

module.exports = {sendStrategy, sendPortfolio, changePortfolioName};