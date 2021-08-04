const calculateCorrelation = require("calculate-correlation");

class TechnicalAnalysis{

    constructor(pricedata,closeprice=[],key)
    {
        if(typeof closeprice==='object'){
            let type = this.isAllElementsIsSameType(closeprice)
            if(type){  
                if(typeof closeprice[0]==='object'&&!Array.isArray(closeprice[0]) && key)
                {
                  this.closePrice=this.keyToArray(closeprice,key)
                }
                else {
                    this.closePrice = closeprice
                }
             }
             this.pricedata = pricedata;
             this.ITERATION = 1000;
             this.DAYS = 5;
             this.COMPARE_DATA_LENGTH = 100;
             this.MIN_DATA_LENGTH = 500;
         }
    }

    init()
    {
        let STTV = this.getShortView();
        let LTTV = this.getLongView();
        let RSIV = this.getRSI();
        let MACDV = this.getMACD();

        let FPV = this.ApplyCorrelation(this.pricedata);

        let OVERV = this.getOverall(STTV.point,LTTV.point,RSIV.point,MACDV.point);

        // console.log(STTV,LTTV,RSIV,MACDV,OVERV);

        return {
            STTV,LTTV,RSIV,MACDV,OVERV,FPV
        }
    }
   
    keyToArray(closePrice,key)
    {
        var res = []
        if(typeof closePrice=='object' && key)
        { 
            closePrice?.forEach((e)=>{
                let k = typeof e ==='object' && !Array.isArray(e) ? e[key] : null; 
                res.push( typeof k==='string' ? Number(k.trim()) : Number(k)) }) 
        }

        return res;
    }

    isAllElementsIsSameType(arr){
    var res = true
        if(typeof arr=='object' && Array.isArray(arr)){
            let t = '' , l = arr.length , i = 0
            for(;i<l;++i){
                let ty = typeof arr[i]
                if(ty){
                    if(!t)t=ty;
                    else{
                    if(t!==ty){
                        res=false
                        break;
                        }
                    }
                }
            } 
        }
        return res
    }

    getLastEntry(data)
    {
        return data.length > 0 ? parseFloat(data[data.length - 1]) : false;
    }

    getShortView()
    {
        let EMA5 = this.getLastEntry(this.EMA(5));
        let EMA10 = this.getLastEntry(this.EMA(10));
        let EMA20 = this.getLastEntry(this.EMA(20));
        // console.log(EMA5,EMA10,EMA20);
        if(EMA5 && EMA10 && EMA20)
        {
            if(EMA5 < EMA10 && EMA10 < EMA20)
            {
                return {
                    'point' : -2,
                    'text1' : '<',
                    'text2' : '<',
                };
            }
            else if(EMA5 < EMA10 && EMA10 > EMA20)
            {
                return {
                    'point' : -1,
                    'text1' : '<',
                    'text2' : '>',
                };
            }
            else if(EMA5 > EMA10 && EMA10 < EMA20)
            {
                return {
                    'point' : 1,
                    'text1' : '>',
                    'text2' : '<',
                };
            }
            else if(EMA5 > EMA10 && EMA10 > EMA20)
            {
                return {
                    'point' : 2,
                    'text1' : '>',
                    'text2' : '>',
                };
            }
            else
            {
                return {
                    'point' : 0,
                };
            }
            
        }
        else
        {
            return {
                'point' : 0,
            };
        }
    }

    getLongView()
    {
        let EMA20 = this.getLastEntry(this.EMA(20));
        let EMA50 = this.getLastEntry(this.EMA(50));
        let EMA100 = this.getLastEntry(this.EMA(100));
        // console.log(EMA20,EMA50,EMA100);
        if(EMA20 && EMA50 && EMA100)
        {
            if(EMA20 < EMA50 && EMA50 < EMA100)
            {
                return {
                    'point' : -2,
                    'text1' : '<',
                    'text2' : '<',
                };
            }
            else if(EMA20 < EMA50 && EMA50 > EMA100)
            {
                return {
                    'point' : -1,
                    'text1' : '<',
                    'text2' : '>',
                };
            }
            else if(EMA20 > EMA50 && EMA50 < EMA100)
            {
                return {
                    'point' : 1,
                    'text1' : '>',
                    'text2' : '<',
                };
            }
            else if(EMA20 > EMA50 && EMA50 > EMA100)
            {
                return {
                    'point' : 2,
                    'text1' : '>',
                    'text2' : '>',
                };
            }
            else
            {
                return {
                    'point' : 0,
                };
            }
            
        }
        else
        {
            return {
                'point' : 0,
            };
        }
    }

    getRSI()
    {
        let RSI14 = this.getLastEntry(this.RSI(14).rsi);
        // console.log(RSI14);
        if(RSI14)
        {
            if(RSI14 > 90)
            {
                return {
                    'point' : -2,
                };
            }
            else if(RSI14 >= 70 && RSI14 <= 90)
            {
                return {
                    'point' : -1,
                };
            }
            else if(RSI14 > 30 && RSI14 < 70)
            {
                return {
                    'point' : 0,
                };
            }
            else if(RSI14 >= 10 && RSI14 <= 30)
            {
                return {
                    'point' : 1,
                };
            }
            else if(RSI14 < 10)
            {
                return {
                    'point' : 2,
                };
            }
            else
            {
                return {
                    'point' : 0,
                };
            }
        }
        else
        {
            return {
                'point' : 0,
            };
        }
    }

    getMACD()
    {
        let MACDI = this.MACD();
        let MACD12 = this.getLastEntry(MACDI.macd);
        let SIGNAL9 = this.getLastEntry(MACDI.signal);

        // console.log(MACD12,SIGNAL9);

        if(MACD12 && SIGNAL9)
        {
            if(MACD12 < SIGNAL9)
            {
                return {
                    'point' : -2,
                };
            }
            else if(MACD12 > SIGNAL9)
            {
                return {
                    'point' : 2,
                };
            }
            else
            {
                return {
                    'point' : 0,
                };
            }
        }
        else
        {
            return {
                    'point' : 0,
                };
        }
    }

    getOverall(a,b,c,d)
    {
        let total = a+b+c+d;
        if(total <= -8)
        {
            return {
                'point' : -2,
            };
        }
        else if(total > -8 && total <= -4)
        {
            return {
                'point' : -1,
            };
        }
        else if(total > -4 && total < 4)
        {
            return {
                'point' : 0,
            };
        }
        else if(total >=4 && total < 8)
        {
            return {
                'point' : 1,
            };
        }
        else if(total >= 8)
        {
            return {
                'point' : 2,
            };
        }
        else
        {
            return {
                'point' : 0,
            };
        }
    }

    ApplyCorrelation(data)
    {

        if(data.length >= this.MIN_DATA_LENGTH)
        {
            const COMPARE_SERIES = data.slice(-this.COMPARE_DATA_LENGTH);
            // console.log(compare,compare.length);
            // console.log(data[0],data.length)

            let BEST_SERIES;
            let BEST_COR = -1000;
            let START_INDEX;
            let END_INDEX;

            let Max_Range = data.length - this.COMPARE_DATA_LENGTH - this.DAYS - 1;

            let index = 1;

            while(index <= this.ITERATION)
            {
                let START = Math.ceil(Math.random()* Max_Range);
                let END = START + this.COMPARE_DATA_LENGTH;
                let CURR_SERIES = data.slice(START,END);
                let CURR_COR = this.GetSeries(COMPARE_SERIES,CURR_SERIES);
                if(CURR_COR > BEST_COR)
                {
                    BEST_COR = CURR_COR;
                    BEST_SERIES = CURR_SERIES;
                    START_INDEX = START;
                    END_INDEX = END;
                }
                index ++;
            }

            // console.log(BEST_COR,START_INDEX,END_INDEX);

            let FuturePrice = this.GetTrendPrice(data,COMPARE_SERIES,END_INDEX,BEST_COR);

            // console.log(FuturePrice);

            return FuturePrice;
        }

        else
        {
            return {
                'Enough' : false
            }
        }


    }

    GetTrendPrice(data,compare,end,cor)
    {
        let curr = compare[this.COMPARE_DATA_LENGTH - 1];
        let comparelast = data[end];
        let comparefuture = data[end + this.DAYS];

        // console.log(curr,comparelast,comparefuture);
        let future_per = ((comparefuture - comparelast) / comparelast )*100;

        let future_amount = curr + ((curr*future_per)/100);

        // console.log(future_per,future_amount);

        return {

            'Enough' : true,
            'Days' : this.DAYS,
            'Confidence' : cor,
            'FuturePer' : parseFloat(future_per.toFixed(2)),
            'FutureAmount' : parseFloat(future_amount.toFixed(2))
        }


    }

    GetSeries(compare,curr)
    {
        const correlation = calculateCorrelation(compare, curr);
        // console.log(correlation);
        return correlation;
    }

    /**
     * @SMA Simple Moving Average
     * @param {*} day = 5 || 5day || 5days
     * @default 5days
     * @formula :- day1 + day2 + .... + nth day / No. of total days
     * @more info @https://youtu.be/cp6ASr9JrJQ
     * @returns array
     */

    SMA(day=5) 
    {
        day = typeof day=='number' ? day : Number(day?.match(/\d+/)[0])
        var SMA = [] , lnt = this.closePrice.length
        if(typeof this.closePrice=='object' && lnt >= day){  
            const push =  d =>{
                let n = 0
                d.forEach(e=>{
                    let nU = Math.abs(Number(e))
                    nU = nU ? nU : 0
                    n = n+nU
                })
                return n / day
            }

            let l = this.closePrice.length
            for(let i=0;i<l;++i){
                let a= this.closePrice.slice(i,day+i)
                    if(a.length>=day)SMA.push(push(a))
            }         
        }
        return SMA
    }

    /**
     * @EMA Expontional Moving Average
     * @param {*} day 
     * @param {*} prevEma - previous day EMA (:optional)
     * @default : - 10
     * @formula : - {close - EMA (previous day)} * multiplier + EMA (previous day)
     * Multiplier : - (2 / Time periods + 1)
     * @Note :- First observation we don't have a EMA the use "SMA" this is know as EMA for first time
     * @more info @https://youtu.be/ezcwBDsDviE
     * @returns array
     */

    EMA(day=10,prevEma)
    {
        var EMA = []
        day = typeof day=='number' ? day : Number(day?.match(/\d+/)[0])
        if(day)
        {
            prevEma = prevEma ? prevEma : this.SMA(day)[0]
            let multiplier = 2 / ( day + 1 ), data = this.closePrice?.slice(day) ;
            if(prevEma){
                EMA.push(prevEma)
                data?.forEach(e=>{
                e = Number(e)
                if(e!=null && e!=''){
                    let c = Number(((e - prevEma)*multiplier)+prevEma)
                    EMA.push(c)
                    prevEma = c
                }
                })
            }
        }


        return EMA
    }

    /**
     * @RSI Relative Strength Indicator
     * @param {*} day 
     * @default 14
     * @formula RSI = 100 - (100 / 1 + RS)
     *          RS - Relative Strength
     *          RS = Average Gain / Average Loss
     *          Average Gain  = row+1 - row
     *          Average Loss  = row+1 - row
     * @more info @https://youtu.be/HJCwLWTZGJo
     * @default : - 14
     * @return object 
     */

    RSI(day=14)
    {
        day = typeof day=='number' ? day : Number(day?.match(/\d+/)[0])
        var change = [] , gain = [] , loss = [] , AvGain = [] , AvLoss = [] , RS = [] , RSI = [] , lth = this.closePrice.length
        for(let i=1;i<lth;++i){
            let cal = Number(this.closePrice[i]) - Number(this.closePrice[i-1])
            if(cal>0){
                gain.push(cal)
                loss.push(0)
            }else{
                loss.push(Math.abs(cal))
                gain.push(0)
            }
            change.push(cal)
        }
        const calc =  d =>{let n = 0;d.forEach(e=>{let nU = Math.abs(Number(e));nU = nU ? nU : 0;n = n+nU});return n / (d.length)}
        let l = gain.length
        for(let i=0;i<l;++i){
            let a = gain.slice(i,day+i)
            let l = loss.slice(i,day+i)
            if(a.length>=day && l.length>=day){
                let ag = calc(a) , al = calc(l) , rs = ag/al
                AvGain.push(ag)
                AvLoss.push(al)
                RS.push(rs)
                if(al==0)RSI.push(100) ;else RSI.push( 100-( 100 / (1 + rs) ) )
                }
        }
        return{change:change,gain:gain,loss:loss,averageGain:AvGain,averageLoss:AvLoss,rs:RS,rsi:RSI}
    }

    /**
     * @MACD Moving Average Convergence Divergence 
     * @param {*} period1 = EMA period1  Default 12
     * @param {*} period2 = EMA period2  Default 26
     * @param {*} signal  = EMA signal   Default 9
     * @formula  MACD Line : (12-day EMA - 26-day EMA)
     *           Signal Line : 9-day EMA of MACD Line
     *           MACD Histogram : MACD Line - Signal Line
     * @more info @https://youtu.be/R8LcU_VS-1I
     * @returns object
     */

    MACD(period1=12,period2=26,signal=9)
    {
        period1 = typeof period1=='number' ? period1 : Number(period1?.match(/\d+/)[0])
        period2 = typeof period2=='number' ? period2 : Number(period2?.match(/\d+/)[0])
        signal = typeof signal=='number' ? signal : Number(signal?.match(/\d+/)[0])

        var fPeriod = this.EMA(period1) , sPeriod = this.EMA(period2) , MACD = [] , SIGNAL_LINE = [] , HISTOGRAM = []
        let l = Math.abs(fPeriod.length - sPeriod.length);
        sPeriod.forEach((e,i)=>{MACD.push(Number(fPeriod[l+i]) - Number(e))})
        const calc =  d =>{let n = 0;d.forEach(e=>{let nU = Math.abs(Number(e));nU = nU ? nU : 0;n = n+nU});return n / (d.length)}
        let ll = MACD.length , mls = Math.abs(signal-1)
        for(let i=0;i<ll;++i){
            let a = MACD.slice(i,signal+i)
            if(a.length>=signal){
                let s = calc(a)
                SIGNAL_LINE.push(s)
                HISTOGRAM.push( MACD[mls+i] - s )
            }
        }
        return{period1:fPeriod,period2:sPeriod,macd:MACD,signal:SIGNAL_LINE,histogram:HISTOGRAM}
    }

}

exports.TechnicalAnalysis = TechnicalAnalysis;