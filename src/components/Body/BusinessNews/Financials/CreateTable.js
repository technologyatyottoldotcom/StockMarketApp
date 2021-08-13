import React from 'react';
import Axios from 'axios';
import Pulse from '../../../Loader/Pulse';
import { OverlayTrigger , Tooltip  } from "react-bootstrap";

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

function NumberWithCommas(num,fixed) {
    try {
        if(num.includes('%'))
        {
            return num;
        }
        num = Number(num.replace(',',''));
        // console.log('BEFORE ',num,fixed);
        if(num)
        {

            let fixednum =  num.toLocaleString('en-IN',{
                maximumFractionDigits: fixed,
                minimumFractionDigits: fixed,
                currency: 'INR'
            });
            // console.log('AFTER ',fixednum);

            return fixednum;
        }
        else
        {
            return num;
        }
    } catch (e) { }
    return ""
}

const FiltersDatacashflow = [
    { title : "Net Income/Starting Line" , bold : false},  
    { title : "Depreciation/Depletion" , bold : false},  
    { title : "Non-Cash Items" , bold : false},  
    { title : "Cash Taxes Paid" , bold : false},  
    { title : "Cash Interest Paid" , bold : false},  
    { title : "Changes in Working Capital" , bold : false}, 
    { title : "Cash from Operating Activities" , bold : true},  
    { title : "Capital Expenditures" , bold : false},  
    { title : "Other Investing Cash Flow Items, Total" , bold : false},  
    { title : "Cash from Investing Activities" , bold : true}, 
    { title : "Financing Cash Flow Items" , bold : false},  
    { title : "Total Cash Dividends Paid" , bold : false},  
    { title : "Issuance (Retirement) of Stock, Net" , bold : false},  
    { title : "Issuance (Retirement) of Debt, Net" , bold : false},  
    { title : "Cash from Financing Activities" , bold : true}, 
    { title : "Net Change in Cash" , bold : true} 
]

const screenerFilters = {
    balancesheetCommon : ["Share Capital","Reserves","Total Equity","Borrowings","Other Liabilities","Total Liabilities","Fixed Assets",
    "CWIP","Investments",
    ],
    profitlossCommon : [
        "Sales","Expenses","Operating Profit","OPM %","Other Income","Interest","Depreciation","Profit before tax",
        "Tax %","Net Profit","EPS in Rs"
    ]
}

const FiltersDataTypes = {

    R_balancesheet_annual_detailed: [
        "Cash & Equivalents", "Cash and Short Term Investments", "Accounts Receivable - Trade, Net",
        "Total Receivables, Net", "Total Inventory","Total Current Assets" ,"Property/Plant/Equipment, Total - Net", "Goodwill, Net",
        "Intangibles, Net", "Long Term Investments", "Note Receivable - Long Term",
        "Other Long Term Assets, Total", "Other Assets, Total", "Total Assets",
        "Accounts Payable", "Notes Payable/Short Term Debt", "Other Current liabilities, Total","Total Current Liabilities",
        "Long Term Debt", "Total Long Term Debt", "Total Debt", "Deferred Income Tax",
        "Minority Interest", "Other Liabilities, Total", "Total Liabilities",
        "Common Stock, Total", "Retained Earnings (Accumulated Deficit)", "Total Equity",
        "Total Liabilities & Shareholders' Equity"
    ],

    R_balancesheet_annual_condensed:  [
        { title : "Cash & Equivalents" , bold : true}, 
        { title : "Cash and Short Term Investments" , bold : true},
        { title : "Total Receivables, Net" , bold : false}, 
        { title : "Goodwill, Net" , bold : false}, 
        { title : "Long Term Investments" , bold : false}, 
        { title : "Total Assets" , bold : true},
        { title : "Accounts Payable" , bold : false}, 
        { title : "Notes Payable/Short Term Debt" , bold : false}, 
        { title : "Other Current liabilities, Total" , bold : false},
        { title : "Total Current Liabilities" , bold : true},
        { title : "Total Long Term Debt" , bold : false}, 
        { title : "Total Debt" , bold : true}, 
        { title : "Total Liabilities" , bold : true}, 
        { title : "Retained Earnings (Accumulated Deficit)" , bold : false},
        { title : "Total Equity" , bold : true}, 
        { title : "Total Liabilities & Shareholders' Equity" , bold : true}
    ],

    R_income_annual_detailed: [
        "Revenue", "Total Revenue", "Cost of Revenue, Total", "Gross Profit", "Selling/General/Admin. Expenses, Total", "Depreciation/Amortization", "Unusual Expense (Income)", "Other Operating Expenses, Total", "Total Operating Expense",
        "Operating Income", "Interest Inc.(Exp.),Net-Non-Op., Total", "Other, Net", "Net Income Before Taxes", "Provision for Income Taxes", "Net Income After Taxes", "Minority Interest", "Net Income Before Extra. Items", "Net Income",
        "Income Available to Com Excl ExtraOrd", "Income Available to Com Incl ExtraOrd", "Diluted Net Income", "Diluted Weighted Average Shares", "Diluted EPS Excluding ExtraOrd Items", "DPS - Common Stock Primary Issue", "Diluted Normalized EPS"
    ],
    
    R_income_annual_condensed: [
        { title : "Revenue" , bold : true}, 
        { title : "Cost of Revenue, Total" , bold : true}, 
        { title : "Gross Profit" , bold : true}, 
        { title : "Selling/General/Admin. Expenses, Total" , bold : false}, 
        { title : "Depreciation/Amortization" , bold : false},
        { title : "Total Operating Expense" , bold : true}, 
        { title : "Operating Income" , bold : true}, 
        { title : "Interest Inc.(Exp.),Net-Non-Op., Total" , bold : false}, 
        { title : "Provision for Income Taxes" , bold : false}, 
        { title : "Net Income" , bold : true}, 
        { title : "Diluted Net Income" , bold : true},
        { title : "Diluted Weighted Average Shares" , bold : true}, 
        { title : "Diluted EPS Excluding ExtraOrd Items" , bold : true , fixed : 2}, 
        { title : "DPS - Common Stock Primary Issue" , bold : true , fixed : 2}, 
        { title : "Diluted Normalized EPS" , bold : true , fixed : 2}
    ],

    R_cashflow_annual_detailed: FiltersDatacashflow,
    R_cashflow_annual_condensed: FiltersDatacashflow,

    S_balancesheet_common : [
        ...screenerFilters.balancesheetCommon,
        "Inventories","Trade Receivables","Cash Equivalents","Loans n Advances","Total Assets",
    ],

    S_balancesheet_bank : [
        ...screenerFilters.balancesheetCommon,
        "Other Assets","Total Assets"
    ],

    S_cashflows_common : [
        "Cash from Operating Activity","Cash from Investing Activity","Cash from Financing Activity","Net Cash Flow"
    ],

    S_profitloss_quartely_bank : [
        "Revenue","Interest","Expenses","Financing Profit","Financing Margin %","Other Income","Depreciation",
        "Profit before tax","Tax %","Net Profit","EPS in Rs","Dividend Payout %"
    ],
    
    S_profitloss_quartely_common : [...screenerFilters.profitlossCommon],
    S_profitloss_common : [...screenerFilters.profitlossCommon,"Dividend Payout %"],

    // Ratio : {
    //     bold : ["ROE","ROCE","Net Profit Margin","Losses to Revenue","Deposit to Loan Ratio","Current Ratio","Debt to Equity"],
    //     blue : ["Margins","Financial Strength"]
    // }

    Ratio : [

        { title : "ROE" , bold : true , blue : false, fixed : 2 },
        { title : "ROA" , bold : false , blue : false, fixed : 2 },
        { title : "ROCE" , bold : true , blue : false, fixed : 2 },
        { title : "Asset Turnover" , bold : false , blue : false, fixed : 2 },
        { title : "Inventory Turnover" , bold : false , blue : false, fixed : 2 },
        { title : "Recievables Turnover" , bold : false , blue : false, fixed : 2 },
        { title : "Margins" , bold : true , blue : true, fixed : 2 },
        { title : "Gross Margin" , bold : false , blue : false, fixed : 2 },
        { title : "Operating Margin" , bold : false , blue : false, fixed : 2 },
        { title : "Net Profit Margin" , bold : true , blue : false, fixed : 2 },
        { title : "Financial Strength" , bold : true , blue : true, fixed : 2 },
        { title : "Losses to Revenue" , bold : false , blue : false, fixed : 2 },
        { title : "Deposit to Loan Ratio" , bold : true , blue : false, fixed : 2 },
        { title : "Current Ratio" , bold : true , blue : false, fixed : 2 },
        { title : "Debt to Equity" , bold : true , blue : false, fixed : 2 },
        { title : "Net Interest Coverage" , bold : false , blue : false, fixed : 2 }
    ],


    ShareHoldings : [
        { title : 'Promoters' , bold : false , fixed : 2},
        { title : 'FIIs' , bold : false , fixed : 2},
        { title : 'DIIs' , bold : false , fixed : 2},
        { title : 'Others' , bold : false , fixed : 2}
    ]

}

const RatioFormulaMap = {
    ROE : 'RatioFormulaMap_ROE',
    ROCE : 'RatioFormulaMap_ROCE',
    "Net Profit Margin" : 'RatioFormulaMap....',
    "Losses to Revenue" : 'RatioFormulaMap....',
    "Deposit to Loan Ratio" : 'RatioFormulaMap....',
    "Current Ratio" : 'RatioFormulaMap....',
    "Debt to Equity" : 'RatioFormulaMap....',
     Margins : 'RatioFormulaMap....',
     "Financial Strength" : 'RatioFormulaMap....',
    //  .... you can add more
}


function FilterData({ field, type, action, data, from }) {



    var res = null;
    from = data?.from ? data?.from  : from;

    // console.log("---- LOAD FILTER DATA FOR ",action,field,type,from);

    const inArray = (arr, text) => {
        
        // console.log(text);
        var res = false;
        if (text && typeof text === 'string') {
            const rplce = t => t ? t?.replace(/[^\w\s]/gi, "")?.replace(" ", "").trim()?.toLowerCase() : t
            let textF = rplce(text);
            // console.log(textF);

            for (let k of arr) {

                // console.log(k);
                let t = '', to = typeof k.title;
                if (to === 'string')
                {
                    t = k.title;
                }
                else if (to === 'object')
                {
                    t = k.title.props.children;
                }

                // console.log(rplce(t))
                if (t && rplce(t) === textF) 
                {
                    res = k;
                    break;
                }
            }
        }

        // console.log(res);


        return res;
    }

    const MainFunc = (array) => {

        let res = {
            "fields": data?.fields || [],
            "values": []
        }

        let IndexOFfieldName = (res?.fields || []).findIndex(f => f === 'fieldName'), i = 0, l = data?.values?.length || 0,
            IndexOFstockCode = (res?.fields || []).findIndex(f => f === 'stockCode');

        for (; i < l; ++i) {
            let t = data.values[i][IndexOFfieldName];
            // console.log('FIELD NAME ',t);
            if (t) 
            {
                let f = inArray(array, t);
                let k = data.values[i];
                if (f) {

                    // if (typeof f === 'object') 
                    // {
                    //     console.log(f,k);
                    //     let nd = [], ii = 0, lng = k.length;
                    //     for (; ii < lng; ++ii) 
                    //     {
                    //         let d = f;
                    //         if (ii != IndexOFfieldName || ii != IndexOFstockCode) 
                    //         {
                    //             nd.push(<b>{NumberWithCommas(d)}</b>);
                    //         } 
                    //         else
                    //         {
                    //             nd.push(<b>{d}</b>);
                    //         }
                    //     }
                    //     k = nd;
                    // }
                    // else
                    // {
                    //     k[IndexOFfieldName] = f;
                    // }
                    k[IndexOFfieldName] = f;
                    res.values.push(k)
                }
            }
        }

        return res
    }

    // console.log(field, type, action);

    if (from === 'reuters' && action && type && field) {
        if (type === "quarterly") 
        {
            type = "annual"
        }

        if(field === 'ratios')
        {
            res = MainFunc(FiltersDataTypes['Ratio']);
        }

        else if(field === 'shareholding')
        {
            res = MainFunc(FiltersDataTypes['ShareHoldings'] || [])
        }

        else
        {
            res = MainFunc(((FiltersDataTypes["R_" + field + "_" + type + "_" + action]) || []))
        }

    }
    else if(from === 'screener' )
    {
        if(field=='income' || field=='profitloss')
        {
            if(data?.type=='banks' && type=='quarterly')
            {
                res = MainFunc(((FiltersDataTypes.S_profitloss_quartely_bank) || []))
            }
            else if(type=='quarterly')
            {
                res = MainFunc(((FiltersDataTypes.S_profitloss_quartely_common) || []))
            }else 
            {
                res = MainFunc(((FiltersDataTypes.S_profitloss_common) || []))
            }
        }
        else if(field=='balancesheet')
        {
            if(data?.type=='banks')
            {
                res = MainFunc(((FiltersDataTypes.S_balancesheet_bank) || []))
            }
            else
            {
                res = MainFunc(((FiltersDataTypes.S_balancesheet_common) || []))
            }
        }
        else if(field=='cashflow')
        {
            res = MainFunc(((FiltersDataTypes.S_cashflows_common) || []))
        }

        else if(field === 'shareholding')
        {
            res = MainFunc(FiltersDataTypes['ShareHoldings'] || [])
        }
   
    }
   
    return {
        ...res,
        from
    };
}

const DataEvents = {
    oldType: ''
}

// create the data tables of Financials , Cash-Flow , etc.
class CreateTable extends React.PureComponent{
    
    constructor(props){
        super(props);
        this.state={
            data : null,
            loading : true,
            type : this.props.type,
            field : this.props.field,
            stockcode : this.props.stockcode,
            oldProps : {},
            from: this.props.from, //reuters //temp (get this data from database )
        }

        this.axiosRequest = this.axiosRequest.bind(this)
    }

    componentDidMount(){
        DataEvents.oldType = this.props.type
        this.axiosRequest()
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.type !== prevProps.type)
        {
            console.log('type update');
            this.axiosRequest();
        }
    }



    axiosRequest(){

        Axios({
            method: 'GET',
            url: `${REQUEST_BASE_URL}/createtable/${this.props.type}/${this.props.field}/${this.props.stockcode}`,
            responseType: 'json',
            
        })
        .then(
            (response) => {
                let fromtype = response.data.from;
                this.setState({
                    data: response.data,
                    loading : false,
                },()=>{
                    this.props.setFromType(fromtype);
                })
            }
        )
        .catch(
            (error) => {
                this.setState({
                    loading : false
                })
                console.log("AxiosRequest_error = ",error)
            }
        );
    }

    OverlayTrigger({buttonText}){
            
        return <OverlayTrigger
        placement="right"
        overlay={
        <Tooltip id="tooltip-right" style={{fontSize : 10}}>
            {RatioFormulaMap[buttonText] || buttonText}
        </Tooltip>
        }
    >
    <span>{buttonText}</span>
    </OverlayTrigger>
    }


  render(){

    //   if (this.props.type != DataEvents.oldType) {
    //       DataEvents.oldType = this.props.type
    //       this.axiosRequest();
    //       console.log("this = ",this.props)
    //   }

    //   console.log(this.state.data);

      var data = FilterData({ action: this.props.action, ...this.state }) || this.state.data;

    //   console.log(data);

      data = data && typeof data === 'object' && data;

      return(
          <>
            <div className="financials__table__data" style={{ maxHeight : '80%', width : '100%' }}>
            {!this.state.loading ?
                <table className="create-table" style={{ fontSize: '10px', marginBottom: 20 }}>
                    <thead>
                        <tr>
                            {
                              (this.props.field==="ratios" && data?.fields?.length) ? <th style={{ color: '#00A0E3' , textAlign : 'left' }}>Management Effectiveness</th>:<th></th>
                            }
                            
                            {
                                data && (data.fields || [])?.map((e, i) => {
                                    if (typeof e === 'string') {

                                        e = e?.replace(/_/g, " ")?.replace(/\b\w/g, l => l.toUpperCase()).replace(/ /g, "-")
                                        let s = e.split('-'), l = s.length;
                                        if (l >= 2) {
                                            let k = s[l - 1];
                                            let f = s[0];
                                            e = e.replace(k, k?.toString().substr(-2));

                                            e = l > 2 ? e.replace(f, ' ') : e;
                                            
                                        }
                                    }
                                    let p = String(e)?.toLowerCase()
                                    return (p && p !== 'stockcode' && p !== 'fieldname') ? (<td key={i} style={{ color: '#00A0E3' }}>{e?.replace(/[+|-]/gi,'')}</td>) : null
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.values?.map((row, i) => {

                                let isBold = 'cell__normal';
                                let fixed = 0;
                                return (
                                        <tr key={i}>
                                            {
                                                
                                                (row.map((r,indx)=>{

                                                    if(indx)
                                                    {
                                                        {/* console.log(r); */}
                                                        if(indx === 1)
                                                        {
                                                            isBold = r.bold ? 'cell__bold' : 'cell__normal';
                                                            isBold = r.blue ? 'cell__blue' : isBold;
                                                            fixed = r.fixed ? r.fixed : 0;
                                                            {/* console.log(r.fixed,fixed); */}
                                                            return <td className={isBold} key={indx}>{r.title}</td>;
                                                        }
                                                        else
                                                        {
                                                            let v = typeof r === 'string' ? String(NumberWithCommas(r,fixed))?.replace(/[+|-]/gi,'') : String(r)?.replace(/[+|-]/gi,'')
                                                            r = (r && r !== ' ' && r !== null) ? v : '';
                                                            return <td className={isBold} key={indx}>{r}</td>;
                                                        }
                                                    }
                                                    else
                                                    {
                                                        return null;
                                                    }
                                                }))
                                            }
                                        </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                :
                <div className="financials__table__data__loader">
                    <Pulse />
                </div>
                }      
         
            </div>
          </>
      )
  }
}

export {CreateTable};
