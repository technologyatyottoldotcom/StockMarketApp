//imports
const express = require('express') , cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
app.use(cors());
const { conn } = require('../server/connection');
const { Twitter } = require("./twitter");
const { GoogleFeeds } = require("./google_feeds");
const { AutoComplete } = require('./AutoComplete');
const { BusinessNews } = require('./BusinessNews/');
const { IndexChartData } = require('./IndexChartData/');
const { StockChartData } = require('./StockChartData/');
const { StocksToWatch } = require('./StocksToWatch/');
const { Financial } = require('./BusinessNews/Financial');
const { Portfolios } = require('./Portfolios');
const { Common } = require('./Common/');


//middlewares & apis

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(Twitter);
app.use(GoogleFeeds);
app.use(BusinessNews);
app.use(IndexChartData);
app.use(StockChartData);
app.use(StocksToWatch);
app.use(Financial);
app.use(Portfolios);
app.use(Common);



conn.connect((err)=>{
    if(!err)
    {
        console.log('connected');
    }
    else
    {
        console.log('Not connected ',err);
    }
});




//search filter suggestion
app.get('/stock/:query',(req,res)=>{
    let query = req.params.query;
    AutoComplete(query)
    .then((response)=>{
        res.json(response)
    })
    .catch((error)=>{
        console.log(error);
    })
})

app.listen(9000,e=>console.log('server start'))