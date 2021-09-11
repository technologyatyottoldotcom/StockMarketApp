import React from 'react';
import $ from 'jquery';
import StockOrderSearch from './StockOrderSearch';
import AnimatedDigit from '../../AnimatedDigit';
import CustomSelect from '../../CustomChartComponents/CustomSelect/CustomSelect';
import CustomInfiniteSelect from '../../CustomChartComponents/CustomInfiniteSelect/CustomInfiniteSelect';
import CustomNumberBox from '../../CustomChartComponents/CustomNumberBox/CustomNumberBox';
import Pulse from '../../../Loader/Pulse';
import SearchIcon from '../../../../assets/icons/stocksearch.svg';
import CloseIcon from '../../../../assets/icons/closeicon.svg';
import '../../../../css/StockOrderPopup.css';
import { readMarketData } from '../../../../exports/FormatData';

const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;

class StockOrderPopup extends React.PureComponent {


    constructor(props)
    {
        super(props);
        this.state = {
            stockDetails : this.props.stockDetails,
            actiontype : this.props.action,
            ordertype : 'LIMIT',
            searchopen : false,
            stockdataloaded : false,
            stockData : '',
            orderprice : '',
            defaultprice : false,
            orderpricechange : 0,
            valuechanged : false,
            stopupdate : false,
            syncactive : true,
            ws : null,
        }

        this.loadOrder = this.loadOrder.bind(this);
        this.openSearchBox = this.openSearchBox.bind(this);
        this.closeSearchBox = this.closeSearchBox.bind(this);
        this.feedLiveData = this.feedLiveData.bind(this);
        this.orderTypeChange = this.orderTypeChange.bind(this);
        this.actionTypeChange = this.actionTypeChange.bind(this);
        this.setOrderPrice = this.setOrderPrice.bind(this);
        this.setChangePrice = this.setChangePrice.bind(this);
        this.setDefaultOrderPrice = this.setDefaultOrderPrice.bind(this);
        this.SyncLiveData = this.SyncLiveData.bind(this);
        this.setUpdateFlag = this.setUpdateFlag.bind(this);
        this.selectedStock = this.selectedStock.bind(this);
    }

    componentDidMount()
    {
        this.loadOrder();
    }

    loadOrder()
    {
        this.setState({
            stockdataloaded : false
        },()=>{
            this.closeSearchBox();
            this.makeSocketConnection()
            .then(()=>{
                this.checkConnection();
            });  
        })
    }

    feedLiveData(ws)
    {

        const {oldstockDetails,stockDetails} = this.state;

        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[stockDetails.stockExchange.code, stockDetails.stockCode]], 
            "m": "marketdata"}
        ));

        ws.onmessage = (response)=>{

            
            const {actiontype,valuechanged,stopupdate} = this.state;
            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                if(response.data.size >= 86)
                {
                    let convertedData = readMarketData(data,-1);

                    // console.log(convertedData);
                    let stockdata = convertedData.livedata;
                    let orderprice = actiontype === 'BUY' ? parseFloat(stockdata.best_ask_price).toFixed(2) : parseFloat(stockdata.best_bid_price).toFixed(2);
                    this.setState((prevState)=>(
                        {
                            stockData : stockdata,
                            orderprice : valuechanged || stopupdate ? prevState.orderprice : orderprice,
                            stockdataloaded : true
                        }
                    ));
                }
            }
        }

        setInterval(()=>{
            ws.send(JSON.stringify({
                "a": "h", 
                "v": [[stockDetails.stockExchange.code, stockDetails.stockExchange.stockCode]], 
                "m": ""}
            ));
        },10*1000);
    }

    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(LIVEFEED_BASE_URL);
            ws.onopen = ()=>{
                // console.log('connection done');
                this.setState({
                    ws : ws,
                    FeedConnection : true
                });
                resolve(ws)
            }
            ws.onerror = ()=>{
                console.log('Connection Error');
                this.setState({
                    ws : null,
                    FeedConnection : false
                })
            }
        })

    }

    checkConnection()
    {
        if(this.state.FeedConnection)
        {
            this.feedLiveData(this.state.ws);
        }
       
    }

    openSearchBox()
    {
        $('.stock__order__options__wrapper').addClass('active');
        $('.stock__order__search__wrapper').addClass('active');
        this.setState({
            searchopen : true
        });
    }

    closeSearchBox()
    {
        
        $('.stock__order__options__wrapper').removeClass('active');
        setTimeout(()=>{
            $('.stock__order__search__wrapper').removeClass('active');
            this.setState({
                searchopen : false
            });
        },500)
    }

    orderTypeChange(type)
    {
        this.setState({
            ordertype : type,
            syncactive : true,
            defaultprice : false,
            orderpricechange : 0,
            valuechanged : false,
            stopupdate : false
        })
    }

    actionTypeChange(type)
    {
        this.setState({
            actiontype : type,
            syncactive : true,
            defaultprice : false,
            orderpricechange : 0,
            valuechanged : false,
            stopupdate : false
        })
    }

    setOrderPrice(price)
    {
        const {defaultprice} = this.state;
        const change = Math.round(parseFloat(price) - parseFloat(defaultprice));
        this.setState({
            orderprice : price,
            orderpricechange  :change,
            valuechanged : true,
            syncactive : false
        });
    }

    setChangePrice(change)
    {
        const {defaultprice} = this.state;

        // console.log(orderprice)
        let valchange = (change === '' || change === '-') ? 0 : change;

        let newprice = (parseFloat(defaultprice) + parseFloat(valchange)).toFixed(2);

        this.setState({
            orderprice : newprice,
            orderpricechange  : change,
            valuechanged : true,
            syncactive : false
        })

    }

    setDefaultOrderPrice()
    {

        console.log(this.state.defaultprice);
        this.setState({
            defaultprice : this.state.defaultprice ? this.state.defaultprice : this.state.orderprice,
            stopupdate : true
        },()=>{
            console.log('DEFAULT PRICE',this.state.defaultprice)
        });
    }

    setUpdateFlag()
    {
        const {valuechanged,orderpricechange} = this.state;
        this.setState({
            stopupdate : false,
            defaultprice : valuechanged ? this.state.defaultprice : this.state.orderprice ,
            orderpricechange : orderpricechange === '' ? 0 : orderpricechange 
        });
    }

    SyncLiveData()
    {
        this.setState({
            orderpricechange : 0,
            valuechanged : false,
            stopupdate : false,
            defaultprice : false,
            syncactive : true
        })
    }

    selectedStock(data)
    {
      let StockCode = data.code;

      const {ws,stockDetails} = this.state;

      if(ws)
      {
        ws.send(JSON.stringify({
            "a": "unsubscribe", 
            "v": [[stockDetails.stockExchange.code, stockDetails.stockCode]], 
            "m": "marketdata"}
        ));
      }

      if(StockCode && typeof StockCode === 'string' && StockCode!== '')
      {
        this.setState({
            stockDetails : {
              stockISIN : data.isin,
              stockCode : parseInt(StockCode),
              stockSymbol : data.ric_code,
              stockName : data.name,
              stockNSECode : data.nse_code,
              stockBSECode : data.bse_code,
              stockExchange : data.exchange,
              stockIndustry : data.industry
            }
            
        },()=>{
            this.loadOrder();
        });
      }
    }


    render() {
        

        const {stockDetails,actiontype,searchopen,ordertype,orderprice,orderpricechange,syncactive,stockData,stockdataloaded} = this.state;
        let bestbid,bestask,bestdiff;

        // console.log(orderprice,orderpricechange)

        // console.log(stockDetails)

        let exchange = stockDetails.stockExchange.exchange;

        let stockName = exchange === 'NSE' ? stockDetails.stockNSECode : stockDetails.stockBSECode; 

        if(stockdataloaded)
        {
            // console.log(stockData);
            bestask = parseFloat(stockData.best_ask_price).toFixed(2);
            bestbid = parseFloat(stockData.best_bid_price).toFixed(2);
            bestdiff = parseFloat(Math.abs(bestask-bestbid)).toFixed(2);
        }

        return (
            <div className="stock__order__popup">
                <div className="stock__order__header">
                    <div className="stock__order__action__wrapper">
                        <div className={actiontype === 'BUY' ? "stock__order__action buy" : "stock__order__action sell"}>
                            <p>{actiontype.toUpperCase()}</p>
                        </div>
                    </div>
                    {!searchopen && 
                        <div className="stock__order__name__wrapper">
                            <p>
                                <span>{stockName}</span>
                                <span> : </span>
                                <span>{exchange}</span>
                            </p>
                        </div>
                    }

                    <div className="stock__order__options__wrapper">
                        <div className="stock__order__search__wrapper">
                            {searchopen ? 
                                
                                <StockOrderSearch closeSearchBox={this.closeSearchBox} selectedStock={this.selectedStock}/>
                                :
                                <div className="stock__order__search" onClick={()=> this.openSearchBox()}>
                                    <img src={SearchIcon} alt=""/>
                                </div>
                            
                            }
                        </div>

                        <div className="stock__order__close__wrapper">
                            <div className="stock__order__close" onClick={()=> {this.props.CloseOprderPopup()}}>
                                <img src={CloseIcon} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                {stockdataloaded ? 
                
                    <>
                        <div className="stock__order__container">
                        <div className="stock__order__buysell__section">
                            <div className={actiontype === 'BUY' ? "stock__order__buy__wrapper active" : "stock__order__buy__wrapper"} 
                                onClick={()=>{this.actionTypeChange('BUY')}}>
                                <p className="stock__order__title">BUY</p>
                                <p className="stock__order__ask" style={{display : 'flex'}}>
                                    {bestask &&
                                        bestask.split('').map((n,i) => {
                                            return <AnimatedDigit 
                                                digit={n} 
                                                key={i}
                                                size={28}
                                            />
                                        })}
                                    </p>
                            </div>
                            <div className={actiontype === 'SELL' ? "stock__order__sell__wrapper active" : "stock__order__sell__wrapper"}
                                onClick={()=>{this.actionTypeChange('SELL')}}>
                                <p className="stock__order__title">SELL</p>
                                <p className="stock__order__bid" style={{display : 'flex'}}>
                                    {bestbid &&
                                        bestbid.split('').map((n,i) => {
                                            return <AnimatedDigit 
                                                digit={n} 
                                                key={i}
                                                size={28}
                                            />
                                        })}
                                </p>
                            </div>
                            <div className="stock__order__difference__wrapper">
                                <span style={{display : 'flex'}}>{bestdiff &&
                                        bestdiff.split('').map((n,i) => {
                                            return <AnimatedDigit 
                                                digit={n} 
                                                key={i}
                                                size={12}
                                            />
                                        })}</span>
                            </div>
                        </div>
                        <div className="stock__order__config__wrapper">
                            <div className="stock__order__config stock__order__type__section">
                                <div className="stock__order__config__header">
                                    <p>Order Type</p>
                                    <span></span>
                                </div>
                                <CustomSelect 
                                    width={450} 
                                    height={40} 
                                    options={['MARKET','LIMIT','STOP']} 
                                    defaultIndex={1}
                                    onTypeChange={(type)=>{this.orderTypeChange(type)}}
                                />
                            </div>
                            {ordertype === 'LIMIT' || ordertype === 'STOP' ? 
                                
                                <div className="stock__order__config" style={{display : 'flex', justifyContent : 'space-between', width : '450px'}}>
                                    <div className="stock__order__type__section">
                                        <div className="stock__order__config__header">
                                            <p>Order Price</p>
                                            <span></span>
                                        </div>
                                        <CustomInfiniteSelect 
                                            width={210} 
                                            height={40} 
                                            sync={true}
                                            syncactive={syncactive}
                                            basevalue={orderprice}
                                            twoways={true}
                                            steps={1}
                                            precision={2}
                                            setDefaultOrderPrice={this.setDefaultOrderPrice}
                                            SyncLiveData={this.SyncLiveData}
                                            setUpdateFlag={this.setUpdateFlag}
                                            onValueChange={(price)=>{this.setOrderPrice(price)}}
                                        />
                                    </div>
                                    <div className="stock__order__type__section">
                                        <div className="stock__order__config__header">
                                            <p>Order Price</p>
                                            <span></span>
                                        </div>
                                        <CustomInfiniteSelect 
                                            width={210} 
                                            height={40} 
                                            sync={false}
                                            syncactive={syncactive}
                                            basevalue={orderpricechange}
                                            twoways={true}
                                            steps={1}
                                            precision={0}
                                            sidetext={actiontype === 'BUY' ? "ASK" : "BID"}
                                            setDefaultOrderPrice={this.setDefaultOrderPrice}
                                            SyncLiveData={this.SyncLiveData}
                                            setUpdateFlag={this.setUpdateFlag}
                                            onValueChange={(change)=>{this.setChangePrice(change)}}
                                        />
                                    </div>
                                </div>
                                
                                :
                                null
                                
                            }
                            <div className="stock__order__config stock__order__quantity__section">
                                <div className="stock__order__config__header">
                                    <p>Quantity</p>
                                    <span>Units</span>
                                </div>
                                <CustomNumberBox 
                                    width={450} 
                                    height={40} 
                                    subtype="calculator"
                                    onChangeValue={()=>{}}
                                />
                            </div>
                            <div className="stock__order__config stock__order__type__section">
                                <div className="stock__order__config__header">
                                    <p>Trade Value</p>
                                    <span>INR</span>
                                </div>
                                <div className="stock__order__config__label" style={{width : '450px' , height : '40px'}}>
                                    <p>50,637</p>
                                </div>
                            </div>
                            <div className="stock__order__config stock__order__type__section">
                                <div className="stock__order__config__header">
                                    <p>Net Cash Value</p>
                                    <span>INR</span>
                                </div>
                                <div className="stock__order__config__label" style={{width : '450px' , height : '40px'}}>
                                    <p>1,02,200</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="stock__order__footer">
                        <div className={actiontype == 'BUY' ? "stock__order__buysell__button buy" : "stock__order__buysell__button sell"}>
                            <span>{actiontype.toUpperCase()}</span>
                        </div>
                    </div>
                    </>

                :

                <>  
                    <div className="stock__order__container loader">
                        <Pulse />
                    </div>
                </>

                }
            </div>
        )
    }
}

export default StockOrderPopup;
