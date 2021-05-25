import {MarketDataStructure} from './MessageStructure';

export const readMarketData = (data,prevClose)=>
{

    let multiplier = getMultiplier(1)
    let response = {}

    //add data fetched from api
    MarketDataStructure.forEach(m =>{
        response[m.field] = convertIntoFormat(data,m.start,m.end,m.type,multiplier);
    });

    //add custom data made from fetched data

    //get changed price
    let PC = prevClose == -1 ? response['close_price'] : prevClose;
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

    // console.log(changed_amount,response['change_price'],response['change_percentage'])


    return response;

}

export const readMarketStatus = (data)=>{
    let exchange_code = parseInt(buf2hex(data.slice(0,1),16));
    let market_type_length = parseInt(buf2hex(data.slice(1,3),16))/100;
    let market_type = buf2hex(data.slice(3,3+market_type_length),16);
    let status_length = parseInt(buf2hex(data.slice(3+market_type_length,5+market_type_length),16));
    let status = buf2hex(data.slice(5+market_type_length,5+market_type_length+status_length),16);
    let timestamp = parseInt(buf2hex(data.slice(5+market_type_length+status_length,9+market_type_length+status_length),16));

    console.log(exchange_code,market_type_length,market_type,status_length,status,timestamp);

}

function convertIntoFormat(data,a,b,type,multiplier)
{
    if(type === 'p')
    {
        return (parseInt(buf2hex(data.slice(a,b)),16)/multiplier).toLocaleString('en-IN',{
            minimumFractionDigits: 2,
            currency: 'INR'
        });
    }
    else if(type === 't')
    {
        return getTimeStamp(parseInt(buf2hex(data.slice(a,b)),16))
    }
    else
    {
        return (parseInt(buf2hex(data.slice(a,b)),16)).toLocaleString('en-IN',{
            currency: 'INR'
        });
    }
}

function convertIntoNumber(num)
{
    return parseFloat(num.replace(/,/g,''));
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


