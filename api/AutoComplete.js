const {conn} = require('../server/connection');
const {getExchangeCode} = require('../src/exports/MessageStructure');

const AutoComplete = async (query)=>{
    return new Promise((resolve,reject)=>{
        // resolve(query)

        let sql = `SELECT T1.*,T2.company,T2.code,T2.symbol,T2.exchange,T2.trading_symbol AS filter FROM stock_list_master_reuters_screener as T1 
                        JOIN master_security_list_NSE as T2 
                        ON T2.symbol = T1.nse_code AND T2.company LIKE '${query}%' AND T2.trading_symbol LIKE '%-EQ'
                   UNION
                   SELECT T3.*,T4.company,T4.code,T4.symbol,T4.exchange,T4.sc_group AS filter FROM stock_list_master_reuters_screener as T3 
                        JOIN master_security_list_BSE as T4 
                        ON T4.code = T3.bse_code AND T4.company LIKE '${query}%' 
                        AND (T4.sc_group = 'A' OR T4.sc_group = 'B' OR T4.sc_group = 'T' OR T4.sc_group = 'Z' OR T4.sc_group = 'X' OR T4.sc_group = 'XT')`;
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
                        exchange : getExchangeCode(row.exchange),
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