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

const tableTypes = {
    types : ['annual','quarterly'],
    fields : ['incomestatement' , 'balancesheet' , 'cashflows' , 'ratios'],
    dbTables : {
        annual_incomestatement      : 'fundamental_data_reuters_income_annual',
        annual_balancesheet         : 'fundamental_data_reuters_balancesheet_annual',
        annual_cashflows            : 'fundamental_data_reuters_cashflow_annual',
        quarterly_incomestatement   : 'fundamental_data_reuters_income_quartely',
        quarterly_balancesheet      : 'fundamental_data_reuters_balancesheet_quartely',
        quarterly_cashflows         : 'fundamental_data_reuters_cashflow_quartely',
    }
}

const inArray = (arr,key)=>{
    var res = -1
    if(typeof arr==='object'){
        let l = arr.length , i = 0
        for(;i<l;++i){
            if(arr[i]===key){
                res=i
                break;
            }
        }

    }
    return res
}

async function getData(type,field,stockCode){
    if(inArray(tableTypes.types,type)!=-1 && inArray(tableTypes.fields,field)!=-1 && stockCode){
        return new Promise( ( resolve, reject ) => {
            conn.query(`SELECT * FROM ${tableTypes.dbTables[type+'_'+field]} WHERE stockCode='${stockCode}'`,(e,r)=>{
              if(e)
              {
                  reject(e);
              }
              else resolve(r)
            })
        })
    }else return new Promise((re,rej)=>rej("fields not found"))   
}

function splitKeyVal(rows=[],type,field){
    var l = rows.length , fields = [] , values = []
    for(let i=0;i<l;++i){
        if(typeof rows[i]==='object'){
            let k = Object.keys(rows[i]) , kl = k.length
            for(let ki=0;ki<kl;++ki)if(!(fields.find(e=>e===k[ki])))fields.push(k[ki]);
        }
    }
    var valid = type+'_'+field
    if(fields.length&&(valid=='annual_balancesheet' || valid=='annual_incomestatement' || valid=='annual_cashflows')){
        var fil , newFields = []
        fields.forEach((e)=>{
            if(!fil)fil = e?.split('_')[1]
            if(fil === e?.split('_')[1] )newFields.push(e)
        })
        fields = [...newFields]
    }
    
    
    for(let i=0;i<l;++i){
        if(typeof rows[i]==='object'){
            let t = []
            for(let k in rows[i]){
              if(fields.find(e=>e===k))t.push(rows[i][k])
            }
            values.push(t)
        }
    }
return JSON.stringify({fields:fields,values:values})
}

// only quarterly data will work
app.get('createtable/:type/:field/:stockcode', (req, res) => {
let p = req.params
console.log(p);
 getData(p.type,p.field,p.stockcode)
    .then(d=>{
        // console.log(d);
       res.send(splitKeyVal(d,p.type,p.field))
    })
    .catch(e=>{
        console.log('err = ',e)
        res.send(e)
    })
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