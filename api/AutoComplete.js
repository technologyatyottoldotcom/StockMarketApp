const {conn} = require('./connection');

const AutoComplete = async (query)=>{
    return new Promise((resolve,reject)=>{
        // resolve(query)

        let sql = `SELECT * FROM master_security_list_NSE WHERE company LIKE '${query}%'`;
        conn.query(sql,(error,result)=>{
            if(!error)
            {

                let suggestions = [];
                result.forEach(row => {
                    suggestions.push({
                        company : row.company,
                        code : row.code,
                        symbol : row.symbol
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