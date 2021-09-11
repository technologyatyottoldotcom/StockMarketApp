var findComparableIndex = require('./findComparableIndex');
const {convertDate, increaseDate} = require('../../Common/conversionOfDate');


module.exports = async function getIndexAndCompare(data, adjustedPrice, allDates, date, stockCode, cashValue, diffDays, benchmark, res, conn){

    //remove cash from stockcode and cash price from close price matrix(adjusted price)
    stockCode.shift();
    var closingPrice = interchangeMatrix(adjustedPrice);
    closingPrice.shift();
    closingPrice = interchangeMatrix(closingPrice);
    date.push(allDates[allDates.length-1])

    const totalQuantity = findTotalQuantity(stockCode, date, data, diffDays);
    var portfolioValue = findPortfolioValue(totalQuantity, closingPrice,stockCode, diffDays);
    portfolioValue = addCashValue(portfolioValue, cashValue, allDates, date, diffDays);
    var cashFlow = getCashFlow(diffDays);

    cashFlow = [cashFlow[0], ...cashFlow];
    portfolioValue = [cashFlow[0], ...portfolioValue];
    allDates = [allDates[0], ...allDates];
    diffDays++;

    const index = findIndex(portfolioValue, cashFlow, diffDays);

    const compareIndex = await findComparableIndex(benchmark, conn, allDates, diffDays);

    const {table1, table2, table3} = makeTable(allDates, diffDays, index, compareIndex);

    const indexObj = getIndexObject(index, compareIndex, allDates, benchmark);

    res.send({status: true, indexObj, table1, table2, table3})

    //res.render('back-test', {allDates: allDates, index: index, compareIndex: compareIndex, diffDays: diffDays, compareTo: compareTo,
      //  duration: duration, table1: table1, table2: table2, table3: table3});
}


function getIndexObject(index, compareIndex, allDates, benchmark){
    var indexObj = [];
    benchmark = benchmark.split('_').join(' ');
    for(let i=0; i<index.length; i++){
        const obj = new Object();
        obj.Portfolio = index[i];
        obj[benchmark] = compareIndex[i];
        obj.date = allDates[i];

        indexObj.push(obj);
    }
    return indexObj;
}




//this function is to find index...




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
function findQuantity(originalData, date, stockCode){
    //first duplicate the original data
    var data = deepCopy(originalData);
    var k=0;
    var totalQuantity = 0;
    while(data[k].Date <= date){
        //if side is buy then add to totalquantity
        if(data[k].stockCode == stockCode && data[k].Side == 'Buy'){
            totalQuantity += parseInt(data[k].Quantity.toString().split(",").join(""));
        }
        //if side is sell then subtract from totalquantity
        if(data[k].stockCode == stockCode && data[k].Side == 'Sell'){
            totalQuantity -= parseInt(data[k].Quantity.toString().split(",").join(""));
        }
        k++;
        if(k == data.length)  break;    //if we found the last data then break
    }
    return totalQuantity;
}


//function to create totalQuantity matrix of date X stockCode
function findTotalQuantity(stockCode, date, data, diffDays){
    //find total quantity of unique date and stockCode
    var totalQuantity = [];
    for(var i=0; i<date.length; i++) {
        totalQuantity[i] = [];
        for(var j=0; j<stockCode.length; j++) {
            totalQuantity[i][j] = findQuantity(data, date[i], stockCode[j]);
        }
    }

    //use totalQuantity and create whole matrix of entire date(every day)
    //first create a current date starting from the first day
    var totalQuantityMatrix = [];
    var k =0;   //point it to unique date data
    temp = date[0];
    //we have to copy the data in unique date to other days where buys and sells don't occurs
    for(var i=0; i<diffDays; i++){
        totalQuantityMatrix[i] = [];
        //if current date is less than the uniquedate where buy and sells occur then copy the data in uniquedate to totalQuantityMatrix[i] 
        if(temp < date[k]){
            for(var j=0; j<stockCode.length; j++){
                totalQuantityMatrix[i][j] = totalQuantity[k-1][j];
            }
        }
        //if current data has buy and sell(i.e. present in uniquedate) then copy that data in totalQuantityMatrix[i] and increse the pointer of uniquedate
        else if(temp == date[k]){
            for(var j=0; j<stockCode.length; j++){
                totalQuantityMatrix[i][j] = totalQuantity[k][j];
            }
            k++;
        }
        //increase current date
        temp = increaseDate(temp);
    }

    return totalQuantityMatrix;
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
function findIndex(portfolioValue, cashFlow, diffDays){
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


function interchangeMatrix(matrix){
    var newMatrix = [];

    for(var i=0; i<matrix[0].length; i++){
        newMatrix[i] = [];
        for(var j=0; j<matrix.length; j++){
            newMatrix[i][j] = matrix[j][i];
        }
    }

    return newMatrix;
}


function addCashValue(portfolioValue, cashValue, allDates, date, diffDays){
    var newPortfolioValue = [];
    var j=0;
    for(var i=0; i<diffDays; i++){
        newPortfolioValue[i] = cashValue[j] + portfolioValue[i];
        if(allDates[i] == date[j+1])    j++;
    }

    return newPortfolioValue;
}


function getCashFlow(diffDays){
    var cashFlow = [];
    cashFlow[0] = 10000000;
    for(var i=1; i<diffDays; i++)   cashFlow[i] = 0;
    return cashFlow;
}









//this below  is for comparison data....






function makeTable(allDates, diffDays, index, compareIndex){
    //make table for short period
    const arr1 = [0, 1, 3, 6, 12, 'SI'];
    var table1 = [];
    for(let i=0; i<arr1.length; i++){
        const column = table1Column(allDates, diffDays, index, compareIndex, arr1[i]);
        table1.push(column);
    }
    //make table for annual period
    var table2 = [];
    for(let i=0; i<arr1.length; i++){
        const column = table2Column(allDates, diffDays, index, compareIndex, i);
        table2.push(column);
    }
    //make table for annul return, risk etc
    const table3 = table3Column(allDates, diffDays, index, compareIndex);

    return {table1, table2, table3};
}


function table3Column(allDates, diffDays, index, compareIndex){

    const indexChange = findChange(index);
    const compareIndexChange = findChange(compareIndex);

    var table3 = [];
    table3.push(findAnnualReturn(index, compareIndex));
    table3.push(findAnnualRisk(indexChange, compareIndexChange));
    table3.push(findSharpe(table3));
    table3.push(findBeta(compareIndexChange, indexChange));
    
    return table3;   
}


function findBeta(compareIndexChange, indexChange){
    const indexMean = indexChange.reduce((a, b) => a + b / indexChange.length);
    const compareIndexMean = compareIndexChange.reduce((a, b) => a + b / compareIndexChange.length);

    var slopeNumerator = 0, slopeDenominator = 0;
    for(let i=0; i< indexChange.length; i++){
        slopeNumerator += (compareIndexChange[i]-compareIndexMean)*(indexChange[i]-indexMean);
        slopeDenominator += Math.pow((compareIndexChange[i]-compareIndexMean), 2);
    }
    

    const obj = new Object();
    obj.portfolio = (isNaN(slopeNumerator/slopeDenominator))? '--' : parseFloat(slopeNumerator/slopeDenominator).toFixed(2);
    obj.compare = '';

    return obj;
}


function findSharpe(data){
    const obj = new Object();
    obj.portfolio = (isNaN(data[0].portfolio/data[1].portfolio))? '--': parseFloat(data[0].portfolio/data[1].portfolio).toFixed(2);
    obj.compare = (isNaN(data[0].compare/data[1].compare))? '--': parseFloat(data[0].compare/data[1].compare).toFixed(2);

    return obj;
}

function findAnnualRisk(indexChange, compareIndexChange){
    
    const annualRisk1 = getStandardDeviation(indexChange)*Math.sqrt(365);
    const annualRisk2 = getStandardDeviation(compareIndexChange)*Math.sqrt(365);

    const obj = new Object();
    obj.portfolio = (isNaN(annualRisk1))? '--' : parseFloat(annualRisk1).toFixed(2);
    obj.compare = (isNaN(annualRisk2))? '--' :parseFloat(annualRisk2).toFixed(2);

    return obj;
}


function getStandardDeviation (array) {
    const mean = array.reduce((a, b) => a + b) / array.length;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / array.length);
}

function findChange(array){
    var change = [];
    change[0] = 0;
    for(let i=1; i<array.length; i++)  change[i] = (array[i]/array[i-1] -1)*100;

    return change;
}


function findAnnualReturn(index, compareIndex){
    const annualReturn1 = Math.pow(index[index.length-1]/index[0], 365/(index.length))-1;
    const annualReturn2 = Math.pow(compareIndex[compareIndex.length-1]/index[0], 365/(compareIndex.length))-1;

    const obj = new Object();
    obj.portfolio = (isNaN(annualReturn1))? '--' : parseFloat(annualReturn1*100).toFixed(2);
    obj.compare = (isNaN(annualReturn2))? '--' : parseFloat(annualReturn2*100).toFixed(2);

    return obj;
}



function table2Column(allDates, diffDays, index, compareIndex, year){
    var start, end;

    if(year == 0){
        end = new Date(allDates[allDates.length-1]);
        end = new Date(end.setDate(end.getDate()-1));
        end = convertDate(end);

        start = new Date(allDates[allDates.length-1]);
        start = new Date(start.getFullYear(), 0, 0);
        start = convertDate(start);
    }else{
        start = new Date(allDates[allDates.length-1]);
        start = new Date(start.getFullYear()-year, 0, 0);
        start = convertDate(start);

        end = new Date(allDates[allDates.length-1]);
        end = new Date(end.getFullYear()-year+1, 0, 0);
        end = convertDate(end);
    }

    const obj = getObject(start, end, allDates, diffDays, index, compareIndex);
    return obj;
}


function table1Column(allDates, diffDays, index, compareIndex, month){
    var start, end;

    if(month == 0){
        end = new Date(allDates[allDates.length-1]);
        end = new Date(end.setDate(end.getDate()-1));
        end = convertDate(end);

        start = new Date(allDates[allDates.length-1]);
        start = new Date(start.getFullYear(), start.getMonth(), 0);
        start = convertDate(start);
    }else if(month == 'SI'){
        var start = allDates[0];
        
        end = new Date(allDates[allDates.length-1]);
        end = new Date(end.setDate(end.getDate()-1));
        end = convertDate(end);
    }else{
        start = new Date(allDates[allDates.length-1]);
        start = new Date(start.getFullYear(), start.getMonth()-month, 0);
        start = convertDate(start);

        end = new Date(allDates[allDates.length-1]);
        end = new Date(end.getFullYear(), end.getMonth(), 0);
        end = convertDate(end);
    }

    const obj = getObject(start, end, allDates, diffDays, index, compareIndex);
    return obj;
}

function getObject(start, end, allDates, diffDays, index, compareIndex){

    let i=0; let j=0;
    for(i=0; i<diffDays; i++){
        if(allDates[i] == start) break;
    }
    for(j=0; j<diffDays; j++){
        if(allDates[j] == end) break;
    }


    const portfolio = index[j]/index[i]-1;
    const compare = compareIndex[j]/compareIndex[i]-1;

    const obj = new Object();
    obj.start = start;
    obj.end = end;
    obj.portfolio = (isNaN(portfolio))? '--' : parseFloat(portfolio*100).toFixed(2);
    obj.compare = (isNaN(compare))? '--' : parseFloat(compare*100).toFixed(2);

    return obj;

}
