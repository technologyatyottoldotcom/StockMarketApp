const {conn} = require('../../../server/connection');
const findLatestClose = require("../../Common/findLatestClose");
const getOrderBook = require("./getOrderBook");

//function to return response to the client
async function sendValue(req, res, next){
        
        var {data, isin, date, stockNameMap} = await getOrderBook(conn);
        data = removeZeroTrxn(data);
        const {newISIN, totalQuantity, totalCost, averageCost} = findTotalQuantity(isin, data);

        const {close, stockCode} = await findLatestClose(newISIN, conn);
        //make portfolioData
        const {portfolioData, sum} = await makePortfolio(stockNameMap, newISIN, close, stockCode, totalQuantity, totalCost, averageCost); 
        portfolioData.sort(compare);    //sort according to increasing portfolio weight

        res.send({portfolioData, sum});
        //res.render('portfolio', {data: portfolioData, sum: sum});
}

//function to make portfolio
async function makePortfolio(map, isin, close, stockCode, totalQuantity, totalCost, averageCost){
        //creata an array to push portfolio data and array to copy stockcodes from map
        var portfolioData = [];

        for(let i=0; i<isin.length; i++){
                //creata an object and push it into array of objects 
                const obj = new Object();
                obj.StockCode = stockCode[i];
                obj.StockName = map.get(isin[i]);
                obj.Quantity = totalQuantity[i];
                obj.AverageCost = averageCost[i];
                obj.CostValue = totalCost[i];
                obj.CurrentPrice = close[i];
                obj.CurrentValue = parseFloat(obj.CurrentPrice * obj.Quantity).toFixed(2);
                            
                portfolioData.push(obj);
            
        }

        const sum = findSum(portfolioData);

        for(let i=0; i<stockCode.length; i++){
            portfolioData[i].PortfolioWeight = parseFloat(portfolioData[i].CurrentValue/sum.currentValueSum * 100).toFixed(2);
            portfolioData[i].TotalReturn = parseFloat((portfolioData[i].CurrentValue/portfolioData[i].CostValue - 1)*100).toFixed(2);
        }
        
        return {portfolioData, sum};
}

//sort according to portfolio weight and portfolio weight are directly porpotional to current value
function compare(a, b){
        const portA = a.CurrentValue;
        const portB = b.CurrentValue;

        return portB - portA;
}

//find sum of various fields of portfolio data
function findSum(portfolioData){
        var costValueSum =0, currentValueSum = 0, portfolioWeightSum =0;
        for(var i=0; i < portfolioData.length; i++){
                costValueSum += parseFloat(portfolioData[i].CostValue);
                currentValueSum += parseFloat(portfolioData[i].CurrentValue);
            
        }
        const sum = new Object();
        sum.costValueSum = parseFloat(costValueSum).toFixed(2);
        sum.currentValueSum = parseFloat(currentValueSum).toFixed(2);
        sum.totalReturnSum = parseFloat((currentValueSum/costValueSum - 1)*100).toFixed(2);

        return sum;
}


function findTotalQuantity(isin, data){
        var totalQuantity = [];
        var totalCost = [];
        var averageCost = [];
        var newISIN = [];

        isin.forEach((element,i) => {
            const {total_quantity, total_cost, average_cost } = find(element, data);

            if(total_quantity != 0){
                newISIN.push(element);
                totalQuantity.push(total_quantity);
                totalCost.push(total_cost);
                averageCost.push(average_cost);
            }
        });
        
        return {newISIN, totalQuantity, totalCost, averageCost};
}

//function to find totalquantiy average and total cost
function find(element, originalData) {
        //FIFO implementation
        //first create a duplicate file(deep copy)
        var data = JSON.parse(JSON.stringify(originalData));
        //need to remove comma also in our quantity hence split is used
        for(var i=0; i<data.length; i++){
            var sell = parseInt(data[i].Quantity.toString().split(",").join(""));
            if(data[i].Side == "Sell" && sell != 0 && data[i].isin == element){
                for(var j=0; j<i; j++){
                    var buy = parseInt(data[j].Quantity.toString().split(",").join(""));
                    if(data[j].Side == "Buy" && buy != 0 && data[j].isin == element){
                        if(buy >= sell){
                            buy -= sell;
                            sell = 0;
                            data[j].Quantity = buy;
                            data[i].Quantity = sell;
                        }
                        else if(buy < sell){
                            sell -= buy;
                            buy = 0;
                            data[j].Quantity = buy;
                            data[i].Quantity = sell;
                        }
                    }
                }
            }
        }    
        
        
        //finding totalCost and averageCost
        var total_cost = 0, total_quantity = 0;
        for(var i=0; i<data.length; i++)
            if(data[i].isin == element){
                total_cost += parseInt(data[i].Quantity.toString().split(",").join(""))*parseFloat(data[i].trxnPrice);
                total_quantity += parseInt(data[i].Quantity.toString().split(",").join(""));
            }
        
        var average_cost = parseFloat(total_cost/total_quantity).toFixed(2);
        total_cost = parseFloat(total_cost).toFixed(2);
        return {total_quantity, total_cost, average_cost};
}


//function to remove zero trxn
function removeZeroTrxn(data){
        for(var i=0; i<data.length; i++){
            if(data[i].trxnPrice == 0){
                const {totalQuantity, averageCost} = findAverageToRemoveZero(data, i, data[i].isin);
                //find multiplication index
                var multiIndex;
                if(data[i].Side == 'Buy')
                    multiIndex = (totalQuantity + parseInt(data[i].Quantity.toString().split(",").join("")))/totalQuantity;
                else
                    multiIndex = (totalQuantity - parseInt(data[i].Quantity.toString().split(",").join("")))/totalQuantity;
                //change the lower index value
                for(var j=0; j<i; j++){
                    if(data[j].isin == data[i].isin){
                        data[j].trxnPrice = parseFloat(parseFloat(data[j].trxnPrice)/multiIndex).toFixed(2).toString();
                    }
                }
                data[i].trxnPrice = parseFloat(averageCost/multiIndex).toFixed(2).toString();
            }
        }
        return data;
}

//function to find average for removing zero trxn price
function findAverageToRemoveZero(originalData, i, element){
        //create a duplicate to perforem so that original is not affected
        var data = JSON.parse(JSON.stringify(originalData));
        for(var k = 0; k<i; k++){
            //if comma is there
            var sell = parseInt(data[k].Quantity.toString().split(",").join(""));
            if(data[k].Side == "Sell" && sell != 0 && data[k].isin == element){
                for(var j=0; j<k; j++){
                    var buy = parseInt(data[j].Quantity.toString().split(",").join(""));
                    if(data[j].Side == "Buy" && buy != 0 && data[k].isin == element){
                        if(buy >= sell){
                            buy -= sell;
                            sell = 0;
                            data[j].Quantity = buy;
                            data[k].Quantity = sell;
                        }
                        else if(buy < sell){
                            sell -= buy;
                            buy = 0;
                            data[j].Quantity = buy;
                            data[k].Quantity = sell;
                        }
                    }
                }
            }
        }
    
        //find average and total quantity
        var totalCost = 0, totalQuantity = 0;
        for(var j=0; j<i; j++){
            if(data[j].isin == element){
                totalCost += parseInt(data[j].Quantity.toString().split(",").join(""))*parseFloat(data[j].trxnPrice);
                totalQuantity += parseInt(data[j].Quantity.toString().split(",").join(""));
            }
        }
        var averageCost = parseFloat(totalCost/totalQuantity.toString().split(",").join("")).toFixed(2);
        return {totalQuantity,averageCost};
}

module.exports = sendValue;