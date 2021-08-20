const google_feeds = require('express').Router() , Axios = require("axios") , cheerio = require("cheerio") , { parseString }  = require('xml2js')


// Note:- Handle the request with numbers of data
// you can also send meta data with single request
// it's depend on you (also depend on server )

function ReadMetaData($,property){
    property = ( Array.isArray(property) && property ) || ['og:url','og:title','og:image','og:description','og:video:tag','twitter:title','twitter:description','twitter:image']//['og:url','og:title','og:image','og:description','og:video:tag'] 
    let res = {}
    $("meta[property],meta[name]").each((i,e)=>{
      let $e = $(e) , p = $e.attr('property') || $e.attr('name') , c = $e.attr("content")
       if(property.includes(p)){
          if(res.hasOwnProperty(p)){
             if(Array.isArray(res[p]))res[p].push(c);
             else res[p] = [res[p],c]
          }else{res[p] = c}
       }
    })
    // console.log(res);
   return res
}

google_feeds.get("/feeds/:symbol",(req,res)=>{
    let sy = req.params.symbol
    if(sy){
        Axios(`https://news.google.com/rss/search?q=${sy}&hl=en-IN&gl=IN&ceid=IN%3Aen`).then(d => {
            parseString(d.data, { trim: true }, (err, result) => {
               res.send({error:err,data:result.rss.channel[0]['item']}) //filter this 
            })
        }).catch(e => {
            res.send({error:e,data:null})
        })
    }else res.send({error:'Symbol not found',data:null})
})

google_feeds.get("/getmetadata/",(req,res)=>{
    let url =  req.query.url , t = req.query.types
    if(url){
        Axios(url).then(d=>cheerio.load(d.data)).then($=>{
            try{
                res.send({
                    data : ReadMetaData($,(t && t.split(','))),
                    error : null
                })    
            }catch(e){
                res.send({
                    data : null,
                    error : e
                })
            }
          }).catch(e=>{
              res.send({
                  data : null,
                  error : e
              })
          })
    }else res.send({
        data : null,
        error : "URL not found"
    })

})

exports.GoogleFeeds = google_feeds
