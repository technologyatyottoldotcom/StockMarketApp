const {convertDate, increaseDate} = require('../../Common/conversionOfDate');

module.exports = async function findClosingPrice(stockCode, startDate, diffDays, conn){
    var str1 = "" 
    var str2 = ""
    var closingPriceMatrix = [];

    //first query everything in nse
    for(let i=0; i<stockCode.length; i++)
        str1 += (i==stockCode.length-1)? "SYMBOL ='"+stockCode[i]+"'" : "SYMBOL ='"+stockCode[i]+"' OR ";
        
    let sql1 = `SELECT TIMESTAMP, SYMBOL, CLOSE FROM nse_bhav_shortened WHERE (${str1}) AND (SERIES ='EQ' OR SERIES='BE')`;
    const nse = await new Promise((resolve, reject) => {
        conn.query(sql1, (err, result) => {
            if(err) throw (err);
            resolve(result);
        })
    });

    let k=nse.length-1;
    while(convertDate(nse[k].TIMESTAMP) > startDate)  k--;
    
    closingPriceMatrix[0] = [];
    for(var j=0; j<stockCode.length; j++){
        if(stockCode[j] == 'Cash'){
            closingPriceMatrix[0][j] = 1;
        }else{
            for(var l=k; l>0; l--){
                if(stockCode[j] == nse[l].SYMBOL){
                    closingPriceMatrix[0][j] = nse[l].CLOSE;
                    break;
                }
                if(l == k-100){
                    closingPriceMatrix[0][j] = '';
                    str2 += " SC_CODE ='"+stockCode[j]+"' OR";
                    break;
                }
            }
        }
    }


    closingPriceMatrix = findnse(closingPriceMatrix, nse, k, diffDays, stockCode, startDate);

    str2 = str2.split(' ').slice(0, str2.split(' ').length-1).join(' ');    //this step is to remove the last extra OR in str2
    //query the remaining stockCode from bse
    let sql2 = `SELECT TRADING_DATE AS TIMESTAMP, SC_CODE AS SYMBOL, CLOSE FROM bse_bhav_shortened WHERE (${str2})`;
    const bse = await new Promise((resolve, reject) => {
        conn.query(sql2, (err, result) => {
            if(err) throw (err);
            resolve(result);
        })
    });

    k=bse.length-1;
    while(convertDate(bse[k].TIMESTAMP) > startDate)  k--;

    for(var j=0; j<stockCode.length; j++){
        if(closingPriceMatrix[0][j] == ''){
            for(let l=k; l>0; l--){
                if(stockCode[j] == bse[l].SYMBOL){
                    closingPriceMatrix[0][j] = bse[l].CLOSE;
                    break;
                }
            }
        }
    }

    closingPriceMatrix = findbse(closingPriceMatrix, bse, k, diffDays, stockCode, startDate);

    return  closingPriceMatrix;
}


function findnse(closingPriceMatrix, close, k, diffDays, stockCode, startDate){

    temp = increaseDate(startDate)

    k++;
    for(var i=1; i<diffDays; i++){
        closingPriceMatrix[i] = [];

        //if there is close data for current date then copy it to closingPriceMatrix[i]
        if(temp == convertDate(close[k].TIMESTAMP)){
            //create a heap of datas having current date;
            var heap = [];
            var n=0;
            while(temp == convertDate(close[n+k].TIMESTAMP)){
                heap[n] = close[k+n];
                n++;
                if(n+k == close.length)     break;  //if we encounter last data object then simply break;
            }
            for(var j=0; j<stockCode.length; j++){
                for(var l=0; l<heap.length; l++){
                    if(stockCode[j] == heap[l].SYMBOL && heap[l].SERIES == 'EQ'){
                        closingPriceMatrix[i][j] = heap[l].CLOSE;
                        break;
                    }
                }
                if(closingPriceMatrix[i][j] == null){
                    for(var l=0; l<heap.length; l++){
                        if(stockCode[j] == heap[l].SYMBOL){
                            closingPriceMatrix[i][j] = heap[l].CLOSE;
                            break;
                        }
                    }
                }
                if(closingPriceMatrix[i][j] == null || closingPriceMatrix[i][j] == '') closingPriceMatrix[i][j] = closingPriceMatrix[i-1][j];
            }
            k += heap.length;   //increase the value of k
        }
        //if there is no close data for current date then copy the previous closingPriceMatrix[i-1] to current closingPriceMatrix[i]
        else{
            closingPriceMatrix[i] = closingPriceMatrix[i-1];
        }

        //if we encounter last close data then break the loop
        if(k == close.length){
            //before breaking make sure that remaining matrix is filled if there is...
            i += 1;
            while(i<diffDays){
                closingPriceMatrix[i] = closingPriceMatrix[i-1];
                i++;
            }
            break;
        }
        //change current date
        temp = increaseDate(temp);
    }

    return closingPriceMatrix;
}

function findbse(closingPriceMatrix, close, k, diffDays, stockCode, startDate){
    
    temp = increaseDate(startDate)

    k++;
    for(var i=1; i<diffDays; i++){
        //if there is close data for current date then copy it to closingPriceMatrix[i]
        if(temp == convertDate(close[k].TIMESTAMP)){
            //create a heap of datas having current date;
            var heap = [];
            var n=0;
            while(temp == convertDate(close[n+k].TIMESTAMP)){
                heap[n] = close[k+n];
                n++;
                if(n+k == close.length)     break;  //if we encounter last data object then simply break;
            }
            for(var j=0; j<stockCode.length; j++){
                if(closingPriceMatrix[i][j] == ''){
                    for(var l=0; l<heap.length; l++){
                        if(stockCode[j] == heap[l].SYMBOL){
                            closingPriceMatrix[i][j] = heap[l].CLOSE;
                            break;
                        }
                    }
                    if(closingPriceMatrix[i][j] == '') closingPriceMatrix[i][j] = closingPriceMatrix[i-1][j];
                }
            }
            k += heap.length;   //increase the value of k
        }
        //if there is no close data for current date then copy the previous closingPriceMatrix[i-1] to current closingPriceMatrix[i]
        else{
            closingPriceMatrix[i] = closingPriceMatrix[i-1];
        }

        //if we encounter last close data then break the loop
        if(k == close.length){
            //before breaking make sure that remaining matrix is filled if there is...
            i += 1;
            while(i<diffDays){
                closingPriceMatrix[i] = closingPriceMatrix[i-1];
                i++;
            }
            break;
        }
        //change current date
        temp = increaseDate(temp);
    }
    return closingPriceMatrix;
}
