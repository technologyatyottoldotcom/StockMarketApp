async function FindStockName (conn, newData){

    let str = "";
    for(let i=0; i<newData.length; i++)  str += (i==newData.length-1)? "symbol='"+newData[i].StockCode+"'" : "symbol='"+newData[i].StockCode+"' OR ";

    let sql = `SELECT symbol, company FROM master_security_list_NSE WHERE ${str}`;
    const nseName = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err);
            resolve(result);
        })
    })

    str = "";

    for(let i=0; i<newData.length; i++){
        if(newData[i].StockCode=='Cash'||newData[i].StockCode=='CASH'){
            newData[i].StockName = 'Cash';
            continue;
        }
        for(let j=0; j<nseName.length; j++){
            if(newData[i].StockCode == nseName[j].symbol){
                newData[i].StockName = nseName[j].company;
            }
        }
        if(newData[i].StockName == undefined){
            str += " code='"+newData[i].StockCode+"' OR";
        }
    }

    if(str=="") return newData;

    str = str.split(' ').slice(0, str.split(' ').length-1).join(' ');

    sql = `SELECT code, company FROM master_security_list_BSE WHERE${str}`;

    const bseName = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err);
            resolve(result);
        })
    })

    for(let i=0; i<newData.length; i++){
        if(newData[i].StockName == undefined){
            newData[i].StockName = newData[i].StockCode;
            for(let j=0; j<bseName.length; j++){
                if(newData[i].StockCode == bseName[j].code){
                    newData[i].StockName = bseName[j].company;
                }
            }
        }
    }

    return newData;
}

module.exports = {FindStockName}