import React from 'react';
import Statistics from './Statistics';

export class KeyStatistics extends React.Component {

    render() {

        let stockData = this.props.stockData;
        // console.log(stockData);
        // console.log(stockData.close_price);

        return (
            <div className="key__statistics">
                <div className="ks__title">
                    <p>Key Statistics</p>
                </div>
                <div className="ks__container">
                    <div className="ks__container__half">
                        <div className="ks__slot">
                            {/* <Statistics name="Previous Close" value={stockData.close_price}/>
                            <Statistics name="Open Price" value={stockData.open_price}/>
                            <Statistics name="Volume('000)" value={stockData.trade_volume}/> */}
                            <Statistics name="Previous Close" value="2,108.91"/>
                            <Statistics name="Open Price" value="2,011.86"/>
                            <Statistics name="Volume('000)" value="22,38,912"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Day Range" value="1,564.20 - 1,597.80"/>  
                            <Statistics name="52-week range" value="738.75 - 1,631.65"/> 
                            <Statistics name="3m Avg Vol('000)" value="1,236.56"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Market Cap" value="1,236.56 Cr."/>
                            <Statistics name="P/E" value="1,236.56"/>
                            <Statistics name="Beta" value="1,236.56"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="ROE(TTM)" value="1,236.56"/>
                            <Statistics name="ROA(TTM)" value="10,487,012"/>
                            <Statistics name="ROCE(TTM)" value="1,236.56"/>
                        </div>
                    </div>
                    <div className="ks__container__full">
                        <div className="ks__slot">
                            <Statistics name="Previous Close" value={stockData.close_price}/>
                            <Statistics name="Open" value={stockData.open_price}/>  
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Day's Range" value="1,564.20 - 1,597.80"/>
                            <Statistics name="52-week range" value="738.75 - 1,631.65"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Volume" value={stockData.trade_volume}/>
                            <Statistics name="Avg. volume" value="10,487,012"/>  
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Bid" value={stockData.best_bid_price}/>
                            <Statistics name="Ask" value={stockData.best_ask_price}/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Volume" value={stockData.trade_volume}/>
                            <Statistics name="Avg. volume" value="10,487,012"/>   
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Bid" value={stockData.best_bid_price}/>
                            <Statistics name="Ask" value={stockData.best_ask_price}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default KeyStatistics;
