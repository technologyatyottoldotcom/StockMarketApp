const moment = require('moment');

export function convertToUNIX(range)
{
    console.log(range);
    let curr = moment();
    switch(range){
        case 'D' : 
            return curr.subtract(1,'months').clone().unix();
        case '1D' : 
            return curr.subtract(1,'months').clone().unix();
        case '5D' :
            return curr.subtract(3,'months').startOf('month').clone().unix();
        case '1M' :
            return curr.subtract(1,'year').startOf('year').clone().unix();
        case '3M' : 
            return curr.subtract(1,'year').startOf('year').clone().unix();
        case '6M' : 
            return curr.subtract(1,'year').startOf('year').clone().unix();
        case 'YTD' : 
            return curr.subtract(1,'year').startOf('year').clone().unix();
        case '1Y' : 
            return curr.subtract(15,'days').clone().unix();
        case '5Y' : 
            return curr.subtract(15,'days').clone().unix();
        case 'MAX' : 
            return curr.clone().unix();
        default : 
            return curr.subtract(1,'year').startOf('year').clone().unix();
    }   
}

