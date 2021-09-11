const SmallCase = require('express').Router();
const {sendStrategy, sendPortfolio, changePortfolioName} = require('./controller/StrategyPortfolio');
const {sendValue} = require('./controller/CheckStrategy');
const {ValidateImport} = require('./controller/ValidateImport');
const {BackTest} = require('./controller/BackTest');
const {updateSmallCase} = require('./controller/UpdateSmallCase');
const {FetchPortfolio,updateValue} = require('./controller/SmallCasePortfolios');

SmallCase.get('/fetch_strategy', sendStrategy);

SmallCase.get('/fetch_portfolio', sendPortfolio);

SmallCase.post('/change_portfolio_name', async(req, res, next) =>{
    changePortfolioName(req,res,next)
});

SmallCase.post('/check_strategy', async(req, res, next) =>{
    sendValue(req,res,next)
});

SmallCase.post('/validate_import',async(req, res, next) =>{
    ValidateImport(req,res,next)
});
 
SmallCase.post('/backtest', async(req, res, next) => {

    let benchmark, frequency;
    let newBenchmark = req.body.benchmark;
    let newFrequency = req.body.frequency;
    let data = req.body.data;

    if(newBenchmark != undefined)   benchmark = newBenchmark.split(' ').join('_');
    if(newFrequency != undefined)    frequency = newFrequency.split(' ').join('_');

    if(benchmark==undefined || frequency == undefined){
        benchmark = 'NIFTY_50';
        frequency = '12_Month';
    }
    BackTest(res,data,benchmark,frequency);
});

SmallCase.get('/backtest', async(req, res, next) => {

    let benchmark='NIFTY_50';
    let frequency='12_Month';
    data = null;
    BackTest(res,data,benchmark,frequency);
});

SmallCase.post('/update_smallCase_details', async (req, res, next)=>{
    let body = req.body
    await updateSmallCase(body);
    res.send({success: true});
});

SmallCase.post('/fetch_smallCase_portfolios', async (req, res, next)=>{
    FetchPortfolio(req,res,next);
});

SmallCase.post('/update_smallCase_portfolios', async (req, res, next)=>{
    updateValue(req,res,next);
});

exports.SmallCase = SmallCase;