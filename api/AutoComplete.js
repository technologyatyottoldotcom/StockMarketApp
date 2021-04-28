const {conn} = require('../server/connection');

const AutoComplete = async (query)=>{
    return new Promise((resolve,reject)=>{
        // resolve(query)

        let sql = `SELECT T1.*,T2.* FROM stock_list_master_reuters_screener as T1 JOIN master_security_list_NSE as T2 ON T2.symbol = T1.nse_code AND T2.company LIKE '${query}%'`;
        conn.query(sql,(error,result)=>{
            if(!error)
            {

                let suggestions = [];
                result.forEach(row => {

                    // console.log(row.name);
                    suggestions.push({
                        company : row.company,
                        code : row.code,
                        symbol : row.symbol,
                        exchange : row.exchange,
                        ric_code : row.ric_code,
                        nse_code : row.nse_code,
                        bse_code : row.bse_code,
                        name : row.name
                    })
                });
                resolve({
                    length : result.length,
                    suggestions : suggestions
                });
            }
            else
            {
                console.log(error);
                reject(error)
            }
        })
    })
}

exports.AutoComplete = AutoComplete;