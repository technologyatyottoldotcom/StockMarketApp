const {conn} = require('../../../server/connection');
const findLatestClose = require("../../Common/findLatestClose");
const getOrderBook = require("./getOrderBook");

async function sendValue(req, res, next){
        
        var {data, isin, date, stockNameMap} = await getOrderBook(conn);
        //reduced the stockCode if quantity is zero

        var {newISIN, quantity} = findQuantity(isin, data);
        const {close, stockCode} = await findLatestClose(newISIN, conn);
    
        const {industryName, ricCode} = await findIndustry(stockCode);
        const marketCap = await findMarketCap(ricCode, close);
        const percentage = findInvestmentPercentage(close, quantity);
        const {industryTable, weightSum} = makeIndustryTable(industryName, percentage);
        const marketCapTable = await makeMarketCapTable(percentage, marketCap);
        industryTable.sort(compare);

        res.send({marketCapTable, industryTable});

        //res.render('quantity', {marketCapTable: marketCapTable, industryTable: industryTable, weightSum: weightSum});
        
}

function compare(a, b){
        const portA = a.weight;
        const portB = b.weight;

        return portB - portA;
}

async function makeMarketCapTable(percentage, marketCap){
        
        let sql = 'SELECT * FROM market_cap_classification';
        const cap = await new Promise(async(resolve, reject) => {
            conn.query(sql, (err, result) =>{
                if(err) throw(err);
                resolve(result);
            })
        })

        var marketCapTable = [];
        for(let i=0; i<cap.length; i++){
            var capWeight = 0;
            for(let j=0; j<marketCap.length; j++){
                if(marketCap[j] >= parseFloat(cap[i].value) && marketCap[j] != 'undefined'){
                    capWeight += percentage[j];
                    percentage[j] = 0;
                }
            }
            const obj = new Object();
            obj.name = cap[i].m_cap;
            obj.value = capWeight;

            marketCapTable.push(obj);
        }

            //for undefined
            var capWeight = 0;
            for(let j=0; j<marketCap.length; j++){
                if(marketCap[j] == 'undefined'){
                    capWeight += percentage[j];
                }
            }
            const obj = new Object();
            obj.name = 'undefined';
            obj.value = capWeight;
            
            marketCapTable.push(obj);

        return marketCapTable;
}


function makeIndustryTable(industryName, percentage){

        //find unique industryName
        var uniqueIndustryName = findUniqueIndustryName(industryName);

        var industryTable =[];
        var weightSum = 0;
        for(let i=0; i<uniqueIndustryName.length; i++){
            var weight = 0;
            for(var j=i; j<industryName.length; j++){
                if(uniqueIndustryName[i] == industryName[j])
                    weight += percentage[j];
            }

            weightSum += weight;
            const obj = new Object();
            obj.name = uniqueIndustryName[i];
            obj.value = weight;
            
            industryTable.push(obj);
        }

        return {industryTable, weightSum};
}

function findUniqueIndustryName(industryName){
        var uniqueIndustryName = new Set();
        industryName.forEach(element => {
            uniqueIndustryName.add(element);
        })
        return Array.from(uniqueIndustryName);
}


function findInvestmentPercentage(closePrice, quantity){
        //find investment value
        var investmentValue = [];
        var total = 0;
        for(let i=0; i<closePrice.length; i++){
            investmentValue[i] = closePrice[i]*quantity[i];
            total += investmentValue[i];
        }
        
        //find percentage weightage of investment value
        var percentage = [];
        for(let i=0; i<closePrice.length; i++){
            percentage[i] = (investmentValue[i]/total)*100;
        }

        return percentage;
}


async function findMarketCap(ricCode, closePrice){

        var str = "";
        for(var i=0; i<ricCode.length; i++){
            str += (i==ricCode.length-1)? " stockCode='"+ricCode[i]+"'" : " stockCode='"+ricCode[i]+"' OR";
        }
        const recentField = await findRecentField();
        let sql = `select stockCode, ${recentField} AS field from fundamental_data_reuters_income_annual where (${str}) AND fieldName='Diluted Weighted Average Shares'`;
        //query to database
        const market = await new Promise(async(resolve, reject) => {
            conn.query(sql, (err, result) => {
                if(err) throw(err);
                resolve(result);
            })
        })

        var marketCap = [];

        for(var i=0; i<ricCode.length; i++){
            for(var j=0; j<market.length; j++){
                if(ricCode[i] == market[j].stockCode){
                    marketCap[i] = (market[j].field == '')? 'undefined' : market[j].field/10 * closePrice[i];
                }
            }
        }

        return marketCap;
}

//function to find the most recent field column
async function findRecentField(){

        let sql2 = 'SHOW COLUMNS from fundamental_data_reuters_income_annual';
        const field = await new Promise(async (resolve, reject) => {
            conn.query(sql2, (err, result) => {
                if(err) throw(err);
                resolve(result);
            })
        })
        //initialize first field as max
        var maxTemp = field[0].Field.split('_').join(' ');
        var maxDate = new Date(temp);

        for(let i=1; i<field.length; i++){
            var temp = field[i].Field.split('_').join(' ');
            var date = new Date(temp);
            if(maxDate < date || isNaN(maxDate.getDate())){
                maxTemp = temp;
                maxDate = date;
            }
        }

        return maxTemp.split(' ').join('_');
}


//function to find Industry name
async function findIndustry(stockCode){

        var str = "";
        for(var i=0; i<stockCode.length; i++){
            str += (i==stockCode.length-1)? " nse_code='"+stockCode[i]+"' OR bse_code='"+stockCode[i]+"'" : " nse_code='"+stockCode[i]+"' OR bse_code='"+stockCode[i]+"' OR";
        }
        let sql2 = `SELECT * FROM stock_list_master_reuters_screener where (${str})`;
        //query to database
        const industry = await new Promise(async (resolve, reject) => {
            conn.query(sql2, async(err, result) => {
                if(err) return reject(err);
                resolve(result);
            })
        });

        //create array of industryName and ricCode
        var industryName = [];
        var ricCode = [];

        for(var i=0; i<stockCode.length; i++){
            for(var j=0; j<industry.length; j++){
                if(stockCode[i] == industry[j].nse_code || stockCode[i] == industry[j].bse_code){
                    industryName[i] = (industry[j].reuters =="")? 'other' : industry[j].reuters_industry;
                    ricCode[i] = industry[j].ric_code;
                    break;
                }else{
                    industryName[i] == 'other';
                    ricCode[i] == 'not Found';
                }
            }
        }
        
        return {industryName, ricCode};
}


function findQuantity(isin, data){
        var quantity = [];
        var newISIN = [];

        isin.forEach((element, i) => {
            const value = findTotalQuantity(element, data);

            if(value != 0){
                newISIN.push(element);
                quantity.push(value);
            }
        });

        
        return {newISIN, quantity};
}

//function to find totalquantiy average and total cost
function findTotalQuantity(element, originalData) {
        //FIFO implementation
        //first create a duplicate file(deep copy)
        var data = JSON.parse(JSON.stringify(originalData));
        //need to remove comma also in our quantity hence split is used
        var totalQuantity = 0;
        for(var i=0; i<data.length; i++){
            if(data[i].isin == element && data[i].Side == 'Buy'){
                totalQuantity += parseInt(data[i].Quantity.toString().split(",").join(""));
            }
            //if side is sell then subtract from totalquantity
            if(data[i].isin == element && data[i].Side == 'Sell'){
                totalQuantity -= parseInt(data[i].Quantity.toString().split(",").join(""));
            }
        }            
        return totalQuantity;
}


module.exports = sendValue;