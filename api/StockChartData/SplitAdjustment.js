
function splitFactor(data,prices)
{

    let splitFactors = [];
    prices.forEach((p,i) => {
        if(i!== 0)
        {
            let DR = Math.round(Math.abs((prices[i].close/prices[i-1].close-1))*100,2);
            if(DR >= 40)
            {
                // console.log(prices[i],'R',i,' -----> ',Math.abs((prices[i]/prices[i-1]-1))*100);
                // console.log(parseFloat((prices[i]/prices[i-1]).toFixed(2)));

                splitFactors.push(parseFloat((prices[i].close/prices[i-1].close).toFixed(2)));
            }
            else
            {
                splitFactors.push(1);
            }
        }
        else
        {
            splitFactors.push(1);
        }
    });

    // console.log(splitFactors.length);
    // console.log(prices.length);

    return ModifiedPrice(data,prices,splitFactors);
}

function ModifiedPrice(data,prices,splitFactors)
{

    let modifiedPrices = [];
    if(prices.length === splitFactors.length)
    {
        prices.reverse();
        splitFactors.reverse();
        let SF = 1;
        prices.forEach((p,i)=>{
            // console.log((p*(SF)).toFixed(2));
            modifiedPrices.push({
                'open' : parseFloat((p.open*(SF)).toFixed(2)),
                'high' : parseFloat((p.high*(SF)).toFixed(2)),
                'low' : parseFloat((p.low*(SF)).toFixed(2)),
                'close' : parseFloat((p.close*(SF)).toFixed(2))
            });
            SF = SF*splitFactors[i];
        });
    }
    else
    {
        console.log('Something Wrong...');
    }

    modifiedPrices.reverse();

    data.forEach((d,i)=>{
        d['open'] = modifiedPrices[i].open;
        d['high'] = modifiedPrices[i].high;
        d['low'] = modifiedPrices[i].low;
        d['close'] = modifiedPrices[i].close;
        // console.log(d['open']);
    });

    // console.log(data);

    return data;
}

function SplitAdjustment(data)
{

    let prices = [];
    // console.log(prices.length);
    let pricedata = [];
    console.log('------SPLIT ADJUSTMENTS------')
    // console.log(data.length);
    data.forEach((d)=>{
        pricedata.push({
            'date' : d[0] && d[0],
            'open' : d[1] && d[1],
            'high' : d[2] && d[2],
            'low' : d[3] && d[3],
            'close' : d[4] && d[4],
            'volume' : d[5]&& d[5]
        })
    });

    pricedata.forEach((d)=>{
        if(d.open)
        {
            prices.push(d);
        }
    });

    // console.log(prices);

    return splitFactor(pricedata,prices);
}


module.exports = SplitAdjustment;

