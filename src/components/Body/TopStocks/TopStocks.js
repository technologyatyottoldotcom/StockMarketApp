import React from 'react';
import UpperStock from './UpperStock';

class TopStocks extends React.PureComponent {

	constructor(props)
	{
		super(props);
		this.state = {
			IndexList : [
			{
                'Name' : 'BSE Sensex',
                'Symbol' : 'SENSEX',
				'StockCode' : 1,	
				'Exchange' : 'BSE',
				'ExchangeCode' : 6
            },
			{
                'Name' : 'Nifty 50',
                'Symbol' : 'NIFTY_50',
				'StockCode' : 26000,
				'Exchange' : 'NSE',
				'ExchangeCode' : 1

            },
			{
                'Name' : 'Bank Nifty',
                'Symbol' : 'NIFTY_BANK',
				'StockCode' : 26009,
				'Exchange' : 'NSE',
				'ExchangeCode' : 1
            },
			{
                'Name' : 'NSE FMCG',
                'Symbol' : 'NIFTY_FMCG',
				'StockCode' : 26021,
				'Exchange' : 'NSE',
				'ExchangeCode' : 1
            },
			{
                'Name' : 'NSE Midcap',
                'Symbol' : 'NIFTY_MIDCAP_50',
				'StockCode' : 26014,
				'Exchange' : 'NSE',
				'ExchangeCode' : 1
            }
		],
		}
	}

    render() {

		


        return (
            <div className="top__stocks container-fluid HomeTopChart__Scrollbar d-flex p-0">
                {
						this.state.IndexList ?
							(this.state.IndexList || []).map((v, i) => {
								if (v && typeof v == 'object') {
									return <UpperStock 
											{...v} 
											key={i+Math.random()*9999 + Date.now()}
											ws={this.props.ws}
									/>

								} else return null
							})
							:
							<UpperStock {...this.props} />
				}
            </div>
        )
    }
}

export default TopStocks;
