import React from 'react';
import { QuoteNav } from '../QuoteNav';

import { IncomeStatement } from './IncomeStatement';
import { BalanceSheet } from './BalanceSheet';
import { CashFlow } from './CashFlow';
import { Ratio } from './Ratio';

class Financials extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 'annual', // annual , quarterly
            field: 'incomestatement', //incomestatement , balancesheet , cashflows , ratios
            stockcode: "AARI.NS"
        }
    }
    render() {
        var field = this.state.field
        return (
            <div className="container-fluid" style={{ paddingLeft: 0, paddingTop: '10px' }}>
                <div className="row">
                    <div className="row" style={{background:'',width:'950px'}}>
                    <div style={{ paddingBottom: '15px', marginLeft: '35px' }}>
                            <b>Statements</b>: All values displayed in Millions, INR.
                     </div>

                        <div className="col-auto pl-5 m-0">
                            <QuoteNav onClick={(i, e) => { this.setState({ field: e.target.innerText?.toLowerCase()?.replace(/ /g, '') }) }} activeClassName="financial-fields-active" className="financial-fields" style={{ margin:0,padding: 0 , listStyleType:'none' }}>
                                <button active={1}>Income Statement</button>
                                <button>Balance Sheet</button>
                                <button>Cash Flows</button>
                                <button>Ratios</button>
                            </QuoteNav>
                        </div>
                        <div className="col-auto p-0 m-0">
                            <QuoteNav onClick={(i, e) => { this.setState({ type: e.target.innerText?.toLowerCase() }) }} activeClassName="annual-quartly-active" className="financial-fields-annual-quartly" style={{ paddingLeft: 0 }}>
                                <button active={this.state.type === 'annual'}>Annual</button>
                                <button active={this.state.type === 'quarterly'}>Quarterly</button>
                            </QuoteNav>
                        </div>

                        {(field === 'incomestatement') && <IncomeStatement type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                        {(field === 'balancesheet') && <BalanceSheet type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                        {(field === 'cashflows') && <CashFlow type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                        {(field === 'ratios') && <Ratio type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}

                    </div>

                </div>



            </div>

        )
    }
}

export { Financials }