const { conn } = require('../../server/connection');
const { SendResponse } = require("./SendResponse")



class SnapShots {
    data = null
    NOW = new Date()
    MarketCapData = null
    DebtToEquity_Equity = null
    ROE_TTM_reuter_quartely_netIncome = null
    ROE_3YR_reuters_annual_netIncome = null
    DebtToEquity_shareCapital_reserve = null
    DebtToEquity_reuter_quartely_totalAssets = null
    DebtToEquity_reuter_quartely_totalCurrentLblities = null
    Screener_pl_netProfit = null
    regex = /\d+_(.*)_\d+/
    ScreenerBalanceSheetAnnual = null

    constructor(data) {
        this.data = data
        this.ScreenerBalanceSheetAnnual = data[17]
    }

    // you can pass multiple json objects ( it will return common fields in all objects )
    GetCommonFields(...arg){
        const DescendingOrder = (d={})=>{
            let key = [] , dtAndKey = {}, newAsc = { }
             for(let k in d || {}){
                    try{
                        let dt = new Date(k.replace("_")).getTime()
                        key.push(dt);
                        dtAndKey[dt] = k
                    }catch(e){}
                }
        
             let a = key.sort((a, b) => b - a);
             for(let e of a){
                let k = dtAndKey[e]
                newAsc[k] = d[k] 
            }
            return newAsc
          }
        try {
            const arr = []
            for(let v of arg){
                if( v && typeof v==='object' && !Array.isArray(v)){
                  arr.push(DescendingOrder(v))
                }
            }
        
            const newArr = []
            function hasProperty(key){
                let l = arr.length , res = false
                for(let i=0;i<l;++i){
                    let a = arr[i]
                   if( a && 'object'===typeof a && !Array.isArray(a) && key){
                      if(a.hasOwnProperty(key)){
                         res = true;
                      }else {
                          res = false
                          break;
                        }
                    }
                }
                return res
            }
           
           for(let i in arr){
                let k = arr[i], nP = {  }
                if( k && 'object'===typeof k && !Array.isArray(k)){ 
                    for( let ik in k){
                      if(hasProperty(ik)){
                         nP[ik] = k[ik]
                      }
                    }
                }
                newArr.push(nP)
                
            }
            return newArr
        } catch (e) {
            return `error : - ${e}`
        }
    
     }
    // inside data in json objects ( data = [ { } , { } , ....] )
    GetNoOfFieldsInObjects(data=[ ] , noOfFields = 3 , func){
        const newData = [] , len = data.length
        for(let i=0;i<len;++i){
            let v = data[i]
            if( v && typeof v==='object' && !Array.isArray(v)){
                let d = { }
                for(let k in v){
                    if(Object.keys(d).length!=noOfFields){
                        if('function'===typeof func){
                            d[k] = func(v[k])
                        }else d[k] = v[k]
                    }
                }
                newData.push(d)
            }
        }
        return newData
    } 
    GetSpecificFieldObject(data = [], fieldName = '') {
        let res = null
        for (let k of data || []) {
            if (k && !Array.isArray(k) && typeof k === 'object') {
                if (k.fieldName.trim().replace(/[^a-zA-Z0-9]/g, '') === fieldName.trim().replace(/[^a-zA-Z0-9]/g, '')) {
                    res = k;
                    break;
                }
            }
        }
        return res
    }
    GETAverageData(data1, data2) {
        const Arrange = (data) => {
            let Asc = this.GetLatestFour(data).asc, AscArr = Object.keys(Asc), lng = AscArr.length;
            return {
                "Asc": Asc,
                'val': [
                    Asc[AscArr[lng - 1]], //"LNIncome"
                    Asc[AscArr[lng - 2]], //"LNIncome_M_1 ( T - 1) "
                    Asc[AscArr[lng - 3]] // "LNIncome_M_2 ( T - 1 ) "
                ]
            }
        }

        let rdata1 = Arrange(data1), rdata2 = Arrange(data2), lengt = rdata1.val.length,
            divide = [], sumOfDivide = 0, divideLength = null

        for (let i = 0; i < lengt; ++i) {
            if (Number(rdata1.val[i]) && Number(rdata2.val[i])) {
                let dv = rdata1.val[i] / rdata2.val[i]
                sumOfDivide += dv
                divide.push(dv)
                divideLength = i + 1
            }
        }
        return {
            divide: divide,
            sumOfDivide: sumOfDivide,
            divideLength: divideLength,
            data1: rdata1,
            data2: rdata2
        }


    }
    ConvertNumber(n) {
        return Number(String(n).replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2"))
    }
    Filter(data, regex) {
        var res = {}
        if (Array.isArray(data)) data = data[0]
        for (let v in data) {
            if (data[v]) {
                if (regex) {
                    if (v.match(regex)) res[v] = data[v];
                } else res[v] = data[v]
            }
        }
        return res
    }
    LatestYearValue(data = {}) {
        let LatestYearValue = {
            yearToTimeStamp: null,
            year: null,
            value: null
        }
        for (let k in data) {
            try {
                let dt = new Date(k.replace('_', ' ')).getTime()
                if (LatestYearValue.yearToTimeStamp < dt) {
                    LatestYearValue.yearToTimeStamp = dt
                    LatestYearValue.year = k
                    LatestYearValue.value = this.ConvertNumber(data[k])
                }
            } catch (e) { }
        }
        return LatestYearValue
    }
    GetLatestFour(data) {
        var tempYears = {}, arr = []
        for (let k in data) {
            let s = new Date(k.replace('_', '')).getTime()
            arr.push(s)
            tempYears[s] = k
        }
        arr = arr.sort()
        var arr_last_four = arr.slice(-4);
        if (arr.length <= 4) {
            arr_last_four.shift();
        }

        var asc = {}, sum = 0
        for (let v of arr_last_four) {
            let n = this.ConvertNumber(data[tempYears[String(v)]])
            asc[tempYears[String(v)]] = n;
            sum += n
        }

        return {
            'data': sum ? (this.MarketCapData.CurrentPrice.currentPrice / sum) : null,
            "asc": asc,
            "sumOfAsc": sum
        }
    }


    MarketCap(data = this.data) {
        try {
            var res = null
            if (data) {
                var CurrentPrice = null, YEAR = null, TABLE = null
                if (data[1] && data[1][0]) {
                    CurrentPrice = data[1][0].CLOSE
                    YEAR = this.NOW.getFullYear()
                    TABLE = 'nse_bhav_' + YEAR
                } else if (data[2] && data[2][0]) {
                    CurrentPrice = data[2][0].CLOSE
                    YEAR = this.NOW.getFullYear() - 1
                    TABLE = 'bse_bhav_' + YEAR
                } else if (data[3] && data[3][0]) {
                    CurrentPrice = data[3][0].CLOSE
                    YEAR = this.NOW.getFullYear()
                    TABLE = 'nse_bhav_' + (YEAR - 1)
                } else if (data[4] && data[4][0]) {
                    CurrentPrice = data[4][0].CLOSE
                    YEAR = this.NOW.getFullYear() - 1
                    TABLE = 'bse_bhav_' + (YEAR - 1)
                }

                let r = this.Filter(data[0], this.regex),
                    LatestYearValue = this.LatestYearValue(r)

                res = {
                    'Market_Cap': CurrentPrice ? ((LatestYearValue.value * CurrentPrice) / 10) : null,
                    "CurrentPrice": { 'currentPrice': Number(CurrentPrice), 'year': YEAR, 'table': TABLE, 'col_name': 'CLOSE' },
                    "Shares_Outstanding": LatestYearValue
                }
                this.MarketCapData = res
            }
            if (!this.data) this.data = data
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    PriceToEarnings() {
        try {
            let DilutedEPSExcluding = this.GetLatestFour(this.Filter(this.data[5], this.regex)),
                EPSInRs = this.GetLatestFour(this.Filter(this.data[6], /(.*)_\d+/)),
                res = {
                    "reuters": {
                        "Price_To_Earnings": DilutedEPSExcluding.data,
                        "Recent_4_Diluted_EPS": DilutedEPSExcluding.asc,
                        'type': 'Diluted EPS Excluding ExtraOrd Items'
                    },
                    "screener": {
                        "Price_To_Earnings": EPSInRs.data,
                        "Recent_4_EPS_in_Rs": EPSInRs.asc,
                        'type': 'EPS in Rs'
                    }
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    PriceToBook() {
        try {
            let totalEquity = this.Filter(this.data[7], this.regex),
                LatestYearValue = this.LatestYearValue(totalEquity),
                res = {
                    "Price_To_Book": (this.MarketCapData.Shares_Outstanding.value != '' && LatestYearValue.value != '') ? (this.MarketCapData.CurrentPrice.currentPrice / (LatestYearValue.value / this.MarketCapData.Shares_Outstanding.value)) : null,
                    "Total_Equity_latest": LatestYearValue,
                    "Shares_Outstanding": this.MarketCapData.Shares_Outstanding
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    DividendYield() {
        try {
            let DPS = this.LatestYearValue(this.Filter(this.data[8], this.regex)),
                res = {
                    "Dividend_Yield": DPS.value != '' && this.MarketCapData.CurrentPrice.currentPrice ? (DPS.value / this.MarketCapData.CurrentPrice.currentPrice) * 100 : null,
                    "DPS": DPS,
                    "currentPrice": this.MarketCapData.CurrentPrice
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    FaceValue() {
        try {
            let CashfromOA = this.LatestYearValue(this.Filter(this.data[9], this.regex)),
                res = {
                    "Face_Value": CashfromOA.value != '' && this.MarketCapData.Shares_Outstanding.value != '' ? (CashfromOA.value / this.MarketCapData.Shares_Outstanding.value) : null,
                    "LatestYearValue": CashfromOA,
                    "Shares_Outstanding": this.MarketCapData.Shares_Outstanding
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    EPS() {
        try {
            let Rprices = this.GetLatestFour(this.Filter(this.data[5], this.regex)),
                Sprices = this.GetLatestFour(this.Filter(this.data[6], /(.*)_\d+/));

            let res = {
                "reuters": {
                    "EPS": Rprices.sumOfAsc,
                    "Recent_4_Diluted_EPS": Rprices.asc
                },
                "screener": {
                    "EPS": Sprices.sumOfAsc,
                    "Recent_4_EPS_in_Rs": Sprices.asc
                }
            }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    DebtToEquity() {
        try {
            let EquityDebts = this.data[10] || {},
                debt = null, equity = null
            for (let v of EquityDebts) {
                if (v && !Array.isArray(v) && typeof v === 'object') {
                    if (v.fieldName === 'Total Equity') equity = v;
                    else if (v.fieldName === 'Total Debt') debt = v;
                    else if (v.fieldName === 'Total Assets') this.DebtToEquity_reuter_quartely_totalAssets = v;
                    else if (v.fieldName === 'Total Current Liabilities') this.DebtToEquity_reuter_quartely_totalCurrentLblities = v;
                }
            }

            debt = this.LatestYearValue(this.Filter(debt, this.regex))
            equity = this.LatestYearValue(this.Filter(equity, this.regex))
            this.DebtToEquity_Equity = equity

            let Screener = this.data[11] || {}, shareCapital = null, reserve = null, borrowings = null
            for (let v of Screener) {
                if (v && !Array.isArray(v) && typeof v === 'object') {
                    let r = v.fieldName.trim().replace(/[^a-zA-Z0-9]/g, '')
                    if (r === 'ShareCapital') shareCapital = v;
                    else if (r === 'Reserves') reserve = v;
                    else if (r === 'Borrowings') borrowings = v;
                }
            }
            shareCapital = this.LatestYearValue(this.Filter(shareCapital, /(.*)_\d+/))
            reserve = this.LatestYearValue(this.Filter(reserve, /(.*)_\d+/))
            borrowings = this.LatestYearValue(this.Filter(borrowings, /(.*)_\d+/))

            this.DebtToEquity_shareCapital_reserve = {
                'shareCapital': shareCapital,
                'reserve': reserve,
                'sumOfBoth': shareCapital.value + reserve.value
            }

            let res = {
                "reuters": {
                    "Debt_To_Equity": debt.value != '' && equity.value != '' ? (debt.value / equity.value) * 100 : null,
                    "latest_debt": debt,
                    "latest_equity": equity
                },
                "screener": {
                    "Debt_To_Equity": (borrowings.value && shareCapital.value && reserve.value) ? borrowings.value / (this.DebtToEquity_shareCapital_reserve.sumOfBoth) * 100 : null,
                    "shareCapital": shareCapital,
                    "reserve": reserve,
                    "borrowings": borrowings
                }
            }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    PromoterHolding() {
        try {
            let promoter = this.LatestYearValue(this.Filter(this.data[12], /(.*)_\d+/)) || {},
                res = {
                    'Promoter_Holding': promoter.value != '' ? promoter.value : null,
                    "promoter": promoter
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    ROE_TTM() {
        try {
            let filterR = this.Filter(this.data[13], this.regex),
                RnetIncome = this.GetLatestFour(filterR || {}), Rsum = RnetIncome.sumOfAsc;
            this.ROE_TTM_reuter_quartely_netIncome = filterR;

            let filter = this.Filter(this.data[14], /(.*)_\d+/),
                screener_netProfit = this.GetLatestFour(filter || {}), 
                sSum = screener_netProfit.sumOfAsc;

              let res = {
                    "reuters": {
                        "ROE_TTM": Rsum != null && this.DebtToEquity_Equity.value != '' ? (Rsum / this.DebtToEquity_Equity.value) * 100 : null,
                        "recent_4_netIncome": RnetIncome.asc,
                        "total_equity": this.DebtToEquity_Equity
                    },
                    "screener": {
                        "ROE_TTM": (this.DebtToEquity_shareCapital_reserve.sumOfBoth != '' && sSum != '') ? (sSum / this.DebtToEquity_shareCapital_reserve.sumOfBoth) * 100 : null,
                        "recent_4_netProfit": screener_netProfit.asc,
                        "shareCapital_reserve": this.DebtToEquity_shareCapital_reserve
                    }
                }
                // console.log("res = ",res)

            this.Screener_pl_netProfit = filter
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    ROE_3YR() {
        try {
            let netIncome = this.Filter(this.data[15], this.regex), totalEquity = this.Filter(this.data[16], this.regex)

            this.ROE_3YR_reuters_annual_netIncome = netIncome

            const Arrange = data => {
                let Asc = this.GetLatestFour(data).asc, AscArr = Object.keys(Asc), lng = AscArr.length;
                return {
                    "Asc": Asc,
                    'val': [
                        Asc[AscArr[lng - 1]], //"LNIncome"
                        Asc[AscArr[lng - 2]], //"LNIncome_M_1 ( T - 1) "
                        Asc[AscArr[lng - 3]] // "LNIncome_M_2 ( T - 1 ) "
                    ]
                }
            }

            let nIncome = Arrange(netIncome), tEquity = Arrange(totalEquity), lengt = nIncome.val.length,
                divide = [], sumOfDivide = 0, divideLength = null

            for (let i = 0; i < lengt; ++i) {
                if (Number(nIncome.val[i]) && Number(tEquity.val[i])) {
                    let dv = nIncome.val[i] / tEquity.val[i]
                    sumOfDivide += dv
                    divide.push(dv)
                    divideLength = i + 1
                }
            }

            let RAverage = sumOfDivide && divideLength ? (sumOfDivide / divideLength) * 100 : null;


            // screener
            let SnetProfit = Arrange(this.Screener_pl_netProfit), Sleng = SnetProfit.val.length,
                shareCapital = Arrange(this.Filter(this.GetSpecificFieldObject(this.ScreenerBalanceSheetAnnual, 'Share Capital +') || {}, /(.*)_\d+/) || {}),
                reserve = Arrange(this.Filter(this.GetSpecificFieldObject(this.ScreenerBalanceSheetAnnual, 'Reserves') || {}, /(.*)_\d+/) || {});

            let Sdivide = [], SsumOfDivide = 0, SdivideLength = null
            for (let i = 0; i < Sleng; ++i) {
                if (Number(SnetProfit.val[i])) {
                    let n = (shareCapital.val[i] + reserve.val[i]),
                        dv = SnetProfit.val[i] / ((n != 0 && n != Infinity) ? n : 1)
                    SsumOfDivide += dv
                    Sdivide.push(dv)
                    SdivideLength = i + 1
                }
            }

            let SAverage = SsumOfDivide && SdivideLength ? (SsumOfDivide / SdivideLength) * 100 : null,

                res = {
                    "reuters": {
                        "ROE_3YR": RAverage,
                        "sumOfDivide": sumOfDivide,
                        "average": divide,
                        "latest_netIncome": nIncome.Asc,
                        "latest_totalEquity": tEquity.Asc,
                    },
                    "screener": {
                        "ROE_3YR": SAverage,
                        "sumOfDivide": SsumOfDivide,
                        "average": Sdivide,
                        "netProfit": SnetProfit,
                        "shareCapital": shareCapital,
                        "reserve": reserve
                    },
                    "NOTE": "if ( latest_netIncome or latest_totalEquity ) will showing greater then 3 elements then don't worry it's calculated only latest 3 elements (years)"
                }

            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    ROA_TTM() {
        try {
            let netIncome = this.GetLatestFour(this.ROE_TTM_reuter_quartely_netIncome),
                totalAssets = this.LatestYearValue(this.Filter(this.DebtToEquity_reuter_quartely_totalAssets || {}, this.regex));

            // screener
            let netProfit = this.GetLatestFour(this.Filter(this.data[23], /(.*)_\d+/)),
                StotalAssets = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.ScreenerBalanceSheetAnnual, 'Total Assets') || {}, /(.*)_\d+/) || {}),
                 res = {
                    "reuters": {
                        "ROA_TTM": (netIncome.sumOfAsc && totalAssets.value) ? (netIncome.sumOfAsc / totalAssets.value) * 100 : null,
                        "netIncome": netIncome,
                        "LatestTotalAssets": totalAssets
                    },
                    "screener": {
                        "ROA_TTM": (netProfit.sumOfAsc != '' && StotalAssets.value != '') ? (netProfit.sumOfAsc / StotalAssets.value) * 100 : null,
                        "LatestNetProfit": netProfit,
                        "LatestTotalAssets": StotalAssets
                    }
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    ROA_3YR() {
        try {
            let netIncome = this.ROE_3YR_reuters_annual_netIncome,
                totalAssets = this.Filter(this.data[18] || {}, this.regex),
                g = this.GETAverageData(netIncome, totalAssets);

            // screener
            let netProfit = this.Filter(this.Screener_pl_netProfit || {}, /(.*)_\d+/),
                StotalAssets = this.Filter(this.GetSpecificFieldObject(this.ScreenerBalanceSheetAnnual, 'Total Assets') || {}, /(.*)_\d+/),
                Sg = this.GETAverageData(netProfit, StotalAssets)


            let res = {
                "reuters": {
                    "ROA_3YR": (g.sumOfDivide != '' && g.divideLength != '') ? (g.sumOfDivide / g.divideLength) * 100 : null,
                    "divide": g.divide,
                    "sumOfDivide": g.sumOfDivide,
                    "netIncome": g.data1,
                    "totalAssets": g.data2
                },
                "screener": {
                    "ROA_3YR": (Sg.sumOfDivide != '' && Sg.divideLength != '') ? (Sg.sumOfDivide / Sg.divideLength) * 100 : null,
                    "divide": Sg.divide,
                    "sumOfDivide": Sg.sumOfDivide,
                    "netProfit": Sg.data1,
                    "totalAssets": Sg.data2
                }
            }

            return res
        } catch (e) {
            return {
                error: e
            }
        }

    }

    ROCE_TTM() {
        try {
            let OperatingIncome = this.GetLatestFour(this.Filter(this.data[19] || {}, this.regex)),
                totalAssets = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.data[10], 'Total Assets') || {}, this.regex)),
                TotalCurrentLbility = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.data[10], 'Total Current Liabilities') || {}, this.regex));

            // screener
            let SOperatingProfit = this.GetLatestFour(this.Filter(this.data[24], /(.*)_\d+/)), // fundamental_data_screener_quarterly_screener
                StotalAssets = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.data[17], 'Total Assets'), /(.*)_\d+/)),
                OtherLiabilities = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.data[17], 'Other Liabilities'), /(.*)_\d+/))

            let res = {
                "reuters": {
                    "ROCE_TTM": (OperatingIncome.sumOfAsc != '' && (totalAssets.value != '' && TotalCurrentLbility.value != '')) ? (OperatingIncome.sumOfAsc / (totalAssets.value - TotalCurrentLbility.value)) * 100 : null,
                    "OperatingIncome": OperatingIncome,
                    "LatestTotalAssets": totalAssets,
                    "LatestTotalCurrentLbility": TotalCurrentLbility
                },
                "screener": {
                    "ROCE_TTM": (SOperatingProfit.sumOfAsc != '') ? (SOperatingProfit.sumOfAsc / (StotalAssets.value - OtherLiabilities.value)) * 100 : null,
                    "OperatingProfit": SOperatingProfit,
                    "LatestTotalAssets": StotalAssets,
                    "LatestOtherLiabilities": OtherLiabilities
                }
            }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }

    ROCE_3YR() {
        try {
            const Arrange = data => {
                let Asc = this.GetLatestFour(data).asc, AscArr = Object.keys(Asc), lng = AscArr.length;
                return {
                    "Asc": Asc,
                    'val': [
                        Asc[AscArr[lng - 1]], //"LNIncome"
                        Asc[AscArr[lng - 2]], //"LNIncome_M_1 ( T - 1) "
                        Asc[AscArr[lng - 3]] // "LNIncome_M_2 ( T - 1 ) "
                    ]
                }
            }

            let netIncome = Arrange(this.ROE_3YR_reuters_annual_netIncome),
                totalAssets = Arrange(this.Filter(this.data[18] || {}, this.regex)),
                totalCurrentLbility = Arrange(this.Filter(this.data[21] || {}, this.regex)), leng = netIncome.val.length,
                divide = [], sumOfDivide = 0, divideLength = null

            for (let i = 0; i < leng; ++i) {
                if (Number(netIncome.val[i])) {
                    let m = totalAssets.val[i] - totalCurrentLbility.val[i],
                        dv = netIncome.val[i] / (m ? m : 1)
                    sumOfDivide += dv
                    divide.push(dv)
                    divideLength = i + 1
                }
            }

            let Average = (sumOfDivide != 0 && sumOfDivide != '' && divideLength) ? (sumOfDivide / divideLength) * 100 : null


            // screener
            const createValue = (arr={})=>{
                var res = {
                    val : []
                }
                for(let k in arr){
                    res[k] = arr[k]
                    res.val.push(arr[k])
                }
                return res
            }
            
            var commonFields = this.GetNoOfFieldsInObjects(this.GetCommonFields(this.Filter(this.Screener_pl_netProfit || {}, /(.*)_\d+/),this.Filter(this.GetSpecificFieldObject(this.ScreenerBalanceSheetAnnual, 'Total Assets') || {}, /(.*)_\d+/),this.Filter(this.GetSpecificFieldObject(this.data[17], 'Other Liabilities'), /(.*)_\d+/)),3,this.ConvertNumber)
            let netProfit = createValue(commonFields[0]),
                StotalAssets = createValue(commonFields[1]),
                OtherLiabilities = createValue(commonFields[2]),
                Sdivide = [], SsumOfDivide = 0, SdivideLength = null
                
            for (let i = 0; i < leng; ++i) {
                if (Number(netProfit.val[i])) {
                    let m = StotalAssets.val[i] - OtherLiabilities.val[i],
                        dv = netProfit.val[i] / (m ? m : 1)
                    SsumOfDivide += dv
                    Sdivide.push(dv)
                    SdivideLength = i + 1
                }
            }

            let SAverage = (SsumOfDivide != 0 && SsumOfDivide != '' && SdivideLength) ? (SsumOfDivide / SdivideLength) * 100 : null

            let res = {
                "reuters": {
                    "ROCE_3YR": Average,
                    "divide": divide,
                    "netIncome": netIncome,
                    "totalAssets": totalAssets,
                    "totalCurrentLbility": totalCurrentLbility,
                },
                "screener": {
                    "ROCE_3YR": SAverage,
                    "divide": Sdivide,
                    "netProfit": netProfit,
                    "totalAssets": StotalAssets,
                    "OtherLiabilities": OtherLiabilities,
                }
            }

            // console.log("res = ",res)

            return res
        } catch (e) {
            return {
                error: e
            }
        }

    }

    CurrentRatio() {
        try {
            let TotalCurrentAssets = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.data[22],"Total Current Assets"), this.regex)),
                TotalCurrentLiabilities = this.LatestYearValue(this.Filter(this.GetSpecificFieldObject(this.data[22],"Total Current Liabilities"), this.regex)),
                res = {
                    "Current_Ratio": (TotalCurrentAssets.value != '' && TotalCurrentLiabilities.value != '') ? (TotalCurrentAssets.value / TotalCurrentLiabilities.value) : null,
                    "LatestCurrentAssets": TotalCurrentAssets,
                    "LatestCurrentLiabilities": TotalCurrentLiabilities
                }
            return res
        } catch (e) {
            return {
                error: e
            }
        }
    }
}

const MYSQL = (data,func) => {
      const reutersCode = data.reutersCode, nseCode = data.nseCode, bseCode = data.bseCode ,
      currentYear = new Date().getFullYear();
    //   console.log(reutersCode)
      
    // don't change any query position 
    conn.query(`
        SELECT * FROM fundamental_data_reuters_balancesheet_quartely WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Total Common Shares Outstanding%') LIMIT 1;
        SELECT CLOSE FROM nse_bhav_${currentYear} WHERE SYMBOL='${nseCode}' ORDER BY TIMESTAMP DESC LIMIT 1;
        SELECT CLOSE FROM bse_bhav_${currentYear} WHERE SC_CODE='${bseCode}' ORDER BY TRADING_DATE DESC LIMIT 1;
        SELECT CLOSE FROM nse_bhav_${currentYear - 1} WHERE SYMBOL='${nseCode}' ORDER BY TIMESTAMP DESC LIMIT 1;
        SELECT CLOSE FROM bse_bhav_${currentYear - 1} WHERE SC_CODE='${bseCode}' ORDER BY TRADING_DATE DESC LIMIT 1;

        SELECT * FROM fundamental_data_reuters_income_quartely WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Diluted EPS Excluding ExtraOrd Items%') LIMIT 1;
        SELECT * FROM fundamental_data_screener_quarterly_screener WHERE stockCode='${nseCode}' AND fieldName LIKE TRIM('EPS in Rs%') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_balancesheet_annual WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Total Equity%') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_income_annual WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('DPS - Common Stock Primary Issue%') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_cashflow_annual WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Cash from Operating Activities%') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_balancesheet_quartely WHERE stockCode='${reutersCode}' AND fieldName REGEXP 'Total Equity|Total Debt|Total Assets|Total Current Liabilities' LIMIT 4;
        SELECT * FROM fundamental_data_screener_balancesheet_screener WHERE stockCode='${nseCode}' AND fieldName REGEXP 'Borrowings|Share Capital +|Reserves' LIMIT 3;
        
        SELECT * FROM screener_shareholding_pattern WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Promoters +%') LIMIT 1;
     
        SELECT * FROM fundamental_data_reuters_income_quartely WHERE stockCode='${reutersCode}' AND fieldName = TRIM('Net Income') LIMIT 1;
        SELECT * FROM fundamental_data_screener_profitloss_screener WHERE stockCode='${nseCode}' AND fieldName = TRIM('Net Profit') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_income_annual WHERE stockCode='${reutersCode}' AND fieldName = TRIM('Net Income') LIMIT 1;
        SELECT * FROM fundamental_data_reuters_balancesheet_annual WHERE stockCode='${reutersCode}' AND fieldName = TRIM('Total Equity') LIMIT 1;
        SELECT * FROM fundamental_data_screener_balancesheet_screener WHERE stockCode='${nseCode}' AND fieldName REGEXP 'Share Capital +|Reserves|Total Assets|Other Liabilities +' LIMIT 4;
        
        SELECT * FROM fundamental_data_reuters_balancesheet_annual WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Total Assets%') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_income_quartely WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Operating Income%') LIMIT 1;
        SELECT * FROM fundamental_data_screener_profitloss_screener WHERE stockCode='${nseCode}' AND fieldName = TRIM('Operating Profit') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_balancesheet_annual WHERE stockCode='${reutersCode}' AND fieldName LIKE TRIM('Total Current Liabilities%') LIMIT 1;

        SELECT * FROM fundamental_data_reuters_balancesheet_quartely WHERE stockCode='${reutersCode}' AND fieldName REGEXP 'Total Current Assets|Total Current Liabilities' LIMIT 2; 

        SELECT * FROM fundamental_data_screener_quarterly_screener WHERE stockCode='${nseCode}' AND fieldName LIKE TRIM('Net Profit%') LIMIT 1;
        
        SELECT * FROM fundamental_data_screener_quarterly_screener WHERE stockCode='${nseCode}' AND fieldName LIKE TRIM('Operating Profit%') LIMIT 1;

        `, typeof func === 'function' && func)
    // fundamental_data_screener_balancesheet_screener ( review the stockCode ( nseCode || reutersCode)) when searching //this will give an error 
}

const StockSnapShot = (stock)=>{
    return new Promise((resolve,reject)=>{
        MYSQL({
            'reutersCode' : stock.reutersCode,
            'nseCode' : stock.nseCode,
            'bseCode' : stock.bseCode
        },
        (e, r) => {
    
            if(!e)
            {                
    
                var snp = new SnapShots(r);
    
                resolve({
                    'MarketCap' : FormatValue(snp.MarketCap(),'Market_Cap','s'),
                    'PriceToEarnings' : FormatValue(snp.PriceToEarnings(),'Price_To_Earnings','rs'),
                    'PriceToBook' : FormatValue(snp.PriceToBook(),'Price_To_Book','s'),
                    'DividendYield' : FormatValue(snp.DividendYield(),'Dividend_Yield','s'),
                    'FaceValue' : FormatValue(snp.FaceValue(),'Face_Value','s'),
                    'EPS' : FormatValue(snp.EPS(),'EPS','rs'),
                    'DebtToEquity' : FormatValue(snp.DebtToEquity(),'Debt_To_Equity','rs'),
                    'PromoterHolding' : FormatValue(snp.PromoterHolding(),'Promoter_Holding','s'),
                    'ROE_TTM' : FormatValue(snp.ROE_TTM(),'ROE_TTM','rs'),
                    'ROE_3YR' : FormatValue(snp.ROE_3YR(),'ROE_3YR','rs'),
                    'ROA_TTM' : FormatValue(snp.ROA_TTM(),'ROA_TTM','rs'),
                    'ROA_3YR' : FormatValue(snp.ROA_3YR(),'ROA_3YR','rs'),
                    'ROCE_TTM' : FormatValue(snp.ROCE_TTM(),'ROCE_TTM','rs'),
                    'ROCE_3YR' : FormatValue(snp.ROCE_3YR(),'ROCE_3YR','rs'),
                    'CurrentRatio' : FormatValue(snp.CurrentRatio(),'Current_Ratio','s')
    
                })
            }
            else
            {
                reject(SendResponse(106))
            }
     
    
        })
    })
}

const FormatValue = (snap,key,type)=>{

    const keys = ['Dividend_Yield','Debt_To_Equity','Promoter_Holding','ROE_TTM','ROE_3YR','ROA_TTM','ROA_3YR','ROCE_TTM','ROCE_3YR']
    let value = type === 'rs' ? 
        (snap.reuters[key] ? 
        parseFloat(snap.reuters[key]).toFixed(2) : (snap.screener[key] ? 
        parseFloat(snap.screener[key]).toFixed(2) : '-' ))
        : (snap[key] ? parseFloat(snap[key]).toFixed(2) : '-')

    if(keys.includes(key))
    {
        return value === '-' ? value : value+' %';
    }
    else if(key === 'Market_Cap')
    {
        return value === '-' ? value : value+' Cr.';
    }
    else
    {
        return value;
    }
}

// conn.connect((err)=>{
//     if(!err)
//     {
//         console.log('connected');
//         StockSnapShot({
//             'reutersCode' : 'RELI.NS',
//             'nseCode' : 'RELIANCE',
//             'bseCode' : '500325'
//         })
//         .then((data)=>{
//             console.log(data);
//             return data;
//         })
//         .catch((error)=>{
//             return error
//         })
//     }
//     else
//     {
//         // console.log('Not connected ',err);
//         return SendResponse(106)        
//     }
// });


exports.StockSnapShot = StockSnapShot;