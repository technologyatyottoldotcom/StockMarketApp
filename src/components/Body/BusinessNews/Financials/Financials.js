import React from 'react';
import {FinanceLeft} from './FinanceLeft';
import {FinanceRight} from './FinanceRight';
import '../../../../scss/Financials.scss';

class Financials extends React.PureComponent {

    render() {
        return (
            
            <div className="bn__stock__financials">
                <div className="financials__left">
                    <FinanceLeft />
                </div>
                <div className="financials__right">
                    <FinanceRight />
                </div>
        </div>

        )
    }
}

export { Financials }