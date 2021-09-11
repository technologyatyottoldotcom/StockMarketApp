const {conn} = require('../../../server/connection');
let { FindStockName } = require('./FindStockName');

async function ValidateImport(req, res, next){

    const data = req.body;

    let newData = [];
    newData.push({StockCode: 'CASH', StockName: 'Cash', PortfolioWeight: data[0].PortfolioWeight, isin: 'CASH', dateCreated: new Date() });

    newData = await checkStockCode(conn, data, newData);

    newData = await FindStockName(conn, newData);

    res.send({ portfolio: newData });    
}


async function checkStockCode(conn, data, newData){

    let isin = [];
    isin[0] = 'CASH';
    
    let createdDate = new Date();

    let str = "";
    for(let i=1; i<data.length; i++)
        str += (i==data.length-1)? "SYMBOL='"+data[i].StockCode+"'" : "SYMBOL='"+data[i].StockCode+"' OR ";
    let sql = `SELECT SYMBOL, ISIN FROM nse_bhav_latest WHERE ${str}`;
    const nse = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw (err);
            resolve(result);
        })
    })

    let duplicates = [];

    
    str = "";

    for(let i=1; i<data.length; i++){
        for(let j=0; j<nse.length; j++){
            if(data[i].StockCode == nse[j].SYMBOL){

                const duplicateIndex = isin.indexOf(nse[j].ISIN);

                isin[i] = nse[j].ISIN;
                newData[i] = {StockCode: nse[j].SYMBOL, PortfolioWeight: data[i].PortfolioWeight, isin: nse[j].ISIN, dateCreated: createdDate};

                if(duplicateIndex >= 0){
                    newData[duplicateIndex].PortfolioWeight += data[i].PortfolioWeight;
                    duplicates.push(i);
                }
                break;
            }
        }
        if(newData[i]==undefined){
            str += " SC_CODE='"+data[i].StockCode+"' OR";
        }
    }

    if(str==""){
        for(let i=duplicates.length-1; i>=0; i--){
            newData.splice(duplicates[i], 1);
        }

        return newData;
    }

    str = str.split(' ').slice(0, str.split(' ').length-1).join(' ');

    sql = `SELECT SC_CODE AS SYMBOL, ISIN_CODE AS ISIN FROM bse_bhav_latest WHERE${str}`;
    let bse = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw (err);
            resolve(result);
        })
    })


    for(let i=1; i<data.length; i++){
        if(isin[i]==undefined){
            for(j=0; j<bse.length; j++){
                if(data[i].StockCode == bse[j].SYMBOL){

                    newData[i] = {StockCode: bse[j].SYMBOL, PortfolioWeight: data[i].PortfolioWeight, isin: bse[j].ISIN, dateCreated: createdDate};
                    const duplicateIndex = isin.indexOf(bse[j].ISIN);
                    if(duplicateIndex >= 0){
                        newData[duplicateIndex].PortfolioWeight += data[i].PortfolioWeight;
                        duplicates.push(i);
                    }
                    break;
                }
            }
            if(newData[i] == undefined){
                res.send(false);
                return;
            }
        }
    }

    for(let i=duplicates.length-1; i>=0; i--){
        newData.splice(duplicates[i], 1);
    }
    
    return newData;
}

module.exports = {ValidateImport}