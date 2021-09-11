const findClosingPrice = require('./findClosingPrice');
const getOrderBook = require('./getOrderBook');
const {convertDate, increaseDate} = require('../../Common/conversionOfDate');
const findLatestClose = require('../../Common/findLatestClose');

//function to deep copy array of objects
const deepCopy = (objectToBeCloned) => {
    let resultObj, value, key

    if (typeof objectToBeCloned !== "object" || objectToBeCloned === null) {
        return objectToBeCloned
    }

    if(typeof objectToBeCloned === "object") {
        if(objectToBeCloned.constructor.name !== "Object") {
            resultObj = new objectToBeCloned.constructor(objectToBeCloned)
        } else {
            resultObj = Array.isArray(objectToBeCloned) ? [] : {}
        }
    }

    for (key in objectToBeCloned) {
      value = objectToBeCloned[key]
      // Recursively copy for nested objects & arrays
      resultObj[key] = deepCopy(value)
    }
    return resultObj
}


//vunction to find quantity
function findQuantity(originalData, date, element){
    //first duplicate the original data
    var data = deepCopy(originalData);
    var k=0;
    var totalQuantity = 0;
    while(convertDate(data[k].Date) <= date){
        //if side is buy then add to totalquantity
        if(data[k].isin == element && data[k].Side == 'Buy'){
            totalQuantity += parseInt(data[k].Quantity.toString().split(",").join(""));
        }
        //if side is sell then subtract from totalquantity
        if(data[k].isin == element && data[k].Side == 'Sell'){
            totalQuantity -= parseInt(data[k].Quantity.toString().split(",").join(""));
        }
        k++;
        if(k == data.length)  break;    //if we found the last data then break
    }
    return totalQuantity;
}


//function to create totalQuantity matrix of date X stockCode
function findTotalQuantity(isin, date, data, diffDays){
    //find total quantity of unique date and stockCode
    var totalQuantity = [];
    for(var i=0; i<date.length; i++) {
        totalQuantity[i] = [];
        for(var j=0; j<isin.length; j++) {
            totalQuantity[i][j] = findQuantity(data, date[i], isin[j]);
        }
    }

    //use totalQuantity and create whole matrix of entire date(every day)
    //first create a current date starting from the first day
    var temp = new Date(date[0]);
    var totalQuantityMatrix = [];
    var k =0;   //point it to unique date data
    temp = convertDate(temp);
    //we have to copy the data in unique date to other days where buys and sells don't occurs
    for(var i=0; i<diffDays; i++){
        totalQuantityMatrix[i] = [];
        //if current date is less than the uniquedate where buy and sells occur then copy the data in uniquedate to totalQuantityMatrix[i] 
        if(temp < date[k]){
            for(var j=0; j<isin.length; j++){
                totalQuantityMatrix[i][j] = totalQuantity[k-1][j];
            }
        }
        //if current data has buy and sell(i.e. present in uniquedate) then copy that data in totalQuantityMatrix[i] and increse the pointer of uniquedate
        else if(temp == date[k]){
            for(var j=0; j<isin.length; j++){
                totalQuantityMatrix[i][j] = totalQuantity[k][j];
            }
            k++;
        }
        //increase current date
        temp = increaseDate(temp);

    }
    return totalQuantityMatrix;
}



//this function is to calculate cashflow in a given date
function calculateCashFlow(data, date){
    var cashFlow = 0;
    for(var i=0; i<data.length; i++){
        if(convertDate(data[i].Date) == date){
            //if buy then add to total
            if(data[i].Side == 'Buy'){
                cashFlow += parseFloat(data[i].Net);
            }//if sell then subtract from total
            else{
                cashFlow -= parseFloat(data[i].Net);
            }
        }
    }
    return parseFloat(cashFlow.toFixed(2));
}


//function to find cash flow
function findCashFlow(data, stockCode, date, diffDays){
    var cashFlow = [];
    //create a current date starting from first buy
    var temp = new Date(date[0]);
    var k =0;   //index k is to point to the close data
    temp = convertDate(temp);
    for(var i=0; i<diffDays; i++){
        //if current date is unique (i.e. buy or sells occurs), then calculate cash flow
        if(temp == date[k]){
            cashFlow[i] = calculateCashFlow(data, date[k]);
            k++;
        }//else make it zero
        else{
            cashFlow[i] = 0;
        }
        //increase current date by 1
        temp = increaseDate(temp);
    }
    return cashFlow;
}


//function to find portfolioValue array
function findPortfolioValue(totalQuantity, closingPrice, stockCode, diffDays){
    var portfolioValue = [];
    //this is basically sum product of totalQuantity and closingPrice matrices
    for(var i=0; i<diffDays; i++){
        portfolioValue[i] = 0;
        for(var j=0; j<stockCode.length; j++){
            portfolioValue[i] += totalQuantity[i][j] * parseFloat(closingPrice[i][j]);
        }  
    }
    return portfolioValue;
}


//function to find arrays of index and unit of valuation table
function findIndex(cashFlow, portfolioValue, diffDays){
    var unit = [];
    var index = [];
    //calculate for first array
    unit[0] = 0;
    index[0] = 1;
    //loop from 1 <-- end for unit and index
    for(var i=1; i<diffDays; i++){
        unit[i] = unit[i-1] + cashFlow[i]/index[i-1];
        index[i] = (portfolioValue[i] == 0)? index[i-1] : portfolioValue[i]/unit[i];
    }
    return index;
}


//function to create date for everyday
function findAllDates(startDate, diffDays){
    var allDates = [];
    var temp = startDate;
    //add another date at the top since two same dates are gonig to display first
    allDates[0] = temp;
    for(var i=1; i < diffDays; i++){

        allDates[i] = temp;
        temp = increaseDate(temp);
    }
    return allDates;
}


module.exports = async function(conn){

        //FOR QUANTITY TABLE....
        const {data, isin, date, stockNameMap} = await getOrderBook(conn);

        //calculate no. of days from start of purchase till today
        var today = new Date();
        var today = convertDate(today);
        var diffDays = Math.ceil(Math.abs(new Date(date[0]) - new Date(today)) / (1000 * 60 * 60 * 24));
        date.push(today);

        //find matrix of total quantity X stockCode
        const totalQuantity = findTotalQuantity(isin, date, data, diffDays);
        
        const {stockCode, close} = await findLatestClose(isin, conn);   //this step is neede to get the stockCode
        //find matrix of closingPrice X stockCode
        const closingPrice = await findClosingPrice(stockCode, date[0], diffDays, conn);

        //find various remaining arrays
        var cashFlow = findCashFlow(data, stockCode, date, diffDays);
        var portfolioValue = findPortfolioValue(totalQuantity, closingPrice,stockCode, diffDays);

        //add a date at top same as the starting date for since it should start havaing two dates
        cashFlow = [cashFlow[0], ...cashFlow];
        portfolioValue = [cashFlow[0], ...portfolioValue];
        diffDays++;

        const index = findIndex(cashFlow, portfolioValue, diffDays);
        const allDates = findAllDates(date[0], diffDays);
        
        return {allDates, index, diffDays};
}
