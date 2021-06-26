import React from 'react';
import Axios from 'axios';
import { OverlayTrigger , Tooltip  } from "react-bootstrap";

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

function NumberWithCommas(n) {
    try {
        let k = Number(n)
        if (k) {
            n = k.toFixed(2)
        }
        let p = n.toString().split(".");
        p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return p.join(".");
    } catch (e) { }
    return "--"
}

const FiltersDatacashflow = [
    "Net Income/Starting Line", "Depreciation/Depletion", "Non-Cash Items", "Cash Taxes Paid", "Cash Interest Paid", "Changes in Working Capital",
    "Cash from Operating Activities", "Capital Expenditures", "Other Investing Cash Flow Items, Total", "Cash from Investing Activities",
    "Financing Cash Flow Items", "Total Cash Dividends Paid", "Issuance (Retirement) of Stock, Net", "Issuance (Retirement) of Debt, Net", "Cash from Financing Activities",
    "Net Change in Cash"
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
    R_balancesheet_annual_condensed: [
        "Cash & Equivalents", "Cash and Short Term Investments",
        "Total Receivables, Net", "Goodwill, Net", "Long Term Investments", "Total Assets",
        "Accounts Payable", "Notes Payable/Short Term Debt", "Other Current liabilities, Total","Total Current Liabilities",
        "Total Long Term Debt", "Total Debt", "Total Liabilities", "Retained Earnings (Accumulated Deficit)",
        "Total Equity", "Total Liabilities & Shareholders' Equity"
    ],
    R_income_annual_detailed: [
        "Revenue", "Total Revenue", "Cost of Revenue, Total", "Gross Profit", "Selling/General/Admin. Expenses, Total", "Depreciation/Amortization", "Unusual Expense (Income)", "Other Operating Expenses, Total", "Total Operating Expense",
        "Operating Income", "Interest Inc.(Exp.),Net-Non-Op., Total", "Other, Net", "Net Income Before Taxes", "Provision for Income Taxes", "Net Income After Taxes", "Minority Interest", "Net Income Before Extra. Items", "Net Income",
        "Income Available to Com Excl ExtraOrd", "Income Available to Com Incl ExtraOrd", "Diluted Net Income", "Diluted Weighted Average Shares", "Diluted EPS Excluding ExtraOrd Items", "DPS - Common Stock Primary Issue", "Diluted Normalized EPS"
    ],
    R_income_annual_condensed: [
        "Revenue", "Cost of Revenue, Total", "Gross Profit", "Selling/General/Admin. Expenses, Total", "Depreciation/Amortization",
        "Total Operating Expense", "Operating Income", "Interest Inc.(Exp.),Net-Non-Op., Total", "Provision for Income Taxes", "Net Income", "Diluted Net Income",
        "Diluted Weighted Average Shares", "Diluted EPS Excluding ExtraOrd Items", "DPS - Common Stock Primary Issue", "Diluted Normalized EPS"
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

    Ratio : {
        bold : ["ROE","ROCE","Net Profit Margin","Losses to Revenue","Deposit to Loan Ratio","Current Ratio","Debt to Equity"],
        blue : ["Margins","Financial Strength"]
    }

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

    const inArray = (arr, text) => {
        var res = false
        if (text && typeof text === 'string') {
            const rplce = t => t ? t?.replace(/[^\w\s]/gi, "")?.replace(" ", "").trim()?.toLowerCase() : t
            let textF = rplce(text)

            for (let k of arr) {
                let t = '', to = typeof k
                if (to === 'string') t = k;
                else if (to === 'object') t = k.props.children;

                if (t && rplce(t) === textF) {
                    res = k
                    break;
                }
            }
        }
        return res
    }

    const MainFunc = (array) => {
        let res = {
            "fields": data?.fields || [],
            "values": []
        }

        let IndexOFfieldName = (res?.fields || []).findIndex(f => f === 'fieldName'), i = 0, l = data?.values?.length || 0,
            IndexOFstockCode = (res?.fields || []).findIndex(f => f === 'stockCode')

        for (; i < l; ++i) {
            let t = data.values[i][IndexOFfieldName]
            if (t) {
                let f = inArray(array, t), k = data.values[i]
                if (f) {

                    if (typeof f === 'object') {
                        let nd = [], ii = 0, lng = k.length
                        for (; ii < lng; ++ii) {
                            let d = k[ii]
                            if (ii != IndexOFfieldName || ii != IndexOFstockCode) {
                                nd.push(<b>{NumberWithCommas(d)}</b>);
                            } else nd.push(<b>{d}</b>);
                        }
                        k = nd
                    } else k[IndexOFfieldName] = f;
                    res.values.push(k)
                }
            }
        }
        return res
    }

    if (from === 'reuters' && action && type && field) {
        if (type === "quarterly") {
            type = "annual"
        }
        res = MainFunc(((FiltersDataTypes["R_" + field + "_" + type + "_" + action]) || []))
    }else if(from === 'screener' ){
        if(field=='income' || field=='profitloss'){
            if(data?.type=='banks' && type=='quarterly'){
                res = MainFunc(((FiltersDataTypes.S_profitloss_quartely_bank) || []))
            }else if(type=='quarterly'){
                res = MainFunc(((FiltersDataTypes.S_profitloss_quartely_common) || []))
            }else {
                res = MainFunc(((FiltersDataTypes.S_profitloss_common) || []))
            }
        }else if(field=='balancesheet'){
            if(data?.type=='banks'){
                res = MainFunc(((FiltersDataTypes.S_balancesheet_bank) || []))
            }else{
                res = MainFunc(((FiltersDataTypes.S_balancesheet_common) || []))
            }
        }else if(field=='cashflow'){
            res = MainFunc(((FiltersDataTypes.S_cashflows_common) || []))
        }
        
   
    }
   
    return res
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
            loading : null,
            type : this.props.type,
            field : this.props.field,
            stockcode : this.props.stockcode,
            oldProps : {},
            from: this.props.from,//reuters //temp (get this data from database )
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
            url: `http://${REQUEST_BASE_URL}:8000/createtable/${this.props.type}/${this.props.field}/${this.props.stockcode}`,
            responseType: 'json',
            onDownloadProgress: (pEvnt) => {
                this.setState({loading: Math.round((pEvnt.loaded * 100) / pEvnt.total)})
            },
        })
        .then(
            (response) => {
                console.log("get_data_from_server = ",response.data)
                this.setState({
                    data: response.data,
                    loading : null,
                })  
            }
        )
        .catch(
            (error) => {
                this.setState({
                    loading : null
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

      var d = FilterData({ action: this.props.action, ...this.state }) || this.state.data
      d = d && typeof d === 'object' && d;
      return(
          <>
            <div className="GlobalScrollBar financials__table__data" style={{ maxHeight : '80%', width : '100%' }}>
            {!this.state.loading ?
                <table className="create-table" style={{ fontSize: '10px', marginBottom: 20 }}>
                    <thead>
                        <tr>
                            {
                              (this.props.field==="ratios" && d?.fields?.length) ? <th style={{ color: '#00A0E3' , textAlign : 'left' }}>Management Effectiveness</th>:<th></th>
                            }
                            
                            {
                                d && (d.fields || [])?.map((e, i) => {
                                    if (typeof e === 'string') {
                                        e = e?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()).replace(/ /g, "-")
                                        let s = e.split('-'), l = s.length
                                        if (l >= 3) {
                                            let k = s[l - 1]
                                            e = e.replace(k, k?.toString().substr(-2))
                                        }
                                    }
                                    let p = String(e)?.toLowerCase()
                                    return (p && p !== 'stockcode' && p !== 'fieldname') ? (<td key={i + Math.random() * 600} style={{ color: '#00A0E3' }}>{e?.replace(/[+|-]/gi,'')}</td>) : null
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            d && d.values?.map((e, i) => {
                                if (typeof e === 'object') {
                                    let colorTY = ''
                                    return (
                                        <tr key={i + Math.random() * 999 + Date.now()}>
                                            {
                                                (typeof e === 'object' ? e : [])?.map((e, i) => {
                                                    if (i) {
                                                        let r = typeof e === 'string' ? String(NumberWithCommas(e))?.replace(/[+|-]/gi,'') : String(e)?.replace(/[+|-]/gi,'')
                                                        e = (e && e !== ' ' && e !== null) ? r : '--'
                                                        if(this.props.field=="ratios"){
                                                            
                                                            if(i==1){
                                                                for(let isBB in FiltersDataTypes.Ratio){
                                                                    if(FiltersDataTypes.Ratio[isBB].indexOf(e) != -1){
                                                                        colorTY = isBB;
                                                                        break;
                                                                    }
                                                                }
                                                                e = <this.OverlayTrigger buttonText={e} />
                                                            }
                                                            let pele = <td key={i + Math.random() * 999 + Date.now() + e} style={{fontWeight : 'normal'}}>
                                                                    {e}
                                                                </td>     
                                                            if(colorTY=='bold'){
                                                                pele =  <td key={i + Math.random() * 999 + Date.now() + e} style={{fontWeight : 'bold'}}>
                                                                    {e}
                                                                </td>
                                                            }else if(colorTY=='blue'){
                                                                pele =  <td key={i + Math.random() * 999 + Date.now() + e} style={{color : '#00A0E3'}}>
                                                                     {e}
                                                                </td>
                                                            }
                                                         return pele
                                                        }else return <td key={i + Math.random() * 999 + Date.now() + e}>{e}</td>

                                                    } else return null
                                                })
                                            }
                                        </tr>
                                    )
                                } else return "Data Not Found"
                            })
                        }
                    </tbody>
                </table>
                :
                <div style={{ textAlign: 'center', padding: 2 }}>
                    <div className="spinner-border text-primary"></div>
                    {this.state.loading}
                </div>
                }      
         
            </div>
          </>
      )
  }
}

export {CreateTable};
