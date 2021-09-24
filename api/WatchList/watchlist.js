const { conn } = require('../../server/connection');
const {FindStockName} = require("../Common/FindStockName");


async function fetchValue(req, res, next){

    // console.log(req.body);
    let { pan } = req.body;
    // console.log(pan);
    let watchlist = await fetchWatchlist(conn, pan);
    // console.log(watchlist);
    res.send({watchlist})
}

async function pushValue(req, res, next){
    let { pan, items } = req.body;
    await pushWatchlist(conn, pan, items);
    res.send({ success: true })
}

async function fetchWatchlist(conn, pan){

    let sql = `SELECT stockCode AS StockCode, position AS id FROM frontend_watchlist WHERE PAN='${pan}'`;
    let watchlist = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result)
        })
    })

    watchlist.forEach(element => {
        element.id = parseInt(element.id);
    });

    watchlist = watchlist.length>0? await FindStockName(conn, watchlist): [];
    return watchlist;
}

async function pushWatchlist(conn, pan, items){

    await deleteWatchlist(conn, pan);

    if(items.length<=0) return;

    items.forEach(elem => { delete elem.id && delete elem.StockName })
    items = [ ...new Set(items)];

    let value = [];
    for(let i=0; i<items.length; i++){

        let row = [];
        row.push(pan);
        row.push(items[i].StockCode);
        row.push(i+1);

        value.push(row);
    }

    let sql = 'INSERT INTO frontend_watchlist (PAN, stockCode, position) VALUES ?';
    let inserts = await new Promise((resolve, reject) => {
        conn.query(sql, [value], (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })
}

async function deleteWatchlist(conn, pan) {
    let sql = `DELETE FROM frontend_watchlist WHERE PAN='${pan}'`;
    let deletes = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err)
            resolve(result);
        })
    })
}

module.exports = {fetchValue , pushValue}