const {convertDate, increaseDate} = require('../../Common/conversionOfDate');

module.exports = async function findComparableIndex(benchmark, conn, allDates, diffDays){

    let sql = `SELECT * FROM IndexData_NSE_BSE WHERE Symbol='${benchmark}'`;
    const data = await new Promise(async(resolve, reject) => {
        conn.query(sql, (err, result) => {
            if(err) throw(err);
            resolve(result);
        })
    })

    const comparableValue = await findValue(data, allDates, diffDays);
    const comparableIndex = findIndex(comparableValue, diffDays);

    return comparableIndex;
}


//function to find index of the desired compare object
async function findIndex(comparableValue, diffDays){
    var comparableIndex = [];
    comparableIndex[0] = 1;
    for(var i=1; i<diffDays; i++){
        comparableIndex[i] = comparableIndex[i-1]*(parseFloat(comparableValue[i])/parseFloat(comparableValue[i-1]));
    }
    return comparableIndex;
}


//function to find close value of the desired compare object
async function findValue(data, allDates, diffDays){
    //take the pointer to first trading date (i.e. first time buy and sells occurs)
    var k=0;
    while(convertDate(data[k].Date) < allDates[0]){
        k++;
    }
    //create an array to store
    var comparableValue = [];
    let i=0;
    //push initial value (this is because the starting date might not have data value so, push the predeccessor value)
    comparableValue[i] = data[k].Close;
    k++;
    for(i=1; i<diffDays; i++){

        if(allDates[i] == convertDate(data[k].Date)){
            comparableValue[i] = data[k].Close;
            k++;
        }else{
            comparableValue[i] = comparableValue[i-1];  //if data is not fount then push previous data
        }
        //if data is finish then break
        if(k == data.length)  break;
    }
    //make sure the remaining array are also filled if temained
    if(k == data.length){
        i++;
        while(i<diffDays){
            comparableValue[i] = comparableValue[i-1];
            i++;
        }
    }
    return comparableValue;
}