import React from 'react';
import Axios from 'axios';
import AnimatedDigit from '../AnimatedDigit';
import SettingIcon from '../../../assets/icons/settings.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import Close from '../../../assets/icons/close.svg';
import { QuoteNav } from './QuoteNav';
import { Overview } from './Overview';
import { Financials } from './Financials/Financials';
import { Technicals } from "./Technicals";
import {Valuation} from './Valuation';
import { Feed } from "./Feed";
import Pulse from '../../Loader/Pulse';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class BusinessNews extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            field: 'overview',
            technicals : {
                loading : true,
                warning : false,
                targets : {}
            }
        }
    }

    componentDidMount()
    {
        const stock = this.props.stockDetails;
        let exchange = stock.stockExchange.exchange;
        let code = exchange === 'NSE' ? stock.stockNSECode : stock.stockBSECode;
        let riccode = stock.stockSymbol;
        this.getTargets(exchange,code);
        this.getDefaultValues(riccode);
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockDetails.stockSymbol !== this.props.stockDetails.stockSymbol)
        {
            this.setState({
                technicals : {
                    loading : true,
                }
            })
            const stock = this.props.stockDetails;
            let exchange = stock.stockExchange.exchange;
            let code = exchange === 'NSE' ? stock.stockNSECode : stock.stockBSECode;
            let riccode = stock.stockSymbol;
            this.getTargets(exchange,code);
            this.getDefaultValues(riccode);
        }
    }

    getTargets(exchange,code)
    {
        Axios.get(`${REQUEST_BASE_URL}/detailed_view/technical/${exchange}/${code}`)
        .then((res)=>{

            let data = res.data;
            if(data.status === 'success')
            {
                this.setState({
                    technicals : {
                        targets : data.targets,
                        loading : false,
                        warning : false,
                    }
                });
            }
            else if(data.status === 'warning')
            {
                this.setState({
                    technicals : {
                        warning : true,
                        loading : false
                    }
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    getDefaultValues(code)
    {
        Axios.get(`${REQUEST_BASE_URL}/createvalues/${code}`)
        .then((res)=>{

            let data = res.data;

            // console.log(data);

            if(data.status === 'success')
            {
                const defaultfactors = data.data;

                let TTMEPS = Math.round(defaultfactors.TTMEPS);
                let NPG = Math.round(defaultfactors.NPG);
                let EPSG = Math.round(defaultfactors.EPSG);
                let EPSF = parseFloat((NPG/EPSG).toFixed(2));
                let ROETTM = Math.round((defaultfactors.ROE/defaultfactors.DEBT)*100);
                let DFP = parseFloat((4.5).toFixed(2));
                let IRDF = parseFloat((3).toFixed(2));
                let EMHB = Math.round((ROETTM*2*((1/IRDF)/(1/DFP))));
                let EMLB = Math.round((ROETTM*0.5*((1/IRDF)/(1/DFP))));

                this.setState({
                    defaultfactors : {
                        TTMEPS,NPG,EPSG,EPSF,ROETTM,DFP,IRDF,EMHB,EMLB
                    }
                })
            }
            else
            {
                console.log('Faliure');
            }
            
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    render() {

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
        
        if(this.props.stockData)
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
                                        <div className="price__decimals">
                                            <AnimatedDigit number={dPrice} size={30}/>
                                        </div>
                                        <div className="price__fraction">
                                            <AnimatedDigit number={fPrice} size={30}/>  
                                        </div>
                                        <div className="stock__purchase">
                                            <div className="buy__stock"><img src={PlusIcon} alt=""/></div>
                                            <div className="sell__stock"><img src={MinusIcon} alt=""/></div>
                                        </div>
                                    </div>
                                    <div className="stock__price__change">
                                        <div className={priceClass +' stock__performance__amount'} >
                                            <AnimatedDigit number={stockData.change_price} size={18} digitMargin={-0.8}/>
                                        </div>
                                        <div className={priceClass +' stock__performance__percentage'} style={{display : 'flex'}}>
                                            (<AnimatedDigit number={stockData.change_percentage} size={18} digitMargin={-0.8}/>)

                                        </div>
                                    </div>
                                </div>
                                <div className="business__news__menu">
                                    <QuoteNav menuClass="business__menu" onClick={(i, e) => this.setState({ field: e.target.dataset.field?.toLowerCase()?.replace(/ /g, '') })} activeClassName="active-nav-0">
                                        <div active={field === 'overview'} data-field="overview">Overview</div>
                                        <div active={field === 'financials'} data-field="financials">Financials</div>
                                        <div data-field="valuation">Valuation</div>
                                        <div active={field === 'technicals'} data-field="technicals">Technicals<span style={{fontSize:"12px"}}> (AI & ML)</span></div>
                                        <div data-field="feed">Feed</div>
                                    </QuoteNav>
                                </div>
                                <div className="bn__close" onClick={this.props.closeNews}>
                                    <img src={Close} alt="x"/>    
                                </div>
                            </div>
    
                            {this.props.snapdata ? 
                                
                                <div className="business__news__box">
                                    {field === 'overview' && <Overview 
                                        stockDetails={this.props.stockDetails}
                                        snapdata={this.props.snapdata}
                                    />}
                                    {field === 'financials' && <Financials stockDetails={this.props.stockDetails}/>}
                                    {field === 'valuation' && <Valuation 
                                        defaultfactors={this.state.defaultfactors}
                                        currentprice={TradePrice}
                                    />}
                                    {field === 'technicals' && <Technicals 
                                        technicals = {this.state.technicals}
                                    />}
                                    {field === 'feed' && <Feed />}
                                </div>
                                :
                                <div className="business__news__box__loader">
                                    <Pulse />
                                    <p>Loading Business News...</p>
                                </div>
                            
                            }
    
                    </div>
                </>
            )
        }
        else
        {
            return <div className="business__container__loader">
                <Pulse />
                <p>Loading Business News...</p>
            </div>;
        }
    }
}

export { BusinessNews }