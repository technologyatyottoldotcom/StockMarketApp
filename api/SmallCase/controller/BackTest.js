const {conn} = require('../../../server/connection');
const getIndexAndCompare = require('./BT-index-compare');
const findLatestClose = require('../../Common/findLatestClose');
const splitAdjustment = require('./SplitAdjustment');
const { convertDate, increaseDate } = require('../../Common/conversionOfDate');
const findClosingPrice = require('./findClosingPrice');


async function BackTest(res, newData, benchmark , frequency){

    if(newData.length <= 1){
        res.send({status: false, STOCKCODE: 'CASH only'});
    }

    const {isin, portfolio} = await getUniqueStockCode(conn, newData);
    const {close, stockCode} = await findLatestClose(isin, conn);

    var {startDate, lastDate, diffDays} = findStartDate(newData[0].dateCreated);
    
    var closingPriceMatrix = await findClosingPrice(stockCode, startDate, diffDays, conn);

    if(closingPriceMatrix.status == false){
        res.send(closingPriceMatrix);
        return;
    }

    const adjustedPrice = adjustClosePrice(closingPriceMatrix);
    const targetWeight = findTargetWeight(portfolio);
    const allDates = findAllDates(startDate, diffDays);

    const {data, cashValue, date} = rebalance(adjustedPrice, stockCode, targetWeight, allDates, frequency, startDate, lastDate );

    getIndexAndCompare(data, adjustedPrice, allDates, date, stockCode, cashValue, diffDays, benchmark, res, conn);

}


function findAllDates(startDate, diffDays){
    var allDates = [];
    var temp = startDate
    //add another date at the top since two same dates are gonig to display first
    for(var i=0; i < diffDays; i++){
        allDates[i] = temp;
        temp = increaseDate(temp);
    }
    return allDates;
}


function findTargetWeight(portfolio){
    var targetWeight = [];

    for(let i=0; i<portfolio.length; i++){
        targetWeight.push(parseFloat(portfolio[i].PortfolioWeight));
    }

    return targetWeight;
}


function adjustClosePrice(closingPriceMatrix){

    closingPriceMatrix = interchangeMatrix(closingPriceMatrix);

    for(let i=0; i<closingPriceMatrix.length; i++){
        closingPriceMatrix[i] = splitAdjustment(closingPriceMatrix[i]);
    }
    closingPriceMatrix = interchangeMatrix(closingPriceMatrix);

    return closingPriceMatrix;
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


function findStartDate(lastDate){

    lastDate = new Date(lastDate);
    var startDate = new Date(lastDate.setDate(lastDate.getDate() -1));

    startDate = new Date(startDate.setFullYear(startDate.getFullYear()-3));

    lastDate = convertDate(lastDate);
    startDate = convertDate(startDate);

    var diffDays = Math.ceil(Math.abs(new Date(lastDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))+1;

    return {startDate, lastDate, diffDays};
}



async function getUniqueStockCode(conn, data){

    let sql = 'SELECT * FROM smallCase_initial_portfolios'
    let portfolio = [];

    if(data == null){
        portfolio = await new Promise(async(resolve, reject) => {
            conn.query(sql, (err, result) => {
                if(err) throw(err);
                resolve(result);
            })
        })
    }

    portfolio = data;

    var isin = new Set();
    portfolio.forEach(element => {
        isin.add((element.isin).replace(/(\r\n|\n|\r)/gm, ""));
    });

    isin = Array.from(isin);

    return {isin, portfolio};
}


//REBALANCING

function rebalance(close, stockCode, targetWeight, allDates, frequency, startDate, lastDate){

    const date = findDate(frequency, startDate, lastDate);
    const yearlyClose = findYearlyClosePrice(close, allDates, date);

    var totalQuantity = []
    totalQuantity[0] = []; totalQuantity[0][0] = 10000000; for(let i=1; i<stockCode.length; i++) totalQuantity[0][i] = 0;

    var sum = []; var cashValue = []; var data = [];
    for(var i=0; i<date.length; i++){
        sum.push(findSumProduct(totalQuantity[i], yearlyClose[i]));
        var {trade, targetStock} = findTargetStock(totalQuantity[i], yearlyClose[i], targetWeight, sum[i]);
        targetStock[0] = trade[0];
        totalQuantity.push(targetStock);
        cashValue.push(trade[0]);

        for(var j=1; j<stockCode.length; j++){
            const obj = new Object;
            obj.Date = date[i];
            obj.stockCode = stockCode[j];
            obj.Quantity = Math.abs(trade[j]);
            obj.Side = (trade[j]<0)? 'Sell':'Buy';
            obj.trxnPrice = yearlyClose[i][j];
            obj.grossValue = obj.Quantity*obj.trxnPrice;

            data.push(obj);
        }
    }
    
    return {data, cashValue, date}
}


const findSum = (array) => array.reduce((a,b) => parseFloat(a)+parseFloat(b));
const findMaxIndex = (array) => array.reduce((iMax, x, i, array) => (parseFloat(x)>parseFloat(array[iMax]))? i:iMax,0);
const findSumProduct = (array1, array2) => {
        var product = [];
        for(let i=0; i<array1.length; i++)  product[i] = array1[i]*array2[i];
        return findSum(product);
    }

function findTargetStock(totalQuantity, currentPrice, targetWeight, sum){
    const len = totalQuantity.length;

    var targetStock = []; var proposedWeight = [];
    for(let i=0; i<len; i++){
        targetStock[i] = Math.round(parseFloat(targetWeight[i])*sum/currentPrice[i]/100);
        proposedWeight[i] = targetStock[i]*currentPrice[i]/sum*100;
    }

    var weightSum = findSum(proposedWeight)
        
    while(weightSum > 100){
        var maxIndex = findMaxIndex(proposedWeight);
        targetStock[maxIndex] -= 1;
        proposedWeight[maxIndex] = targetStock[maxIndex]*currentPrice[maxIndex]/sum*100;
        weightSum = findSum(proposedWeight);
    }

    var activeWeight = [];  for(let i=0; i<len; i++)    activeWeight[i] = parseFloat(targetWeight[i])-proposedWeight[i];

    var trade = [];
    trade[0] = sum - findSumProduct(targetStock.slice(1,len), currentPrice.slice(1,len));
    for(var i=1; i<len; i++)    trade[i] = targetStock[i]-totalQuantity[i];

    return {trade, targetStock};
}


function findYearlyClosePrice(close, allDates, date){
    var yearlyClose =[];
    var j=0;
    for(let i=0; i<allDates.length; i++){
        if(allDates[i] == date[j]){
            yearlyClose[j] = close[i];
            j++;
        }
    }

    return yearlyClose;
}


function findDate(frequency, startDate, lastDate){

    var date = [];
    temp = startDate;
    if(frequency == '12_Month'){

        while(temp <= lastDate){
            date.push(temp);
            temp = convertDate(new Date(new Date(new Date(temp).setFullYear(new Date(temp).getFullYear()+1))));
        }
        date.pop();

    }else if(frequency == 'Year_End'){

        while(temp <= lastDate){
            date.push(temp);
            temp = increaseDate(temp);
            temp = convertDate(new Date(new Date(temp).getFullYear()+1,0,0));
        }

    }else if(frequency == 'Quarter_End'){

        date.push(temp);
        var mon = new Date(temp).getMonth()+1;
        while (mon % 3 !=0){
            mon++;
        }
        temp = convertDate(new Date(new Date(temp).getFullYear(),mon,0));

        while(temp <= lastDate){
            date.push(temp);
            temp = new Date(increaseDate(temp));
            temp = convertDate(new Date(temp.getFullYear(), temp.getMonth()+3, 0));
        }

    }else if(frequency == 'Month_End'){

        while(temp <= lastDate){
            date.push(temp);
            temp = increaseDate(temp);
            temp = new Date(new Date(new Date(temp).setMonth(new Date(temp).getMonth()+1)).setDate(0));
            temp = convertDate(temp);
        }

    }

    return date;
}

module.exports = {BackTest}