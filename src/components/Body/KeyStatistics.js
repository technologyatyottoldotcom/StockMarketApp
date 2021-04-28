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
                            <Statistics type="number" name="Previous Close" value={stockData.close_price}/>
                            <Statistics type="number" name="Open Price" value={stockData.open_price}/>
                            <Statistics type="number" name="Volume('000)" value={stockData.trade_volume}/>
                            {/* <Statistics type="number" name="Previous Close" value="2,108.91"/>
                            <Statistics type="number" name="Open Price" value="2,011.86"/>
                            <Statistics type="number" name="Volume('000)" value="22,38,912"/> */}
                        </div>
                        <div className="ks__slot">
                            <Statistics type="range" name="Day Range" value={[stockData.open_price , stockData.close_price]}/>  
                            <Statistics type="range" name="52-week range" value={[stockData.yearly_low_price,stockData.yearly_high_price]}/> 
                            <Statistics type="number" name="3m Avg Vol('000)" value="1,236.56"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics type="number" name="Market Cap" value="1,236.56 Cr."/>
                            <Statistics type="number" name="P/E" value="1,236.56"/>
                            <Statistics type="number" name="Beta" value="1,236.56"/>
                        </div>
                        <div className="ks__slot">
                            <Statistics type="number" name="ROE(TTM)" value="1,236.56"/>
                            <Statistics type="number" name="ROA(TTM)" value="10,487,012"/>
                            <Statistics type="number" name="ROCE(TTM)" value="1,236.56"/>
                        </div>
                    </div>
                    <div className="ks__container__full">
                        <div className="ks__slot">
                            <Statistics type="number" name="Previous Close" value={stockData.close_price}/>
                            <Statistics type="number" name="Open" value={stockData.open_price}/>  
                        </div>
                        <div className="ks__slot">
                            <Statistics type="range" name="Day Range" value={[stockData.open_price , stockData.close_price]}/>  
                            <Statistics type="range" name="52-week range" value={[stockData.yearly_low_price,stockData.yearly_high_price]}/> 
                        </div>
                        <div className="ks__slot">
                            <Statistics type="number" name="Volume" value={stockData.trade_volume}/>
                            <Statistics type="number" name="Avg. volume" value="10,487,012"/>  
                        </div>
                        <div className="ks__slot">
                            <Statistics type="number" name="Bid" value={stockData.best_bid_price}/>
                            <Statistics type="number" name="Ask" value={stockData.best_ask_price}/>
                        </div>
                        <div className="ks__slot">
                            <Statistics type="number" name="Volume" value={stockData.trade_volume}/>
                            <Statistics type="number" name="Avg. volume" value="10,487,012"/>   
                        </div>
                        <div className="ks__slot">
                            <Statistics type="number" name="Bid" value={stockData.best_bid_price}/>
                            <Statistics type="number" name="Ask" value={stockData.best_ask_price}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default KeyStatistics;
