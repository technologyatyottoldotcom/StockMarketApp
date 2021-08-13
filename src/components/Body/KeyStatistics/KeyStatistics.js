import React from 'react';
import Statistics from './Statistics';
import Spinner from '../../Loader/Spinner';
import Pulse from '../../Loader/Pulse';

export class KeyStatistics extends React.PureComponent {

    convertIntoPriceFormat(num,frac=2)
    {
        if(num)
        {
            return num.toLocaleString('en-IN',{
                minimumFractionDigits: frac,
                currency: 'INR'
            });
        }
        else
        {
            return num;
        }
    }

    render() {

        let stockData = this.props.stockData;
        let snapData = this.props.snapdata;

        const zoom = this.props.zoom;

        // console.log(lastPoint);
        // console.log(stockData);
        // console.log(stockData.close_price);

        // return null;

        // console.log(snapData,stockData);

        if(snapData && stockData)
        {
            return (
                <div className="key__statistics">
                    <div className="ks__title">
                        <p>Key Statistics</p>
                    </div>
                    <div className="ks__container">
                        {!zoom ? 
                            <div className="ks__container__half">
                            <div className="ks__slot">
                                <Statistics 
                                    type="number" 
                                    name="Previous Close" 
                                    value={this.convertIntoPriceFormat(stockData.close_price)}
                                />
                                <Statistics 
                                    type="number" 
                                    name="Open Price" 
                                    value={this.convertIntoPriceFormat(stockData.open_price)}
                                />
                                <Statistics 
                                    type="number" 
                                    name="Volume('000)" 
                                    value={this.convertIntoPriceFormat(stockData.trade_volume,0)}
                                />
                                {/* <Statistics type="number" name="Previous Close" value="2,108.91"/>
                                <Statistics type="number" name="Open Price" value="2,011.86"/>
                                <Statistics type="number" name="Volume('000)" value="22,38,912"/> */}
                            </div>
                            <div className="ks__slot">
                                <Statistics 
                                    type="range" 
                                    name="Day Range" 
                                    value={[this.convertIntoPriceFormat(stockData.open_price) , this.convertIntoPriceFormat(stockData.close_price)]}
                                />  
                                <Statistics 
                                    type="range" 
                                    name="52-week Range" 
                                    value={[this.convertIntoPriceFormat(stockData.yearly_low_price),this.convertIntoPriceFormat(stockData.yearly_high_price)]}
                                /> 
                                <Statistics type="number" name="3m Avg Vol('000)" value="1,236.56"/>
                            </div>
                            <div className="ks__slot">
                                <Statistics type="number" name="Market Cap" value={this.convertIntoPriceFormat(this.props.snapdata.MarketCap)}/>
                                <Statistics type="number" name="P/E" value={this.props.snapdata.PriceToEarnings}/>
                                <Statistics type="number" name="Beta" value={this.props.snapdata.Beta}/>
                            </div>
                            <div className="ks__slot">
                                <Statistics type="number" name="ROE(TTM)" value={this.props.snapdata.ROE_TTM}/>
                                <Statistics type="number" name="ROA(TTM)" value={this.props.snapdata.ROA_TTM}/>
                                <Statistics type="number" name="ROCE(TTM)" value={this.props.snapdata.ROCE_TTM}/>
                            </div>
                        </div>
                        :
                        <div className="ks__container__full">
                            <div className="ks__slot">
                                <Statistics 
                                    type="number" 
                                    name="Previous Close" 
                                    value={this.convertIntoPriceFormat(stockData.close_price)}
                                />
                                <Statistics 
                                    type="number" 
                                    name="Open Price" 
                                    value={this.convertIntoPriceFormat(stockData.open_price)}
                                /> 
                            </div>
                            <div className="ks__slot">
                                <Statistics 
                                    type="range" 
                                    name="Day Range" 
                                    value={[this.convertIntoPriceFormat(stockData.open_price) , this.convertIntoPriceFormat(stockData.close_price)]}
                                />  
                                <Statistics 
                                    type="range" 
                                    name="52-week Range" 
                                    value={[this.convertIntoPriceFormat(stockData.yearly_low_price),this.convertIntoPriceFormat(stockData.yearly_high_price)]}
                                /> 
                            </div>
                            <div className="ks__slot">
                                <Statistics 
                                    type="number" 
                                    name="Volume('000)" 
                                    value={this.convertIntoPriceFormat(stockData.trade_volume,0)}
                                />
                                <Statistics type="number" name="3m Avg Vol('000)" value="1,236.56"/>  
                            </div>
                            <div className="ks__slot">
                                <Statistics type="number" name="Market Cap" value={this.convertIntoPriceFormat(this.props.snapdata.MarketCap)}/>
                                <Statistics type="number" name="Beta" value={this.props.snapdata.Beta}/>
                            </div>
                            <div className="ks__slot">
                                <Statistics type="number" name="P/E" value={this.props.snapdata.PriceToEarnings}/>
                                <Statistics type="number" name="ROE(TTM)" value={this.props.snapdata.ROE_TTM}/>
                            </div>
                            <div className="ks__slot">
                                <Statistics type="number" name="ROA(TTM)" value={this.props.snapdata.ROA_TTM}/>
                                <Statistics type="number" name="ROCE(TTM)" value={this.props.snapdata.ROCE_TTM}/>
                            </div>
                        </div>
                        }
                        
                    </div>
                </div>
            )
        }
        else
        {
            return <div className="key__statistics loader">
                {/* <Spinner size={30}/> */}
                <Pulse />
            </div>
        }
    }
}

export default KeyStatistics;
