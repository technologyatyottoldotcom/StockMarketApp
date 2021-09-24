const {MarketDataStructure} = require('./MessageStructure');

// const {readMarketData} = require('./FormatData');

const LIVEFEED_BASE_URL = 'wss://masterswift-beta.mastertrust.co.in/ws/v1/feeds?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8';

function LiveFeed(exchange,code,func)
{
    const ws = new WebSocket(LIVEFEED_BASE_URL)

    let index = 0;

    ws.onopen = () => {
        console.log('connection done');
        ws.send(JSON.stringify({ "a": "subscribe", "v": [[exchange, code]], "m": "marketdata" }))

        setInterval(()=>{
            ws.send(JSON.stringify({"a": "h", "v": [[exchange, code]], "m": ""}))
        },10*100)
    }

    ws.onmessage = (response) => {

        let data = response.data;
        // console.log(data)
        let BufferLen = Buffer.byteLength(data);
        // console.log(BufferLen);
        let apidata = readMarketData(data);
            if(apidata.size <= BufferLen)
            {
                let livedata = apidata.livedata;
                // console.log(livedata)
                func(livedata.last_traded_price);
                console.log(code,index++," PRICE : ",livedata.last_traded_price);
            }
    }

    // ws.onerror('error', (error) => {
    //     console.log(error);
    // })
}

// LiveFeed(1,2885);
// LiveFeed(1,1333);


function readMarketData(data,prevClose)
{
    // console.log(prevClose);
    let multiplier = getMultiplier(1)
    let response = {}

    //add data fetched from api
    MarketDataStructure.forEach(m =>{
        response[m.field] = convertIntoFormat(data,m.start,m.end,m.type,multiplier);
    });

    // console.log(response);

    //add custom data made from fetched data

    //get changed price
    // let PC = prevClose == -1 ? response['close_price'] : prevClose;
    let PC = response['close_price'];

    let changed_amount = convertIntoNumber(response['last_traded_price'])-convertIntoNumber(PC);
    // console.log(prevClose,response['last_traded_price'],PC,changed_amount);
    // console.log(changed_amount);
    if(Number.isNaN(changed_amount))
    {
        // console.log('Not A Number....');
        changed_amount = 0;
        PC = '-1';
    }
    response['change_price'] = convertIntoMoneyFormat(changed_amount);
    response['change_percentage'] = ((changed_amount/convertIntoNumber(PC))*100).toFixed(2)+'%';

    // console.log(changed_amount,response['change_price'],response['change_percentage']);

    let size = MarketDataStructure[MarketDataStructure.length - 1].end;

    // console.log(size);


    return {
        livedata : response,
        size : size
    };

}

function setChange(lastPrice,OpenPrice){
    let changed_amount = convertIntoNumber(lastPrice)-convertIntoNumber(OpenPrice);
    let change_price = convertIntoMoneyFormat(changed_amount);
    let change_percentage = ((changed_amount/convertIntoNumber(OpenPrice))*100).toFixed(2)+'%';

    return {
        change_price,change_percentage
    }
}

function readMarketStatus(data){
    let exchange_code = parseInt(buf2hex(data.slice(1,2),16));
    let market_type_length = parseInt(buf2hex(data.slice(2,4),16))/100;
    let market_type = buf2hex(data.slice(4,4+market_type_length),16);
    let status_length = parseInt(buf2hex(data.slice(4+market_type_length,6+market_type_length),16));
    let status = buf2hex(data.slice(6+market_type_length,6+market_type_length+status_length),16);
    let timestamp = getTimeStamp(parseInt(buf2hex(data.slice(6+market_type_length+status_length,10+market_type_length+status_length),16)));

    console.log(exchange_code,market_type_length,market_type,status_length,status,timestamp);

}

function convertIntoFormat(data,a,b,type,multiplier)
{
    if(type === 'p')
    {
        return (parseInt(buf2hex(data.slice(a,b)),16)/multiplier);
    }
    else if(type === 't')
    {
        return getTimeStamp(parseInt(buf2hex(data.slice(a,b)),16))
    }
    else
    {
        return (parseInt(buf2hex(data.slice(a,b)),16));
    }
}

function convertIntoNumber(num)
{
    // return parseFloat(num.replace(/,/g,''));
    return num
}

function convertIntoMoneyFormat(num) 
{ 
    return parseFloat(num).toLocaleString('en-IN',{
        minimumFractionDigits: 2,
        currency: 'INR'
    });
}

function getMultiplier(exchange)
{
    switch(exchange)
    {
        case 1:
            return 100;
        case 2:
            return 100
        case 3:
            return 10000000
        case 4:
            return 100
        case 6:
            return 100
        case 7:
            return 100
    }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function getTimeStamp(unix)
{
    var date = new Date(unix * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}

module.exports = {LiveFeed};