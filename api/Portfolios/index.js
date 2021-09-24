const Portfolios = require('express').Router();
const getPortfolio = require('./controller/Portfolio');
const getSector = require('./controller/Sector');
const getCurrentPrice = require('./controller/FetchCurrentPrice');
const getCompare = require('./controller/Compare');


//Portfolio details
Portfolios.get('/api/portfolio', async(req,res,next)=>{
    getPortfolio(res,'All');
});

Portfolios.post('/api/portfolio', async(req,res,next)=>{
    getPortfolio(res,req.body.portfolioName);
});

//Sector details
Portfolios.get('/api/sector', getSector);


//Latest price details
Portfolios.get('/api/stock_price/:type/:code', getCurrentPrice);


Portfolios.post('/api/compare/:index', async(req, res, next) => {
    var compareTo = req.params.index;
    getCompare(req, res, next, compareTo);
});

Portfolios.get('/api/compare', async(req, res, next) => {
    var compareTo = '';
    getCompare(req, res, next, compareTo);
});


exports.Portfolios = Portfolios;