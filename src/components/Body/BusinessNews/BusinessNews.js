import React from 'react';
import AnimatedDigit from '../AnimatedDigit';
import SettingIcon from '../../../assets/icons/settings.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import { QuoteNav } from './QuoteNav';
import { Overview } from './Overview';
import { Financials } from './Financials/Financials';
import { Technicals } from "./Technicals";
import {Valuation} from './Valuation';
import { Feed } from "./Feed";

class BusinessNews extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            field: 'overview'
        }
    }

    render() {

        // console.log(this.props);
        var field = this.state.field
        // console.log('type = ', field);

        let stockData = this.props.stockData;

        let TradePrice = stockData.last_traded_price;
        let dPrice = (TradePrice+'').split('.')[0];
        let fPrice = (TradePrice+'').split('.')[1];

        let change_price = parseFloat(stockData.change_price);
        let change_percentage = parseFloat(stockData.change_percentage);

        // console.log(change_price,change_percentage)

        let priceClass = change_price >= 0 ? 'positive' : 'negative';
        
        // console.log(this.props.isLoaded)
        
        if(this.props.snapdata)
        {
            return (
                <>
                    <div className="business__container">
    
                            <div className="container__header">
                                <div className="stock__info">
                                    <div className="stock__details">
                                        <p className="stock__name__code">
                                            <span id="stock__code">{this.props.stockDetails.stockSymbol}</span>
                                        </p>
                                        <div className="stock__type">
                                            <img src={SettingIcon} alt="s"/>
                                            <p>Oil & Gas</p>
                                        </div>
                                    </div>
                                    <div id="stock__full__name">
                                        <span>{this.props.stockDetails.stockName}</span>
                                    </div>
                                    <div className="stock__price__purchase">
                                        <div className="price__decimals" style={{display : 'flex'}}>
                                            {dPrice &&
                                            dPrice.split('').map((n,i) => {
                                                return <AnimatedDigit digit={n} transform={30} key={i}/>
                                            })}
                                        </div>
                                        <div className="price__fraction" style={{display : 'flex'}}>
                                            {fPrice &&
                                            fPrice.split('').map((n,i) => {
                                                return <AnimatedDigit digit={n} transform={20} key={i}/>
                                            })}
                                        </div>
                                        <div className="stock__purchase">
                                            <div className="buy__stock"><img src={PlusIcon} alt=""/></div>
                                            <div className="sell__stock"><img src={MinusIcon} alt=""/></div>
                                        </div>
                                    </div>
                                    <div className="stock__price__change">
                                        <div className={priceClass +' stock__performance__amount'} style={{display : 'flex'}}>
                                            {stockData.change_price &&
                                                stockData.change_price.split('').map((n,i) => {
                                                    return <AnimatedDigit digit={n} transform={18} key={i}/>
                                            })}
                                        </div>
                                        <div className={priceClass +' stock__performance__percentage'} style={{display : 'flex'}}>
                                            ({stockData.change_percentage &&
                                                stockData.change_percentage.split('').map((n,i) => {
                                                    return <AnimatedDigit digit={n} transform={18} key={i}/>
                                            })})
                                        </div>
                                    </div>
                                </div>
                                <div className="business__news__menu">
                                    <QuoteNav onClick={(i, e) => this.setState({ field: e.target.dataset.field?.toLowerCase()?.replace(/ /g, '') })} activeClassName="active-nav-0">
                                        <div active={field === 'overview'} data-field="overview">Overview</div>
                                        <div active={field === 'financials'} data-field="financials">Financials</div>
                                        <div data-field="valuation">Valuation</div>
                                        <div active={field === 'technicals'} data-field="technicals">Technicals<span style={{fontSize:"12px"}}> (AI & ML)</span></div>
                                        <div data-field="feed">Feed</div>
                                    </QuoteNav>
                                </div>
                            </div>
    
                            <div className="business__news__box">
                                {field === 'overview' && <Overview 
                                    stockDetails={this.props.stockDetails}
                                    snapdata={this.props.snapdata}
                                />}
                                {field === 'financials' && <Financials />}
                                {field === 'valuation' && <Valuation />}
                                {field === 'technicals' && <Technicals />}
                                {field === 'feed' && <Feed />}
                            </div>
    
                    </div>
                </>
            )
        }
        else
        {
            return null;
        }
    }
}

export { BusinessNews }