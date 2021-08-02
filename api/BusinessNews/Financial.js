const { conn } = require('../../server/connection');
const Financial = require('express').Router();


const dbTablesList = {
    reuters : ['fundamental_data_reuters_balancesheet_annual','fundamental_data_reuters_balancesheet_quartely',
    'fundamental_data_reuters_cashflow_annual','fundamental_data_reuters_cashflow_quartely','fundamental_data_reuters_income_annual',
    'fundamental_data_reuters_income_quartely'],
    screener : ['fundamental_data_screener_balancesheet_screener','fundamental_data_screener_cashflows_screener',
    'fundamental_data_screener_profitloss_screener','fundamental_data_screener_quarterly_screener',
    'fundamental_data_screener_shareholding_pattern_screener']
}
 
const GetCodeType = c=>{
    c = String(c)
    var t={ type : '' , col : '' }
    if(c.indexOf('.')== -1){
        if(Number(c)){
            t.col = 'bse_code'
        }else{
            t.col= 'nse_code'
        }
        t.type = 'screener'
    }else{
        t.col = 'ric_code'
        t.type = 'reuters'
    }
    return t
}

const GetStockCode=(code)=>{
    var type = GetCodeType(code).col;
   return new Promise((resolve,reject)=>{
    conn?.query(`SELECT ric_code , bse_code , nse_code FROM stock_list_master_reuters_screener WHERE ${type}='${code}' ORDER BY ${type} LIMIT 1`,(err,res)=>{
        if(err)reject(err);
        else {
            let t = {
                codeType : type
            }
            resolve( Array.isArray(res) ? {...t,...res[0]} : 'object'==typeof res && res ? {...t,...res} : {...t})
        }
     }) 
   })
}

function annualRemoveEmptyColumns({ fields=[] , values=[] }){

    var newValues = [] , deltedFields = []
    
    const CheckIfElementNotExistsInAllSubArr = index=>{
        var response= false ; 
        for(let A of values){
            let res = false

            if("object"==typeof A){
                res = A[index] ? true : false
            }
            
            if(res){
                response = res;
                break;
            }
        }
        return response
    }

    for(let A of values){
        let newArr = []
        if("object"==typeof A){
            let Alength = A.length
            for(let i=0;i<Alength;++i){
                let Ae = A[i]
                if(Ae){newArr.push(Ae)}else{
                    
                    let c = CheckIfElementNotExistsInAllSubArr(i)
                    if(c){
                        newArr.push(Ae)
                    }else{
                        if(deltedFields.indexOf(i)== -1){
                            deltedFields.push(i)
                        }
                    }

                }
            }
        }
        newArr.length ? newValues.push(newArr) : ''
    }

    var Unique = (v, i, s) => s.indexOf(v)===i, f = [...fields];
    deltedFields = deltedFields.filter(Unique)
    for(let k of deltedFields){delete f[k];}
    f = f.filter(e=>e)
   return { fields : f , values : newValues }
}

function quartelyReutersRemoveEmptyColumns({ fields=[] , values=[] }){
    var newValues = [] , dlteFields = []
    if(Array.isArray(values)){
        let l = values.length , i = 0;
        const isValue = (i=1,eI)=>{
            let ll = Math.abs(l - i) , isEle = false
            for(;i<ll;++i){
                let a = values[i][eI]
                if(a){
                    isEle = true
                    break;
                }else isEle = false
            }
            return isEle
       }
        for(;i<l;++i){
            let a = values[i] , lng = a.length , ii = 0, d = [];
                for(;ii<lng;++ii){
                    if(!a[ii]){
                        let isEle = isValue(i,ii)
                        if(!isEle){
                          dlteFields.push(ii)
                        }else d.push(a[ii])
                    }else d.push(a[ii])
                }
                newValues.push(d)
            }
        var Unique = (v, i, s) => s.indexOf(v)===i , f = [...fields];
        dlteFields = dlteFields.filter(Unique)
        for(let k of dlteFields)delete f[k];
        f = f.filter(e=>e)
    }

 return { fields : f , values : newValues }

}
function FilterDbData(data=[],type,from,dField){
    var l = data.length , fields = [] , values = []
    for(let i=0;i<l;++i){
        if(typeof data[i]==='object'){
            let k = Object.keys(data[i]) , kl = k.length
            for(let ki=0;ki<kl;++ki)if(!(fields.find(e=>e===k[ki])))fields.push(k[ki]);
        }
    }
    
    if(from==='reuters'){
        if(type==='annual' ){
            var fil , newFields = []
            fields.forEach((e)=>{
                if(!fil)fil = e?.split('_')[1]
                if(fil === e?.split('_')[1] )newFields.push(e)
            })
            fields = [...newFields];
        }
    }
    
    for(let i=0;i<l;++i){
        if(typeof data[i]==='object'){
            let t = []
            for(let k in data[i]){
              if(fields.find(e=>e===k))t.push(data[i][k])
            }
            values.push(t)
        }
    }

    var responseData = {fields:fields,values:values}


    if( type=="quartely" && from==='reuters'){
       responseData = quartelyReutersRemoveEmptyColumns(responseData)
    }else if((type=="annual" && from==='reuters') || 
        (type=='shareholding_pattern' && from=='screener') || from==='screener'){
          responseData = annualRemoveEmptyColumns(responseData)

          if(from==='screener' && dField=='balancesheet'){
              const addRow = {
                "Total Equity" : ["Share Capital","Reserves"],
                "Total Liabilities" : ["Borrowings","Other Liabilities +"],
              }
              const getSpecificField = (arr,field)=>{
                var response = { index : -1 , val : [] } , field=String(field)?.replace(/[^\w\s]/gi, '').trim().toLocaleLowerCase()
                if('object'==typeof arr){
                    let i = 0
                   for(let A of arr){
                        if('object'==typeof A ){
                            let fA = String(A[1])?.replace(/[^\w\s]/gi, '').trim().toLocaleLowerCase();
                            if(fA==field){
                                response.val = A;
                                response.index = i;
                                break;
                            }
                        }
                        ++i
                   }
                }
                return response
             }

            //  arr = [ [] , [] , [] ,... ]
             const SumOfMultiArr = (arr=[],startIndex=2)=>{
                    const getNumber = n=> Number(String(n)?.replace(/[^0-9.]/g, '').trim()) || 0;
                    var response = []
                    for(let a of arr){
                        if('object'==typeof a){
                            let aL = a.length , isLen = response.length , nA = [], ii=0

                            for(let i=startIndex;i<aL;++i){
                                 let av = getNumber(a[i])
                                 if(isLen){
                                    nA.push( String( getNumber(response[ii]) + av ))
                                 }else{
                                    nA.push(String(av))
                                 }
                                 ++ii
                            }

                            nA.length ? response = nA : ''
                        }
                    }
                   return response
             } , insert = (arr, index, item )=> {
                 arr.splice( index, 0, item );
            };

            
             //  insert addRow data in responseData.values
              for(let key in addRow){
                  let keyArr = addRow[key] , dArr = [] , lstIndex = null

                  for(let val of keyArr){
                        if(val){
                            let dta = getSpecificField(responseData?.values,val)
                            if(dta.index != -1){
                                lstIndex = dta.index;
                                dArr.push(dta.val);
                            }
                        }
                    }
                   
                    let keyA = SumOfMultiArr(dArr) || [];
                     var checkifAlredy = getSpecificField(responseData?.values,key);
                     if(checkifAlredy.index != -1){
                         responseData?.values?.splice(checkifAlredy.index, 1);
                      }
                        insert( keyA , 0 , key )
                        insert( keyA , 0 , Array(responseData?.values[0]) ? responseData?.values[0][0] : '' )
                  
                     if(lstIndex!=null){
                         insert( responseData?.values || [] , lstIndex + 1, keyA )
                     }
                     dArr.length = 0
              }
              
          }

    }

return responseData
}

function GetdbData(type,field,stockCode,from='reuters'){

    const inArray = (arr,key)=>{
        var res = -1
        if(typeof arr==='object'){
            let l = arr.length , i = 0
            for(;i<l;++i){
                if(arr[i]===key){
                    res=i
                    break;
                }
            }

        }
        return res
    }
    
    return new Promise((resolve,reject)=>{
        let ct = from=='reuters' ? type ? true : false : true
        if(ct && field && stockCode && from){
            if(from==="screener" ){
                if(field=='income'){
                    field = 'profitloss'
                }else if(field=='cashflow'){
                    field = 'cashflows'
                }
            }
            let table = from==="reuters" ? ("fundamental_data_reuters_"+field+"_"+type) : from==="screener"? ('fundamental_data_screener_'+field+"_screener".toLowerCase() ): from;

            // console.log(table);
            if(inArray(dbTablesList[from.toLowerCase()],table) != -1){
                conn.query(`SELECT * FROM ${table} WHERE stockCode='${stockCode}'`,(e,r)=>{
                    if(e){
                        reject(e);
                    }
                    else{
                        // console.log(r);
                        resolve(FilterDbData(r,type,from,field));
                    }
                })
            }
            else reject('table not found')
        }else reject('some fields are missing')
    })
   
}

function FilterChartData(values,indices)
{

    let fieldsarray = [];

    values.forEach((val)=>{
        // console.log(val[1]);
        fieldsarray.push(val[1] && val[1].replace(/[^a-zA-Z ]/g, ""));
    });

    // console.log(fieldsarray);


    let result = [];

    let totalmatched = 0;


    indices.forEach((i,indx)=>{

        // console.log(values);

        let checkstr = i.replace(/[^a-zA-Z ]/g, "");


        let fieldindx = fieldsarray.findIndex((f)=> f === checkstr);


        if(fieldindx >= 0 && totalmatched <2 )
        {

            totalmatched +=1;
            // console.log('CHECK ',checkstr);
            let value = values[fieldindx];
            let title = fieldsarray[fieldindx];
            let array = [];

            for(let v=2;v<=value.length-1 ;v++)
            {
                array.push({
                    'title' : title,
                    'value' : value[v]
                });
            }

            

            result.push(array);
        }


    });

    return result;

}

function FilterFields(fields)
{

    let array = [];
    for(let v=2;v<=fields.length-1 ;v++)
    {
        array.push({
            'title' : 'date',
            'value' : fields[v]
        });
    }
    
    return array;

}

// begin::ratio (reuters)
const RatioFunctions = {
    getSpecificField(arr,field){
       var response = [] , field=String(field)?.replace(/[^\w\s]/gi, '').trim().toLocaleLowerCase()
       if('object'==typeof arr){
          for(let A of arr){
               if('object'==typeof A ){
                   let fA = String(A[1])?.replace(/[^\w\s]/gi, '').trim().toLocaleLowerCase();
                   if(fA==field){
                       response = A;
                       break;
                   }
               }
          }
       }
       return response
    },
    Fields(FieldsArr){
       const Fields = [], FieldsLength = FieldsArr.length
       for(let i=2;i<FieldsLength;++i){
           Fields.push( FieldsArr[i] )
       }
       return Fields
    },
    getShareHoldingPattern(stockCode){
       return new Promise((resolve,reject)=>{
            const run = (stockCode,from='screener')=>{
                GetdbData('shareholding_pattern',"shareholding_pattern",stockCode,'screener').then(d=>{
                    typeof d=='string' ? d = JSON.parse(d) : ''
                    const Promoters = RatioFunctions.getSpecificField(d.values,"Promoters");
                    const FIIs = RatioFunctions.getSpecificField(d.values,"FIIs");
                    const DIIs = RatioFunctions.getSpecificField(d.values,"DIIs");
                    const length = FIIs.length || FIIs.length || DIIs.length;
                    const Others = []

                    for(let i=2;i<length;++i){
                        try{
                            let p = this.getNumber(Promoters[i]), fiis = this.getNumber(FIIs[i]) , diis = this.getNumber(DIIs[i])
                        
                            Others.push(
                                String( ( 100 - ( p + fiis + diis )).toFixed(2) )
                            )
                        }catch(e){}       
                    }
                    
                    const response = {
                        fields : ["stockCode", "fieldName",...RatioFunctions.Fields(d.fields)] , 
                        values : (length) ? [ Promoters , FIIs , DIIs , [stockCode,'Others',...Others] ] : [],
                        stockType : 'shareholding',
                        stockCode : stockCode,
                        from : from
                    }
        
                resolve(response)
                }).catch(e=>{
                    reject(e)
                })
            }
            if(GetCodeType(stockCode).type=='screener'){
                run(stockCode)
            }else{
                GetStockCode(stockCode).then(({nse_code , bse_code})=>{
                    run( nse_code || bse_code )
                }).catch(e=>{
                    reject(e)
                })
            }
          
       })

    },
    makeAndSendData(object,stockCode){
       let f = [] , newValues = []
       for(let K in object){
           if(K=='Fields'){
               f = ['stockCode','fieldName',...object[K]]
           }else{
             newValues.push(
                [ stockCode ,  K , ...object[K] ]
             )
           }
       }
      return { fields : f , values : newValues }

    },
    getNumber(n){
       return Number(String(n)?.replace(/[^0-9.]/g, '').trim()) || 0
    },
    crEmptyArray(l){
       var res = []
       for(let i=2;i<l;++i){
           res.push('')
       }
       return res
    },
    reuterBank(income=[],balancesheet=[],stockCode){
       const Length = income.fields.length , emptyArr = this.crEmptyArray(Length)

        const response = {
            Fields : this.Fields(income.fields),
            ROE : [],
            ROA : [],
            ROCE : [],

            Margins : emptyArr,

            'Net Interest Margin' : [],
            'Operating Margin' : [],
            'Net Profit Margin' : [],

            'Financial Strength' : emptyArr,

            'Deposit To Loan Ratio' : []
        }

       const netIncome = this.getSpecificField(income.values,"Net Income");
       
       const totalEquity = this.getSpecificField(balancesheet.values,"Total Equity");
       for(let i=2;i<Length;++i){
           try{
               let ni = this.getNumber(netIncome[i]) , ti = this.getNumber(totalEquity[i]) 
               response.ROE.push(
                   (ti && ni) ?
                       ( ( ni / ti) * 100)?.toFixed(1) + '%'
                    : ''
               )
           }catch(e){}
        }

       const TotalAssets = this.getSpecificField(balancesheet.values,"Total Assets");
       for(let i=2;i<Length;++i){
           try{
               let ni = this.getNumber(netIncome[i]) , ti = this.getNumber(TotalAssets[i]) 
               response.ROA.push(
                   (ni && ti) ?
                    ( ( ni / ti) * 100)?.toFixed(1) + '%'
                   :''
               )
           }catch(e){}
        }
       
       const LongTermDebt = this.getSpecificField(balancesheet.values,"Long Term Debt");
       for(let i=2;i<Length;++i){
           try{
               let ni = this.getNumber(netIncome[i]) , li = this.getNumber(LongTermDebt[i])  , ti = this.getNumber(totalEquity[i])
               response.ROCE.push(
                   (ni && (li || ti)) ?
                       ( ( ni / ( li + ti) ) * 100)?.toFixed(1) + '%'
                   : ''
               )
           }catch(e){}
       }

       const NetInterestIncome = this.getSpecificField(income.values,"Net Interest Income");
       const InterestIncomeBank = this.getSpecificField(income.values,"Interest Income, Bank");
        
       for(let i=2;i<Length;++i){
           try{
               let nIIi = this.getNumber(NetInterestIncome[i])  , nIIBi = this.getNumber(InterestIncomeBank[i]) 
               response['Net Interest Margin'].push(
                   (nIIi && nIIBi) ?
                       ( ( nIIi / nIIBi ) * 100)?.toFixed(1) + '%'
                   :''
               )
           }catch(e){}
       }
       

       const NetIncomeBeforeTaxes = this.getSpecificField(income.values,"Net Income Before Taxes");
       for(let i=2;i<Length;++i){
           try{
               let nIBTi = this.getNumber(NetIncomeBeforeTaxes[i])  , nIIBi = this.getNumber(InterestIncomeBank[i])
               response['Operating Margin'].push(
                   (nIBTi && nIIBi) ?
                       ( ( nIBTi / nIIBi ) * 100)?.toFixed(1) + '%'
                     : ''
               )
           }catch(e){}
       }
       

       for(let i=2;i<Length;++i){
           try{
               let nIi = this.getNumber(netIncome[i]) ,
                iIBI = this.getNumber(InterestIncomeBank[i]);
               response['Net Profit Margin'].push(
                   (nIi && iIBI) ?
                       ( ( nIi / iIBI ) * 100)?.toFixed(1) + '%'
                       : ''
               )
           }catch(e){}
       }


       const TotalDeposits = this.getSpecificField(balancesheet.values,"Total Deposits");
       const NetLoans = this.getSpecificField(balancesheet.values,"Net Loans");

       for(let i=2;i<Length;++i){
           try{
               let tDi = this.getNumber(TotalDeposits[i]) , nLI = this.getNumber(NetLoans[i]);
               response['Deposit To Loan Ratio'].push(
                   (tDi && nLI) ?
                       ( tDi / nLI ) ?.toFixed(2)
                    : ''
               )
           }catch(e){}
       }

      return this.makeAndSendData(response,stockCode)
    },
    reuterInsurance(income=[],balancesheet=[],stockCode){
       const Length =income.fields.length , emptyArr = this.crEmptyArray(Length)

       const response = {
           Fields : this.Fields(income.fields),
           ROE : [],
           ROA : [],
           ROCE : [],

           'Margins' : emptyArr,

           'Claims Margin' : [],
           'Operating Margin' : [],
           'Net Profit Margin' : [],

           'Financial Strength' : emptyArr,

           'Losses to Revenue' : []
       }

       const netIncome = this.getSpecificField(income.values,"Net Income");

       const totalEquity = this.getSpecificField(balancesheet.values,"Total Equity");
       for(let i=2;i<Length;++i){
           try{
               let ni = this.getNumber(netIncome[i]) , ti = this.getNumber(totalEquity[i]) 
               response.ROE.push(
                   (ni && ti) ?
                       ( ( ni / ti) * 100)?.toFixed(1) + '%'
                     : ''
               )
           }catch(e){}
        }

        const TotalAssets = this.getSpecificField(balancesheet.values,"Total Assets");
       for(let i=2;i<Length;++i){
            try{
                let ni = this.getNumber(netIncome[i])  , ti = this.getNumber(TotalAssets[i]) 
                response.ROA.push(
                    (ni && ti) ?
                       ( ( ni / ti) * 100)?.toFixed(1) + '%'
                     : ''
                )
            }catch(e){}
        }

       const OperatingIncome = this.getSpecificField(income.values,"Operating Income");
       const TotalLongTermDebt = this.getSpecificField(balancesheet.values,"Total Long Term Debt");
       for(let i=2;i<Length;++i){
           try{
               let tii = this.getNumber(OperatingIncome[i])  , tei = this.getNumber(totalEquity[i]) , tldi = this.getNumber(TotalLongTermDebt[i]) 
               response.ROCE.push(
                   ( tii && (tei || tldi)) ? 
                       ( ( tii / ( tei + tldi )  ) * 100)?.toFixed(1) + '%'
                     : ''
               )
           }catch(e){}
        }


       const TotalRevenue = this.getSpecificField(income.values,"Total Revenue");
       const LossesBenefitsAndAdjustmentsTotal = this.getSpecificField(income.values,"Losses, Benefits, and Adjustments, Total");

       for(let i=2;i<Length;++i){
           try{
               let tri = this.getNumber(TotalRevenue[i]) , iri = this.getNumber(LossesBenefitsAndAdjustmentsTotal[i])
               response['Claims Margin'].push(
                   ( (tri || iri) && tri ) ?
                       ( (( tri - iri) / tri ) * 100)?.toFixed(1) + '%'
                       : ''
                )
           }catch(e){}
       }

        
       for(let i=2;i<Length;++i){
           try{
               let oii = this.getNumber(OperatingIncome[i]) , tri = this.getNumber(TotalRevenue[i])
               response['Operating Margin'].push(
                   (oii && tri) ?
                       ( ( oii / tri  ) * 100)?.toFixed(1) + '%'
                       : ''
                )
           }catch(e){}
       }


       for(let i=2;i<Length;++i){
           try{
               let nii = this.getNumber(netIncome[i]) , tri = this.getNumber(TotalRevenue[i])
               response['Net Profit Margin'].push(
                   (nii && tri ) ?
                       ( ( nii / tri  ) * 100)?.toFixed(1) + '%'
                       : ''
                )
           }catch(e){}
       }

       for(let i=2;i<Length;++i){
           try{
               let nbaati = this.getNumber(LossesBenefitsAndAdjustmentsTotal[i]) , tri = this.getNumber(TotalRevenue[i]) 
               response['Losses to Revenue'].push(
                   (nbaati && tri) ?
                       ( ( nbaati / tri  ) * 100)?.toFixed(1) + '%'
                       : ''
                )
           }catch(e){}
       }
                
       return this.makeAndSendData(response,stockCode)

    },
    reuterCommonStocks(income=[],balancesheet=[],stockCode){
       const Length =income.fields.length , emptyArr = this.crEmptyArray(Length)

       const response = {
           Fields : this.Fields(income.fields),
           ROE : [],
           ROA : [],
           ROCE : [],
            
           'Asset Turnover' : [],
           'Inventory Turnover' : [],
           'Recievables Turnover' : [],

           Margins : emptyArr,

           'Gross Margin' : [],
           'Operating Margin' : [],
           'Net Profit Margin' : [],

           'Financial Strength' : emptyArr,

           'Current Ratio' : [],
           'Debt to Equity' : [],
           'Net Interest Coverage' : [],

         
       }
       
       const netIncome = this.getSpecificField(income.values,"Net Income");

       const totalEquity = this.getSpecificField(balancesheet.values,"Total Equity");
       for(let i=2;i<Length;++i){
           try{
               let ni = this.getNumber(netIncome[i])  , ti = this.getNumber(totalEquity[i]) 
               response.ROE.push(
                   ( ni && ti) ? 
                       ( ( ni / ti) * 100)?.toFixed(1) + '%'
                       : ''
               )
           }catch(e){}
        }


        const TotalAssets = this.getSpecificField(balancesheet.values,"Total Assets");
        for(let i=2;i<Length;++i){
            try{
                let ni = this.getNumber(netIncome[i])  , ti = this.getNumber(TotalAssets[i]) 
                response.ROA.push(
                    (ni && ti) ?
                       ( ( ni / ti) * 100)?.toFixed(1) + '%'
                       : ''
                )
            }catch(e){}
         }


        const TotalCurrentLiabilities = this.getSpecificField(balancesheet.values,"Total Current Liabilities"); //not found in HDFC.NS
        for(let i=2;i<Length;++i){
             try{
                 let nii = this.getNumber(netIncome[i]) , 
                 tai = this.getNumber(TotalAssets[i]) ,
                  tcli = this.getNumber(TotalCurrentLiabilities[i]) 
                 response.ROCE.push(
                     (nii && (tai || tcli)) ?
                       ( ( nii / ( tai - tcli )  ) * 100)?.toFixed(1) + '%'
                           : ''
                 )
             }catch(e){}
         }
 

        const Revenue = this.getSpecificField(income.values,"Revenue"); //b2          
        for(let i=2;i<Length;++i){
           try{
               let rii = this.getNumber(Revenue[i]) , tai = this.getNumber(TotalAssets[i])
               response['Asset Turnover'].push(
                   (rii && tai ) ? 
                       String ( (rii / tai)?.toFixed(2) ) 
                       : ''
               )
           }catch(e){}
        }


       const CostofRevenueTotal = this.getSpecificField(income.values,"Cost of Revenue, Total");       
       const TotalInventory = this.getSpecificField(balancesheet.values,"Total Inventory"); // not found in HDFC.NS
       for(let i=2;i<Length;++i){
           try{
               let corti = this.getNumber(CostofRevenueTotal[i]) , tii = this.getNumber(TotalInventory[i])
               response['Inventory Turnover'].push(
                   (corti && tii ) ? 
                       String ( (corti / tii)?.toFixed(2) ) 
                       : ''
               )
           }catch(e){}
        }

       
       const TotalReceivablesNet = this.getSpecificField(balancesheet.values,"Total Receivables, Net");
       for(let i=2;i<Length;++i){
           try{
               let rii = this.getNumber(Revenue[i]), trni = this.getNumber(TotalReceivablesNet[i])
               response['Recievables Turnover'].push(
                   (rii && trni ) ? 
                     String ( (rii / trni)?.toFixed(2) ) 
                     : ''
               )
           }catch(e){}
        }
      

       const GrossProfit = this.getSpecificField(income.values,"Gross Profit");
       for(let i=2;i<Length;++i){
           try{
               let rii = this.getNumber(Revenue[i]) , gpi = this.getNumber(GrossProfit[i])
               response['Gross Margin'].push(
                   (gpi && rii ) ? 
                        ( (gpi / rii) * 100 ).toFixed(1) + '%'
                       : ''
               )
           }catch(e){}
        }



       const OperatingIncome = this.getSpecificField(income.values,"Operating Income");
       for(let i=2;i<Length;++i){
           try{
               let rii = this.getNumber(Revenue[i]) , oii = this.getNumber(OperatingIncome[i])
               response['Operating Margin'].push(
                   (rii && oii ) ? 
                      ( (oii / rii) * 100 ).toFixed(1) + '%'
                     : ''
               )
           }catch(e){}
        }



       for(let i=2;i<Length;++i){
           try{
              let rii = this.getNumber(Revenue[i]) , nii = this.getNumber(netIncome[i])
               response['Net Profit Margin'].push(
                    (rii && nii ) ? 
                      ( (nii / rii) * 100 ).toFixed(1) + '%'
                        : ''
                    )
           }catch(e){}
       }



       // Current Ratio (empty )
       const TotalCurrentAssets = this.getSpecificField(balancesheet.values,"Total Current Assets"); //not found in HDFC.NS       
       for(let i=2;i<Length;++i){
           try{
              let tcai = this.getNumber(TotalCurrentAssets[i]) , tcli = this.getNumber(TotalCurrentLiabilities[i])
               response['Current Ratio'].push(
                    (tcai && tcli ) ? 
                       String(( tcai / tcli)?.toFixed(1))
                        : ''
                    )
           }catch(e){}
       }
       


       const TotalDebt = this.getSpecificField(balancesheet.values,"Total Debt");//b22
       for(let i=2;i<Length;++i){
           try{
              let tdi = this.getNumber(TotalDebt[i]), tei = this.getNumber(totalEquity[i])
               response['Debt to Equity'].push(
                    (tdi && tei ) ? 
                         ( (tdi / tei) * 100 )?.toFixed(1) + '%'
                        : ''
                    )
           }catch(e){}
       }



       // Net Interest Coverage
       const InterestIncExpTotal = this.getSpecificField(income.values,"Interest Inc.(Exp.),Net-Non-Op., Total");//b12
       for(let i=2;i<Length;++i){
           try{
              let oii = this.getNumber(OperatingIncome[i]) , iieti = this.getNumber(InterestIncExpTotal[i])
               response['Net Interest Coverage'].push(
                    (oii && iieti ) ? 
                       String(( oii / iieti)?.toFixed(1))
                        : ''
                    )
           }catch(e){}
        }

        return this.makeAndSendData(response,stockCode)
    },
    screenerBank(profitloss,balancesheet,stockCode){
       const Length = profitloss.fields.length 
      
       const response = {
           Fields : this.Fields(profitloss.fields),
           ROE : [],
           ROA : [],
           ROCE : [],
           
           Margins : this.crEmptyArray(Length),

           'Financing Margin' : [],
           'Net Profit Margin' : []
         }


       const NetProfit = this.getSpecificField(profitloss.values,"Net Profit"); //b11
       const Revenue = this.getSpecificField(profitloss.values,"Revenue"); //b2


       const TotalEquity = this.getSpecificField(balancesheet.values,"Total Equity"); //bl-b4

// doubt
       for(let i=2;i<Length;++i){
           try{
               let npi = this.getNumber(NetProfit[i]) , ti = this.getNumber(TotalEquity[i]) 
               response.ROE.push(
                   (npi && ti) ?
                       ( ( npi / ti) * 100)?.toFixed(1) + '%'
                      : ''
               )
           }catch(e){}
        }

        
        const TotalAssets = this.getSpecificField(balancesheet.values,"Total Assets"); //bl-b12
        for(let i=2;i<Length;++i){
           try{
               let npi = this.getNumber(NetProfit[i]) , tai = this.getNumber(TotalAssets[i]) 
               response.ROA.push(
                   (npi && tai) ?
                      ( ( npi / tai) * 100)?.toFixed(1) + '%'
                      : ''
               )
           }catch(e){}
        }



        const Borrowings = this.getSpecificField(balancesheet.values,"Borrowings"); //bl-b5
        for(let i=2;i<Length;++i){
           try{
               let npi = this.getNumber(NetProfit[i]) , tei = this.getNumber(TotalEquity[i]) , bi = this.getNumber(Borrowings[i]) 
               response.ROCE.push(
                   (npi && ( tei || bi ) ) ?
                      ( ( npi / ( tei + bi) ) * 100)?.toFixed(1) + '%'
                      : ''
               )
           }catch(e){}
        }


        const FinancingMargin = this.getSpecificField(profitloss.values,"Financing Margin %"); //b11
        for(let i=2;i<Length;++i){
           try{
               let fmi = this.getNumber(FinancingMargin[i])
               response['Financing Margin'].push(
                   (fmi) ?
                       fmi.toFixed(1) + "%"
                     : ''
               )
           }catch(e){}
        }
       

        for(let i=2;i<Length;++i){
           try{
               let npi = this.getNumber(NetProfit[i]) , ri = this.getNumber(Revenue[i]) 
               response['Net Profit Margin'].push(
                   (npi && ri) ?
                       ( ( npi / ri) * 100)?.toFixed(1) + '%'
                      : ''
               )
           }catch(e){}
        }

       return this.makeAndSendData(response,stockCode)
    },
    screenerCommonStocks(profitloss,balancesheet,stockCode){
       const Length = profitloss.fields.length , emptyArr = this.crEmptyArray(Length)

       const response = {
           Fields : this.Fields(profitloss.fields),
           ROE : [],
           ROA : [],
           ROCE : [],
           'Asset Turnover' : [],
           'Inventory Turnover' : [],
           'Recievables Turnover' : [],

            Margins : emptyArr,
           
           'Operating Margin' : [],
           'Net Profit Margin': [],

           'Financial Strength' : emptyArr,

           'Current Ratio' : [],
           'Debt to Equity' : [],
           'Net Interest Coverage' : []
          
         }


        const NetProfit = this.getSpecificField(profitloss.values,"Net Profit"); //b11
        const TotalEquity = this.getSpecificField(balancesheet.values,"Total Equity"); //bl-b4 (not found in HDFCLIFE)

        for(let i=2;i<Length;++i){
           try{
               let npi = this.getNumber(NetProfit[i]) , tei = this.getNumber(TotalEquity[i]) 
               response.ROE.push(
                   (npi && tei) ?
                       ( ( npi / tei) * 100)?.toFixed(1) + '%'
                      : ''
               )
           }catch(e){}
        }



        const TotalAssets = this.getSpecificField(balancesheet.values, "Total Assets"); //bl-b15
        for (let i = 2; i < Length; ++i) {
            try {
                let npi = this.getNumber(NetProfit[i]), tai = this.getNumber(TotalAssets[i])
                response.ROA.push(
                    (npi && tai) ?
                        ((npi / tai) * 100)?.toFixed(1) + '%'
                        : ''
                )
            } catch (e) { }
        }

        
        const OtherLiabilities = this.getSpecificField(balancesheet.values, "Other Liabilities"); //bl-b15
        for (let i = 2; i < Length; ++i) {
           try {
               let npi = this.getNumber(NetProfit[i]), tai = this.getNumber(TotalAssets[i]) , oli = this.getNumber(OtherLiabilities[i])
               response.ROCE.push(
                   (npi && (tai || oli)) ?
                       ((npi / (tai - oli)) * 100)?.toFixed(1) + '%'
                       : ''
               )
           } catch (e) { }
        }


        const Sales = this.getSpecificField(profitloss.values,"Sales"); //b2
        for (let i = 2; i < Length; ++i) {
           try {
               let si = this.getNumber(Sales[i]), tai = this.getNumber(TotalAssets[i])
               response['Asset Turnover'].push(
                   (si && tai) ?
                       (si / tai).toFixed(2)
                       : ''
               )
           } catch (e) { }
        }


        const Expenses = this.getSpecificField(profitloss.values,"Expenses"); //b3
        const Inventories =this.getSpecificField(balancesheet.values, "Inventories"); //bl-b11 
        for (let i = 2; i < Length; ++i) {
           try {
               let ei = this.getNumber(Expenses[i]), ii = this.getNumber(Inventories[i])
               response['Inventory Turnover'].push(
                   (ei && ii) ?
                       (ei / ii).toFixed(2)
                       : ''
               )
           } catch (e) { }
        }

        
        const TradeReceivables =this.getSpecificField(balancesheet.values, "Trade Receivables"); //bl-b12
        for (let i = 2; i < Length; ++i) {
           try {
               let si = this.getNumber(Sales[i]), tri = this.getNumber(TradeReceivables[i])
               response['Recievables Turnover'].push(
                   (si && tri) ?
                       (si / tri).toFixed(2)
                       : ''
               )
           } catch (e) { }
        }


        const OPM = this.getSpecificField(profitloss.values,"OPM %"); //b5
        for (let i = 2; i < Length; ++i) {
           try {
               let opmi = this.getNumber(OPM[i])
               response['Operating Margin'].push(
                   (opmi) ?
                       (opmi).toFixed(1) + '%'
                       : ''
               )
           } catch (e) { }
        }


        for (let i = 2; i < Length; ++i) {
           try {
               let npi = this.getNumber(NetProfit[i]) , si = this.getNumber(Sales[i])
               response['Net Profit Margin'].push(
                   (npi && si ) ?
                        ((npi / si ) * 100)?.toFixed(1) + '%'
                       : ''
               )
           } catch (e) { }
        }


        const Borrowings = this.getSpecificField(balancesheet.values,"Borrowings"); 
        const OtherAssets = this.getSpecificField(balancesheet.values,"Other Assets"); 
        const CWIP = this.getSpecificField(balancesheet.values,"CWIP"); 
        
        
        for (let i = 2; i < Length; ++i) {
           try {
               let oai = this.getNumber(OtherAssets[i]) , cwipi = this.getNumber(CWIP[i]) ,
                 oli = this.getNumber(OtherLiabilities[i])

               response['Current Ratio'].push(
                   ( (oai || cwipi) && oli ) ?
                        ( (oai + cwipi) / oli )?.toFixed(2)
                       : ''
               )
           } catch (e) { }
        }


        for (let i = 2; i < Length; ++i) {
           try {
               let bwi = this.getNumber(Borrowings[i]) , tei = this.getNumber(TotalEquity[i])
               response['Debt to Equity'].push(
                   (bwi && tei ) ?
                        ( bwi / tei ) ?.toFixed(2)
                       : ''
               )
           } catch (e) { }
        }


       //  Net Interest Coverage
        const OperatingProfit = this.getSpecificField(profitloss.values,"Operating Profit"); //b4
        const Interest = this.getSpecificField(profitloss.values,"Interest"); //b7
        for (let i = 2; i < Length; ++i) {
           try {
               let opi = this.getNumber(OperatingProfit[i]) , Ii = this.getNumber(Interest[i])
               response['Net Interest Coverage'].push(
                   (opi && Ii ) ?
                        ( opi / Ii ) ?.toFixed(2)
                       : ''
               )
           } catch (e) { }
        }

       return this.makeAndSendData(response,stockCode)

    }

}

const companyType = {
    Reuters: {
        banks: ['Interest Income, Bank', 'Net Interest Income'],
        insurance: ['Total Premiums Earned']
    },
    Screener: {
        banks: ['Financing Profit', 'Financing Margin']
    }
}

const GetStockType = (arr, find) => {
    var response = ''
    if ('object' == typeof arr) {
        for (let A of arr) {
            let Afield = String(A[1])?.trim(); //field name inside sub array
            for (let k in find) {
                let kA = find[k]
                if ('object' == typeof kA) {
                    for (let kAe of kA) {
                        kAe = String(kAe).trim()
                        if (kAe == Afield) {
                            if (!response) {
                                response = k
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return response;
}

// reuters = HDFL.NS = insurance  , bank = HDBK.NS , common = HDFC.NS
// screener = HDFCBANK = bank , common = HDFCLIFE
// insurance = ROC
const Ratio=(stockCode,type='reuters')=>{ //bank
    return new Promise((resolve,reject)=>{
        if (type == 'reuters') {
            GetdbData("annual", "income", stockCode).then(income => {
                typeof income=='string'? income = JSON.parse(income): ''
                let getStockType = GetStockType(income.values, companyType.Reuters)
                GetdbData("annual", "balancesheet", stockCode).then(balancesheet => {
                    typeof balancesheet=='string' ? balancesheet = JSON.parse(balancesheet) : '';
                    if (getStockType == "banks") {
                        let data = RatioFunctions.reuterBank(income, balancesheet, stockCode) || {}
                        data['stockType'] = getStockType || "common"
                        data['from'] = "reuters"
                        resolve(data)
                    } else if (getStockType == "insurance") {
                        let data = RatioFunctions.reuterInsurance(income, balancesheet, stockCode) || {}
                        data['stockType'] = getStockType
                        data['from'] = "reuters"
                        resolve(data)
                    } else {
                        let data = RatioFunctions.reuterCommonStocks(income, balancesheet, stockCode) || {}
                        data['stockType'] = getStockType || "common"
                        data['from'] = "reuters"
                        resolve(data)
                    }
                }).catch(e => {
                   reject(`reuters balancesheet error = ${e}`)
                })
            }).catch(e => {
                reject(`reuters income error = ${e}`)
            })
        } else if (type == 'screener') {
 
            GetdbData("", "profitloss", stockCode, "screener").then(profitloss => {
                typeof profitloss=='string' ? profitloss = JSON.parse(profitloss) : ''
                let getStockType = GetStockType(profitloss.values, companyType.Screener)
 
                GetdbData("", "balancesheet", stockCode, "screener").then(balancesheet => {
                    typeof balancesheet=='string' ? balancesheet = JSON.parse(balancesheet) : ''
                    if (getStockType == 'banks') {
                        let data = RatioFunctions.screenerBank(profitloss, balancesheet, stockCode) || {}
                        data['stockType'] = getStockType
                        data['from'] = "screener"
                        resolve(data)
                    } else {
                        let data = RatioFunctions.screenerCommonStocks(profitloss, balancesheet, stockCode) || {}
                        data['stockType'] = getStockType || "common"
                        data['from'] = "screener"
                        resolve(data)
                    }
 
                }).catch(e => {
                    reject(`ratio screener balancesheet error = ${e}`)
                })
            }).catch(e => {
                reject(`ratio screener profitloss error = ${e}`)
            })
        } else {
            reject("table type not found ")
        }
    })
}
  
 


// Ratio("HDBK.NS").then(d=>{

//       console.log("d = ",d)

// }).catch(e=>{
//     console.log("err = ",e)
// })
 
 //  shareholding
//  RatioFunctions.getShareHoldingPattern("HDFL.NS")
//  .then(d=>{
//      console.log("shareholdeing = ",d)
//  }).catch(e=>{
//      console.log("getShareHoldingPattern = ",e)
//  })
 // end::shareholding
 // end::ratio
 


 

// temp open
//{ type: 'annual', field: 'balancesheet', stockcode: 'RELI.NS' }
// action: "detailed"
// field: "profit&loss"
// stockcode: "RELI.NS"
// type: "annual"
// temp close


// HDFCBANK = bank
// let field = "balancesheet"//"quarterly"//"cashflows"//"balancesheet" //profitloss
//  { type: 'annual', field: 'balancesheet', stockcode: 'ASIANPAINT' }
// GetdbData("",field,"ASIANPAINT",'screener').then(d=>{
//     typeof d=='string' ? d = JSON.parse(d) : ''
//     // console.log("data = ",d.values)

//  }).catch(e=>{
//      console.log("er = ",e)
//  })

// let a = "20MICRONS" , f = GetCodeType(a).type
// GetdbData("annual","balancesheet",a,f).then(d=>{
//         if(typeof d=='string'){
//             d = JSON.parse(d)
//         }
//         d.from = f
    
//     console.log(d)
// }).catch(e=>{
//     console.log("er = ",e)
// })

// GetStockCode("3IINFOTECH").then(d=>{
//     console.log('res = ',d)
// })

// let co = "3IINFOTECH"
// Ratio(co,GetCodeType(co).type).then(d=>{
//     console.log('res = ',d)
// }).catch(e=>{
//     console.log("err = ",e)
// })


// only quarterly data will work
Financial.get('/createtable/:type/:field/:stockcode', (req, res) => {

    // console.log(req.params);
    let p = req.params , fT = String(p.field).toLowerCase() , fromType = GetCodeType(p.stockcode).type
    if(p.type==="quarterly"){
        p.type = "quartely"
    }
    
    if(fT=='ratios'){
        Ratio(p.stockcode,fromType).then(d=>{
            // console.log(d);
            res.send(d)
        }).catch(e=>{
            console.log('err__ = ',e)
        })
    }else if(fT=='shareholding'){
        RatioFunctions.getShareHoldingPattern(p.stockcode) //screener stockcode
        .then(d=>{
            // console.log("shareholdeing = ",d.Fields)
            // console.log(d);
            res.send(d)
        }).catch(e=>{
            console.log("getShareHoldingPattern = ",e)
        })
    }else{
        GetdbData(p.type,p.field,p.stockcode,fromType).then(d=>{
            if(typeof d=='string'){d = JSON.parse(d)}
            if(!d){d = {}};

            if(d?.fields?.length > 2 ){  
                d.from = fromType
                d.type = GetStockType(d?.values || [] , fromType=="screener" ? companyType.Screener : companyType.Reuters) || 'common'
                res.send(d)     //response sended
            }else {
                console.log('run = ',2)
                GetStockCode(p.stockcode).then(({ ric_code , bse_code , nse_code})=>{
                        const senD = (sCode,from)=>{
                            
                            if(from=='screener'){
                                p.type = ""
                                if(p.field=="income"){
                                    p.field = "profitloss"
                                }else  if(p.field=="cashflow"){
                                    p.field = "cashflows"
                                }
                            }
                            
                            GetdbData(p.type,p.field,sCode,from).then(d=>{
                              if(typeof d=='string'){d = JSON.parse(d)}
                              if(!d){d = {}};
                                d.from = from
                                d.type = GetStockType(d?.values || [] , from=='screener' ? companyType.Screener : companyType.Reuters) || 'common'
                                res.send(d)
                            }).catch(e=>{
                                console.log('error  = ',e)
                                res.send(e)
                            })
                        }

                    if(fromType=='reuters'){
                          senD(nse_code || bse_code ,"screener")  // screener
                    }else {// reuters
                        senD( ric_code,"reuters") 
                    }

                }).catch(e=>{
                    res.send(e)
                })
            }
        }).catch(e=>{
            console.log("er = ",e)
            res.send(e)
        })
    }
    
    // console.log("req_data = ",p)
    
});


Financial.get('/createcharts/:field/:type/:stockcode',(req,res)=>{

    let type = req.params.type;
    let field = req.params.field;
    let stockcode = req.params.stockcode;
    let fromtype = GetCodeType(stockcode).type;

    if(field === 'ratios')
    {
        // console.log('IN RATIO');
        Ratio(stockcode,fromtype).then(d=>{

            let fields = FilterFields(d.fields);
            let values = FilterChartData(d.values,['ROE','ROCE']);
            res.json({
                'fields' : fields,
                'values' : values
            })
        }).catch(e=>{
            console.log(e);
            res.json({
                'status' : 'failure',
                'message' : e.message
            });
        });
    }

    else if(field === 'margin')
    {
        Ratio(stockcode,fromtype).then(d=>{

            let fields = FilterFields(d.fields);
            let values = FilterChartData(d.values,['Operating Margin','Net Profit Margin']);
            res.json({
                'data' : d,
                'fields' : fields,
                'values' : values
            })
        }).catch(e=>{
            console.log(e);
            res.json({
                'status' : 'failure',
                'message' : e.message
            });
        });
    }

    else if(field === 'shareholdings')
    {

        // console.log('IN SHAREHOLDING');

        RatioFunctions.getShareHoldingPattern(stockcode) //screener stockcode
        .then(d=>{

            let fields = FilterFields(d.fields);
            let values = FilterChartData(d.values,['Promoters']);
            res.json({
                'fields' : fields,
                'values' : values
            })
        }).catch(e=>{
            console.log(e);
            res.json({
                'status' : 'failure',
                'message' : e.message
            });
        })
    }

    else if(field === 'income')
    {

        // console.log('IN INCOME');

        // console.log(fromtype);

        GetdbData(type,'income',stockcode,fromtype).then(d=>{

            let fields = FilterFields(d.fields);
            let values = FilterChartData(d.values,['Net Income','Revenue','Sales','Interest','Total Revenue','Interest Income Bank']);
            res.json({
                'fields' : fields,
                'values' : values
            });
        }
        ).catch(e => {
            console.log(e);
            res.json({
                'status' : 'failure',
                'message' : e.message
            });
        });
    }

});


Financial.get('/creditrating/:stockcode',(req,res)=>{
    let stockcode = req.params.stockcode;

    // console.log(stockcode);

    conn.query(`SELECT screener_ratings_title1 AS TITLE1,screener_ratings_link1 AS LINK1,screener_ratings_date1 AS DATE1,
    screener_ratings_title2 AS TITLE2,screener_ratings_link2 AS LINK2,screener_ratings_date2 AS DATE2,
    screener_ratings_title3 AS TITLE3,screener_ratings_link3 AS LINK3,screener_ratings_date3 AS DATE3 FROM stock_list_master_reuters_screener
    WHERE ric_code="${stockcode}"`,(err,result)=>{
        if(!err)
        {
            if(result.length > 0)
            {
                let row;

                result.forEach((r)=>{
                    row = r;
                });

                // console.log(row);

                let credit = [];

                for(let i=1;i<=3;i++)
                {
                    if(row['TITLE'+i] !== '')
                    {
                        credit.push({
                            'title' : row['TITLE'+i],
                            'link' : row['LINK'+i],
                            'date' : row['DATE'+i],
                        })
                    }
                }

                res.json({
                    'status' : 'success',
                    'credit' : credit
                });
            }
        }
        else
        {
            res.json({
                'status' : 'failure',
                'error' : err.message
            })
        }
    })
})



// module.exports={
//     RatioFunctions,
//     Ratio,
//     dbTablesList,
//     GetCodeType , 
//     GetStockCode,
//     GetdbData, 
//     FilterDbData , 
//     FilterChartData,
//     FilterFields,
//     quartelyReutersRemoveEmptyColumns ,
//     annualRemoveEmptyColumns,
//     companyType,
//     GetStockType
// }

exports.Financial = Financial;