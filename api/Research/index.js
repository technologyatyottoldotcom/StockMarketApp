const Research = require('express').Router();
const {sendNews,sendTrending,incrementDownload} = require('./Research');

Research.post('/api/research_news', async(req,res,next)=>{
    sendNews(req,res,next);
});

Research.post('/api/research_trending', async(req,res,next)=>{
    sendTrending(req,res,next)
});

Research.post('/api/increment_download', async(req,res,next)=>{
    incrementDownload(req,res,next)
});


exports.Research = Research;