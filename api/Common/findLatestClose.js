module.exports = async function findLatestClose(isin, conn){
    var str1 = "" 
    var str2 = ""
    var stockCode = [];
    var close = [];
    //first query everything in nse
    for(let i=0; i<isin.length; i++)
        str1 += (i==isin.length-1)? "ISIN='"+isin[i]+"'" : "ISIN='"+isin[i]+"' OR ";
        
    let sql1 = `SELECT ISIN, SYMBOL, CLOSE FROM nse_bhav_latest WHERE (${str1}) AND (SERIES ='EQ' OR SERIES='BE') ORDER BY TIMESTAMP DESC`;
    const nse = await new Promise((resolve, reject) => {
        conn.query(sql1, (err, result) => {
            if(err) throw (err);
            resolve(result);
        })
    });

    //extract the return value and add it to close arr
    for(let i=0; i<isin.length; i++){
        if(isin[i] == 'CASH'){
            close[i] = 1;
            stockCode[i] = 'Cash';
        }else{
            for(let j=0; j<nse.length; j++){
                if(isin[i] == nse[j].ISIN){
                    close[i] = nse[j].CLOSE;
                    stockCode[i] = nse[j].SYMBOL;
                    break;
                }
            }
        }
        //if not founc then create a string to query in bse
        if(close[i]==''|| close[i]==undefined){
            close[i] = '';
            str2 += " ISIN_CODE='"+isin[i]+"' OR"
        }
    }

    str2 = str2.split(' ').slice(0, str2.split(' ').length-1).join(' ');    //this step is to remove the last extra OR in str2
    //query the remaining stockCode from bse
    let sql2 = `SELECT ISIN_CODE AS ISIN, SC_CODE AS SYMBOL, CLOSE FROM bse_bhav_latest WHERE (${str2})`;
    const bse = await new Promise((resolve, reject) => {
        conn.query(sql2, (err, result) => {
            if(err) throw (err);
            resolve(result);
        })
    });
    //push the empty close Arr
    for(let i=0; i<isin.length; i++){
        for(let j=0; j<bse.length; j++){
            if(isin[i] == bse[j].ISIN){
                close[i] = bse[j].CLOSE;
                stockCode[i] = bse[j].SYMBOL
                break;
            }
        }
    }

    return  {close, stockCode};
}