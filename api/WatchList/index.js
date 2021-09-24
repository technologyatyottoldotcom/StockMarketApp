const WatchList = require('express').Router();
const {fetchValue , pushValue} = require('./watchlist');


WatchList.post('/api/fetch_watchlist', async(req, res, next) =>{
    fetchValue(req,res,next);
});
WatchList.post('/api/push_watchlist',  async(req, res, next) =>{
    pushValue(req,res,next);
});


exports.WatchList = WatchList;