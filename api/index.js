//imports
const express = require('express') , cors = require('cors');
const app = express();
app.use(cors());
const { conn } = require('../server/connection');
const { Twitter } = require("./twitter");
const { GoogleFeeds } = require("./google_feeds");
const { AutoComplete } = require('./AutoComplete');
const { BusinessNews } = require('./BusinessNews/');
const { IndexChartData } = require('./IndexChartData/');
const { StockChartData } = require('./StockChartData/');
const { StocksToWatch } = require('./StocksToWatch/');
const { Common } = require('./Common/');


const {
    RatioFunctions,
    Ratio,
    GetdbData,
    GetCodeType,
    GetStockCode,
    companyType,
    GetStockType
} = require("./BusinessNews/Financial");

//middlewares & apis

app.use(Twitter);
app.use(GoogleFeeds);
app.use(BusinessNews);
app.use(IndexChartData);
app.use(StockChartData);
app.use(StocksToWatch);
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

// only quarterly data will work
app.get('/createtable/:type/:field/:stockcode', (req, res) => {

    // console.log(req.params);
    let p = req.params , fT = String(p.field).toLowerCase() , fromType = GetCodeType(p.stockcode).type
    if(p.type==="quarterly"){
        p.type = "quartely"
    }
    
    if(fT=='ratios'){
        Ratio(p.stockcode,fromType).then(d=>{
            res.send(d)
        }).catch(e=>{
            console.log('err__ = ',e)
        })
    }else if(fT=='shareholding'){
        RatioFunctions.getShareHoldingPattern(p.stockcode) //screener stockcode
        .then(d=>{
            // console.log("shareholdeing = ",d.Fields)
            res.send(d)
        }).catch(e=>{
            console.log("getShareHoldingPattern = ",e)
        })
    }else{
        GetdbData(p.type,p.field,p.stockcode,fromType).then(d=>{
            if(typeof d=='string'){d = JSON.parse(d)}
            if(!d){d = {}};

            if(d?.fields?.length > 2 ){  
                d.from = fromType
                d.type = GetStockType(d?.values || [] , fromType=="screener" ? companyType.Screener : companyType.Reuters) || 'common'
                res.send(d)     //response sended
            }else {
                console.log('run = ',2)
                GetStockCode(p.stockcode).then(({ ric_code , bse_code , nse_code})=>{
                        const senD = (sCode,from)=>{
                            
                            if(from=='screener'){
                                p.type = ""
                                if(p.field=="income"){
                                    p.field = "profitloss"
                                }else  if(p.field=="cashflow"){
                                    p.field = "cashflows"
                                }
                            }
                            
                            GetdbData(p.type,p.field,sCode,from).then(d=>{
                              if(typeof d=='string'){d = JSON.parse(d)}
                              if(!d){d = {}};
                                d.from = from
                                d.type = GetStockType(d?.values || [] , from=='screener' ? companyType.Screener : companyType.Reuters) || 'common'
                                res.send(d)
                            }).catch(e=>{
                                console.log('error  = ',e)
                                res.send(e)
                            })
                        }

                    if(fromType=='reuters'){
                          senD(nse_code || bse_code ,"screener")  // screener
                    }else {// reuters
                        senD( ric_code,"reuters") 
                    }

                }).catch(e=>{
                    res.send(e)
                })
            }
        }).catch(e=>{
            console.log("er = ",e)
            res.send(e)
        })
    }
    
    // console.log("req_data = ",p)
    
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

app.listen(8000,e=>console.log('server start'))