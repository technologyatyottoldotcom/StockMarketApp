import React from 'react';
import { QuoteNav } from '../QuoteNav';

import { PL } from './PL';
import { BalanceSheet } from './BalanceSheet';
import { CashFlow } from './CashFlow';
import { Ratio } from './Ratio';
import { Shareholding } from './Shareholding';

class FinanceLeft extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            fromtype : '',
            type: 'annual', // annual , quarterly
            field: 'balancesheet', //profit&loass , balancesheet , cashflows , ratios
            stockcode: this.props.stockDetails.stockSymbol,//RELI.NS //HDFCBANK
            from : 'reuters' // reuters // screener
        }

        this.setFromType = this.setFromType.bind(this);
    }

    setFromType(fromtype)
    {
        this.setState({
            fromtype : fromtype
        });
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockDetails.stockSymbol !== this.props.stockDetails.stockSymbol)
        {
            // console.log('UPDATE CREATE TABLE CODE');
            this.setState({
                stockcode : this.props.stockDetails.stockSymbol
            });
        }
    }

    render() {
        
        var field = this.state.field;
        return (
                <>
                    <div className="financials__left__nav">
                        <QuoteNav onClick={(i, e) => { this.setState({ field: e.target.innerText?.toLowerCase()?.replace(/ /g, '') }) }} activeClassName="chart-nav-fields-active" className="chart-nav-fields" style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                            <button>Profit & Loss</button>
                            <button active={true}>Balance Sheet</button>
                            <button>Cash Flow</button>
                            <button>Ratios</button>
                            <button>Shareholding</button>
                        </QuoteNav>
                    </div>

                    <div className="financials__left__nav">
                        {
                            field === 'ratios' || field==="shareholding" ? '' : 
                            <QuoteNav onClick={(i, e) => { this.setState({ type: e.target.innerText?.toLowerCase() }) }} activeClassName="chart-nav-fields-active" className="chart-nav-fields" style={{ paddingLeft: 0, margin: 0, listStyleType: 'none' }}>
                                <button active={this.state.type === 'annual'}>Annual</button>
                                <button active={this.state.type === 'quarterly'}>Quarterly</button>
                            </QuoteNav>
                         }
                         <p className="financials__table__unit">
                            {this.state.fromtype && this.state.fromtype!== '' &&

                                <>
                                    {this.state.fromtype === 'reuters' ? 

                                        ('(in Millions, INR)')

                                        :

                                        ('(in Crs. , INR)')

                                    }
                                </>
                            
                            }
                        </p>
                    </div>

                    <div className="financials__table">
                        {(field === 'profit&loss') && <PL type={this.state.type} field="income" stockcode={this.state.stockcode} setFromType={this.setFromType}/>} 
                        {(field === 'balancesheet') && <BalanceSheet type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} setFromType={this.setFromType}/>}
                        {(field === 'cashflow') && <CashFlow type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} setFromType={this.setFromType}/>}
                        {(field === 'ratios') && <Ratio type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} setFromType={this.setFromType}/>}
                        {(field === 'shareholding') && <Shareholding type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} setFromType={this.setFromType}/>}
                    </div>

                </>




        )
    }
}

export { FinanceLeft }