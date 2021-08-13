import React from 'react';
import Axios from 'axios';
import $ from 'jquery';
import Spinner from '../../Loader/Spinner';
import Pulse from '../../Loader/Pulse';
import CreateSection from './CreateSection';
import Chevron from '../../../assets/icons/chevron.svg';
import '../../../css/StocksToWatch.css';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;;

const SVGIMG1 = {
    ChevronExpand: _ => {
        return (
            <svg style={{ transform: 'rotate(88deg)' }} xmlns="http://www.w3.org/2000/svg" width={25} height={20} fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
            </svg>
        )
    }
}

class StocksToWatch extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state={
            stockISIN : this.props.stockISIN,
            stockIndustry : this.props.stockIndustry,
            isLoading : true,
            stocks : [],
        }
        this.getStocksToWatch = this.getStocksToWatch.bind(this);
        this.getStockFromISIN = this.getStockFromISIN.bind(this);
    }

    componentDidMount()
    {
        this.getStocksToWatch(this.state.stockIndustry,this.state.stockISIN);
    }

    componentDidUpdate(prevProps)
    {
        // console.log(this.props,prevProps);
        if(this.props.stockISIN !== prevProps.stockISIN)
        {
            this.setState({
                stockISIN : this.props.stockISIN,
                stockIndustry : this.props.stockIndustry,
                isLoading : true
            },()=>{
                this.getStocksToWatch(this.state.stockIndustry,this.state.stockISIN);
            })
        }
    }

    getStocksToWatch(industry,isin) {
        Axios.get(`${REQUEST_BASE_URL}/stockstowatch/${industry}/${isin}/5`)
        .then(res=>{
            const data = res.data;
            // console.log(data.stocks);
            this.setState({
                isLoading : false,
                stocks : data.stocks
            })
        })
    }

    getStockFromISIN(isin)
    {
        console.log(isin);
        Axios.get(`${REQUEST_BASE_URL}/StockFromISIN/${isin}`)
        .then((res)=>{
            let data = res.data;
            if(!data.error)
            {
                console.log(data.stock);
                this.props.selectedStock(data.stock);
                
            }
        })
    }

    render() {

        const stocks = this.props.WatchStocks;
        if(stocks.length > 0)
        {
            return (
                <>
                    <div className="app__StocksToWatch">
                        <div className="app__StocksToWatch__header">
                            <div className="app__StocksToWatch__title">
                                People also watch
                            </div>
                            <div className="app__StocksToWatch__icon">
                                <span onClick={e => {$('.app__StocksToWatch__container').scrollLeft(
                                    $('.app__StocksToWatch__container').scrollLeft() - 140
                                )}}>
                                    <img src={Chevron} alt="<" />
                                </span>
                                <span style={{transform : 'rotateY(180deg)'}} onClick={e =>{$('.app__StocksToWatch__container').scrollLeft(
                                    $('.app__StocksToWatch__container').scrollLeft() + 140
                                )}}>
                                    <img src={Chevron} alt="<" />
                                </span>
                            </div>
                        </div>
    
    
                        <div className="app__StocksToWatch__container">
                            {stocks && stocks.map((s,i)=>{
                                return <CreateSection 
                                        key={i} 
                                        config={s}
                                        ISIN={s.ISIN} 
                                        name={s.Symbol} 
                                        fullName={s.Name} 
                                        changePer="+4.9%"
                                        loadStock={this.getStockFromISIN}
                                        ExchangeCode={parseInt(s.exchange_code)}
                                        StockCode={parseInt(s.code)}
                                        selectedStock={this.props.selectedStock}
                                />
                            })}
    
                        </div>
    
                    </div>
                </>
            )
        }
        else
        {
            return (
                <div className="app__StocksToWatch loader">
                    {/* <Spinner size={20}/> */}
                    <Pulse />
                </div>
            )
        }
    }
}

export default StocksToWatch;
