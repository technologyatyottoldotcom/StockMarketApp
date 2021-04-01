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
                            <Statistics name="Previous Close" value={stockData.close_price}/>
                            <Statistics name="Open" value={stockData.open_price}/>
                            <Statistics name="Day's Range" value="1,564.20 - 1,597.80"/>
                            <Statistics name="52-week range" value="738.75 - 1,631.65"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Volume" value={stockData.trade_volume}/>
                            <Statistics name="Avg. volume" value="10,487,012"/>
                            <Statistics name="Bid" value={stockData.best_bid_price}/>
                            <Statistics name="Ask" value={stockData.best_ask_price}/>
                        </div>
                        <div className="ks__slot">
                            <Statistics name="Volume" value={stockData.trade_volume}/>
                            <Statistics name="Avg. volume" value="10,487,012"/>
                            <Statistics name="Bid" value={stockData.best_bid_price}/>
                            <Statistics name="Ask" value={stockData.best_ask_price}/>
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
