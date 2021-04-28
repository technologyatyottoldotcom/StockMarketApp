const { conn } = require('../../server/connection');
const { SendResponse , inArray } = require("./SendResponse");
const { StockSnapShot } = require('./SnapShot');
const BusinessNews = require('express').Router();




function Overview(req, res) {
    // note : - import snapeshot.js and send snapeshot datas with this request
    
    var ricCode = req.params.ric_code //'TIIN.NS' 
    if(ricCode){
            var tableName = "stock_list_master_reuters_screener" , 
            removeCols = ["ISIN","last_update_time_screener","last_update_time_reuters","reuters_industry",["screener_ratings_title","screener_ratings_link","screener_ann_title","screener_ann_date","screener_ratings_date","screener_ann_link"]];//[string] it mean it's a regex remove numbers
            conn.query(`SELECT * FROM  ${tableName} WHERE ric_code='${ricCode}'`,(e,r)=>{
            if(r && Array.isArray(r)){
                    r = r.map((v)=>{
                        if( v && 'object'===typeof v && !Array.isArray(v)){
                            try{
                            for(let e of removeCols){
                                if('object'===typeof e){

                                    for(let ek in r[0]){
                                        let re = ek.replace(/\d+/g,'')
                                        if(inArray(e,re) != -1){
                                            delete r[0][ek]
                                        }
                                    }
                                }
                                else delete v[e];
                                    
                            }
                            }catch(e){}
                        }
                        return v
                    })
                    res.json(SendResponse(900,r[0]))
            }
            else res.json(SendResponse(106));
        })
    }else res.json(SendResponse(104))
}

function SnapShot(req,res){
    var reutersCode = req.params.ric_code;
    var nseCode = req.params.nse_code;
    var bseCode = req.params.bse_code;
    // console.log(reutersCode,nseCode,bseCode);
    StockSnapShot({
        'reutersCode' : reutersCode,
        'nseCode' : nseCode,
        'bseCode' : bseCode
    })
    .then((data)=>{
        // console.log(data);
        res.json(SendResponse(900,data))
    })
    .catch((error)=>{
        res.json(SendResponse(106,error))
    })
}

BusinessNews.get("/detailed_view/overview/:ric_code", Overview)

BusinessNews.get("/detailed_view/snapshot/:ric_code/:nse_code/:bse_code", SnapShot)


exports.BusinessNews = BusinessNews