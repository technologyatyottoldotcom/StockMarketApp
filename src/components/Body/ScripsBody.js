import React from 'react';
import Axios from 'axios';
import $ from 'jquery';
import ScripsFooter from '../Footer/ScripsFooter';
import Close from '../../assets/icons/close.svg';
import CashPosition from './CashPosition/CashPosition';
import ChartContainer from './ChartContainer';
import KeyStatistics from './KeyStatistics/KeyStatistics';
import StocksToWatch from './StocksToWatch/StocksToWatch';
import TopStocks from './TopStocks/TopStocks';
import Spinner from '../Loader/Spinner';
import Portfolios from './MenuSection/Portfolios';
import Orders from './MenuSection/Orders';
import SmallCase from './MenuSection/SmallCase';
import Research from './MenuSection/Research';
import Exit from './MenuSection/Exit';
import { BusinessNews } from './BusinessNews/BusinessNews';
import {readMarketData,readMarketStatus,setChange} from '../../exports/FormatData';
import { setStockColor,getStockColor } from '../../exports/ChartColors';
import Logout from '../../assets/icons/logout.svg';
import '../../css/BusinessNews.css';
import '../../css/MenuSection.css';
import '../../css/CustomChartComponents.css';
import 'rsuite/dist/styles/rsuite-default.css';



const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;



class ScripsBody extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        this.state = {
            chartdata : null,
            bigchartdata : null,
            chartProps : null,
            stockData : '',
            stockDetails : this.props.stockDetails,
            oldStockDetails : this.props.stockDetails,
            snapdata : null,
            isLoaded : false,
            dataLoaded : false,
            bigdataLoaded : false,
            limitFlag : false,
            range : 'D',
            endpoint : 'wss://masterswift-beta.mastertrust.co.in/hydrasocket/v2/websocket?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8',
            ws : null,
            FeedConnection : false,
            CompareStockConfig : [],
            NewCompareStockConfig : {},
            OldCompareStockConfig : {},
        }

        this.SnapShotRequest = this.SnapShotRequest.bind(this);
        this.setRange = this.setRange.bind(this);
        this.compareStock = this.compareStock.bind(this);
        this.toggleHide = this.toggleHide.bind(this);
        this.removeStock = this.removeStock.bind(this);
        // this.appendRandomData = this.appendRandomData.bind(this);
    }

    componentDidMount()
    {
        this.makeSocketConnection()
        .then(()=>{
            this.checkConnection();
            this.SnapShotRequest(this.state.stockDetails.stockSymbol,this.state.stockDetails.stockNSECode,this.state.stockDetails.stockBSECode,this.state.stockDetails.stockExchange.exchange);
        });
        
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockDetails.stockCode !== this.props.stockDetails.stockCode)
        {
            
            this.setState({
                stockDetails : this.props.stockDetails,
                oldStockDetails : this.state.stockDetails,
                stockData : '',
                chartdata : null,
                bigchartdata : null,
                isLoaded : false,
            },()=>{
                
                this.checkConnection();
                this.SnapShotRequest(this.state.stockDetails.stockSymbol,this.state.stockDetails.stockNSECode,this.state.stockDetails.stockBSECode,this.state.stockDetails.stockExchange.exchange);

            });
            
        }
    }

    /*<--- Live Data Feed Methods --->*/
    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(this.state.endpoint);
            ws.onopen = ()=>{
                console.log('connection done');
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
        console.log('connection : ',this.props.stockDetails.stockCode);
        this.setState({
            stockCode : this.props.stockDetails.stockCode,
            stockSymbol : this.props.stockDetails.stockSymbol
        },()=>{
            if(this.state.FeedConnection)
            {
                //check if market is open or not
                console.log('Check Market Status');
                // this.isMarketOpen(this.state.ws);
                this.feedLiveData(this.state.ws);
            }
        });     
       
    }

    feedLiveData(ws)
    {

        // console.log(this.state);
        if(this.state.oldStockDetails.stockCode)
        {
            console.log('unsubscribe ',this.state.oldStockDetails.stockCode);
            ws.send(JSON.stringify({
                "a": "unsubscribe", 
                "v": [[this.state.oldStockDetails.stockExchange.code, this.state.oldStockDetails.stockCode]], 
                "m": "marketdata"}
            ))
        }
        console.log('subscribe',this.state.stockDetails.stockCode);
        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[this.state.stockDetails.stockExchange.code, this.state.stockDetails.stockCode]], 
            "m": "marketdata"}
        ));

        ws.onmessage = (response)=>{

            // console.log(response);
            // console.log(response.data.size);
            // console.log('data');
            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                // console.log(data);

               
               

                //get price change
                if(response.data.size >= 86)
                {
                    if(this.state.stockData)
                    {
                        convertedData = readMarketData(data,this.state.stockData['close_price']);
                    }
                    else
                    {
                        convertedData = readMarketData(data,-1);
                    }
    
                    let livedata = convertedData.livedata;
                    this.setState({
                        stockData : livedata
                    });
                }
                else
                {
                    // console.log('---GET FROM DATABASE---');
                    let livedata = this.state.stockData;
                    let trade_price = this.state.stockData && this.state.stockData.last_traded_price;
                    let open_price = this.state.stockData && this.state.stockData.open_price;

                    const {change_price,change_percentage} = setChange(trade_price,open_price);

                    // livedata
                    livedata['change_price'] = change_price;
                    livedata['change_percentage'] = change_percentage;
                    // console.log(change_price,change_percentage);
                    // console.log(livedata);
                    this.setState({
                        stockData : livedata
                    });
                }
            }
        }

       

    }


    

    /*<--- Snap Shot Request Methods --->*/
    SnapShotRequest(stockSymbol,stockNSECode,stockBSECode,stockExchange)
    {

        console.log('SNAP SHOT')

        Axios.get(`${REQUEST_BASE_URL}/detailed_view/snapshot/${stockSymbol}/${stockNSECode}/${stockBSECode}/${stockExchange}`,{ crossDomain: true }).then(({ data }) => {
            console.log('data = ', data)
            if (data.code === 900 || data.msg === 'success' && data.data) {
                this.setState({ error: null, snapdata: data.data })
            } else {
                this.setState({  error: data.msg })
            }
        }).catch(e => {
            console.log(e.message);
            this.setState({  error: e.message })
        })
    }  

    /*<--- Other Supporting Methods --->*/
    isMarketOpen(ws)
    {
        //send market status request
        console.log('Market Status');
        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [1,2,3,4,6], 
            "m": "market_status"
        }));

        ws.onmessage = (response)=>{

            console.log('Got');
            console.log(response);
            console.log(response.data);
            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                console.log(data);
                convertedData = readMarketStatus(data);
                console.log(convertedData);
            }
        }

    }

    openNews()
    {
        $('.business__news__section').addClass('open');
        $('.business__news__content').css('display','block');
        $('.bn__close').addClass('active');
    }

    closeNews()
    {
        $('.business__news__section').removeClass('open');
        $('.bn__close').removeClass('active');
        setTimeout(()=>{
            $('.business__news__content').css('display','none');
        },1000)
    }

    setRange(range)
    {   
        this.setState({
            range : range            
        });
    }


    /*<--- Compare Functionality Methods --->*/
    compareStock(code,name,symbol,company,exchange)
    {
        console.log('COMPARE ----> ',symbol,code)
        let cc = this.state.CompareStockConfig;

        if(cc.length === 5)
        {
            this.setState({
                limitFlag : !this.state.limitFlag
            });
        }
        else
        {
            if(cc.filter((c)=>{return c.symbol === symbol && c.code == code}).length === 0)
            {
                // let color = getStockColor();
                let color = getStockColor();
                let hide = false;
                this.setState({
                    CompareStockConfig : [...this.state.CompareStockConfig,{
                    code,name,symbol,color,company,exchange,hide
                    }],
                    NewCompareStockConfig : {
                    code,name,symbol,color,company,exchange,hide
                    }
                },()=>{
                    console.log(this.state.CompareStockConfig);
                    console.log(this.state.NewCompareStockConfig);
                });
            }
        }
    }

    toggleHide(e,symbol)
    {

        console.log(symbol);
        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);

        console.log(indx);

        if(indx !== -1)
        {
            // console.log(indx);
            let TempConfig = [...CompareStockConfig];
            TempConfig[indx] = {...TempConfig[indx],hide : !TempConfig[indx].hide};

            console.log(TempConfig);

            this.setState({
                CompareStockConfig : TempConfig,
            })
        }
    }

    removeStock(e,symbol)
    {
        console.log(symbol);

        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);
        console.log(indx);
        if(indx !== -1)
        {
            // console.log(indx);
            let OldStock = CompareStockConfig[indx];
            setStockColor(OldStock.color);
            CompareStockConfig.splice(indx,1);
            console.log('Old Stock : ',OldStock);
            console.log(CompareStockConfig);

            this.setState({
                CompareStockConfig : CompareStockConfig,
                OldCompareStockConfig : OldStock
            })
        }
    }

    
    
    render()
    {
        // console.log('Rendering ScripsBody ...');

        let activeElement = this.props.active?.toLowerCase().replace(/ /g, '');


        if(!this.state.chartdata)
        {

            return <div className="app__body">

                <div className="app__body__top">
                    <TopStocks />
                </div>
                <div className="app__body__bottom">
                    <div className="business__news__section">
                        <div className="business__news__wrapper">
                            <div className="bn__title">
                                <div>
                                    <p className="bn__stock__name">{this.state.stockDetails.stockSymbol}</p>
                                    <p className="bn__stock__fullname">{this.props.stockDetails.stockName}</p>
                                </div>
                                <div>
                                    <p onClick={this.openNews.bind(this)}>Detailed View</p>
                                    <div className="bn__close" onClick={this.closeNews.bind(this)}>
                                        <img src={Close} alt="x"/>    
                                    </div>
                                </div>
                            </div>
                            <div className="business__news__content">
                                <BusinessNews 
                                    stockDetails={this.state.stockDetails}
                                    stockData={this.state.stockData}
                                    snapdata={this.state.snapdata}   
                                />
                            </div>
                            
                        </div>
                        
                    </div>

                    <div className="app__body__footer">
                        <ScripsFooter />
                    </div>

                    <div className="app__body__logout">
                        <img src={Logout} alt="->"/>
                        <span>Logout</span>
                    </div>

                    {this.props.isActive &&
                        <div className="menu__section">
                            <div className="menu__section__wrapper">
                                
                                <div className="menu__section__close" onClick={()=> this.props.setActiveElement(null,false)}>
                                    <img src={Close} alt="x"/>    
                                </div>

                                <div className="menu__content">
                                    {activeElement === 'portfolios' && <Portfolios />}
                                    {activeElement === 'orders' && <Orders />}
                                    {activeElement === 'smallcase' && <SmallCase />}
                                    {activeElement === 'research' && <Research />}
                                    {activeElement === 'exit' && <Exit />}

                                </div>
                            </div>
                        </div>
                    }
                    <div className="app__body__left">
                        <ChartContainer 
                            // data={this.state.chartProps.chartdata}
                            // extradata={this.state.chartProps.extradata} 
                            stockData={this.state.stockData} 
                            stockDetails={this.state.stockDetails}
                            dataLoaded={this.state.dataLoaded}
                            setRange={this.setRange}
                            range={this.state.range}
                            compareStock={this.compareStock}
                            toggleHide={this.toggleHide}
                            removeStock={this.removeStock}
                            CompareStockConfig={this.state.CompareStockConfig}
                            NewCompareStockConfig={this.state.NewCompareStockConfig}
                            OldCompareStockConfig={this.state.OldCompareStockConfig}
                            limitFlag={this.state.limitFlag}

                        />
                        <StocksToWatch
                            stockISIN={this.state.stockDetails.stockISIN} 
                            stockIndustry={this.state.stockDetails.stockIndustry}
                            selectedStock={this.props.selectedStock}
                        />
                        <KeyStatistics 
                            stockData={this.state.stockData} 
                            snapdata={this.state.snapdata}
                            lastPoint={this.state.lastPoint}
                        />
                    </div>
                    <div className="app__body__right">
                        <CashPosition />
                    </div>
                </div>


            </div>
           

        }
        else
        {
            return <div className="app__body">
                <Spinner size={50}/>
            </div>
        }
    }
}

export default ScripsBody;
