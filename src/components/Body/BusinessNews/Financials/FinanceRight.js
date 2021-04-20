import React from 'react';
import { CreditRatings } from './CreditRatings';
import { BusinessChart } from './BusinessChart';

class FinanceRight extends React.PureComponent {
    render() {
        return (
            <>
                <div className="credit__ratings" style={{ minWidth : '80%' ,position: 'relative',  overflow: 'scroll', overflowX: 'hidden', scrollBehavior: 'smooth', fontSize: '14px' }}>
                    <div style={{fontWeight:'bold'}}>Credit ratings</div>
                    <CreditRatings />
                </div>
                <div className="credit__charts GlobalScrollBar" style={{ top : 5, paddingBottom:15 , position: 'relative', height: 220, overflowY: 'scroll', scrollBehavior: 'smooth' }}>
                    <BusinessChart />
                    <BusinessChart />
                    <BusinessChart />
                </div>
            </>
        )
    }
}

export { FinanceRight }