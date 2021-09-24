const {conn} = require('../../server/connection');

async function sendNews(req, res, next) {
    let News = await getNews(conn, req)
    res.send(News)
}
async function sendTrending(req, res, next){
    let Trending = await getTrending(conn, req)
    res.send(Trending)
}
async function incrementDownload(req, res, next) {
    increment(conn, req)
}


async function getNews(conn, req) {
    let { field, len, filter } = req.body;
    field = field.charAt(0).toUpperCase() + field.slice(1);

    let sql = !filter? `SELECT * FROM research_section WHERE classification='${field}' ORDER BY publishedDate DESC LIMIT ${len+4}`
                        : `SELECT * FROM research_section WHERE relatedStocks LIKE '%${filter}%' ORDER BY publishedDate DESC LIMIT ${len+4}`
    let News = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })
    
    return News;
}

async function getTrending(conn, req){
    let { len } = req.body;
    let sql = `SELECT * FROM research_section ORDER BY downloads DESC LIMIT ${len+5}`;
    let Trending = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })

    return Trending;
}

async function increment(conn, req) {
    let { date, field } = req.body;
    field = field.charAt(0).toUpperCase() + field.slice(1);

    date = new Date(date)
    date = date.getFullYear()+"-"+("0"+(date.getMonth() +　1)).slice(-2)+"-"+("0"+(date.getDate())).slice(-2)+" "+date.toTimeString();

    
    let sql = `UPDATE research_section SET downloads = downloads + 1 WHERE classification='${field}' AND publishedDate='${date}'`
    let update = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })
}


module.exports = {sendNews,sendTrending,incrementDownload}