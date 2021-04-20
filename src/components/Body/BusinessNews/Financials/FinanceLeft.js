import React from 'react';
import { QuoteNav } from '../QuoteNav';

import { PL } from './PL';
import { BalanceSheet } from './BalanceSheet';
import { CashFlow } from './CashFlow';
import { Ratio } from './Ratio';

class FinanceLeft extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: 'annual', // annual , quarterly
            field: 'balancesheet', //profit&loass , balancesheet , cashflows , ratios
            stockcode: "RELI.NS",
        }
    }
    render() {
        var field = this.state.field
        return (
                <>
                    <div className="financials__left__nav">
                        <QuoteNav onClick={(i, e) => { this.setState({ field: e.target.innerText?.toLowerCase()?.replace(/ /g, '') }) }} activeClassName="chart-nav-fields-active" className="chart-nav-fields" style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
                            <button>Profit & Loss</button>
                            <button active={true}>Balance Sheet</button>
                            <button>Cash Flow</button>
                            <button>Ratios</button>
                        </QuoteNav>
                    </div>

                    <div className="financials__left__nav">
                        <QuoteNav onClick={(i, e) => { this.setState({ type: e.target.innerText?.toLowerCase() }) }} activeClassName="chart-nav-fields-active" className="chart-nav-fields" style={{ paddingLeft: 0, margin: 0, listStyleType: 'none' }}>
                            <button active={this.state.type === 'annual'}>Annual</button>
                            <button active={this.state.type === 'quarterly'}>Quarterly</button>
                        </QuoteNav>
                    </div>

                    <div className="financials__table">
                        {(field === 'incomestatement') && <PL type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                        {(field === 'balancesheet') && <BalanceSheet type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                        {(field === 'cashflows') && <CashFlow type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                        {(field === 'ratios') && <Ratio type={this.state.type} field={this.state.field} stockcode={this.state.stockcode} />}
                    </div>

                </>




        )
    }
}

export { FinanceLeft }