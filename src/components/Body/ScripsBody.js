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
import '../../css/MenuSection/MenuSection.css';
import '../../css/CustomChartComponents.css';
import 'rsuite/dist/styles/rsuite-default.css';



const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;




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
            zoom : false,
            isLoaded : false,
            dataLoaded : false,
            bigdataLoaded : false,
            limitFlag : false,
            StockSettingsOpen : false,
            compareSettingUpdateFlag : false,
            range : 'D',
            ws : null,
            FeedConnection : false,
            CompareStockConfig : [],
            WatchStocks : [],
            NewCompareStockConfig : {},
            OldCompareStockConfig : {},
            StockCompareSettings : {},
            DefaultCompareSettings : {},
            
        }

        this.SnapShotRequest = this.SnapShotRequest.bind(this);
        this.setRange = this.setRange.bind(this);
        this.compareStock = this.compareStock.bind(this);
        this.toggleHide = this.toggleHide.bind(this);
        this.toggleCompareSettings = this.toggleCompareSettings.bind(this);
        this.closeCompareSettings = this.closeCompareSettings.bind(this);
        this.saveCompareSettings = this.saveCompareSettings.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.closeNews = this.closeNews.bind(this);
        this.toggleZoom = this.toggleZoom.bind(this);
        // this.appendRandomData = this.appendRandomData.bind(this);
    }

    componentDidMount()
    {
        this.makeSocketConnection()
        .then(()=>{
            this.checkConnection();
            this.SnapShotRequest(this.state.stockDetails.stockSymbol,this.state.stockDetails.stockNSECode,this.state.stockDetails.stockBSECode,this.state.stockDetails.stockExchange.exchange);
            this.getStocksToWatch(this.state.stockDetails.stockIndustry,this.state.stockDetails.stockISIN);
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
                this.getStocksToWatch(this.state.stockDetails.stockIndustry,this.state.stockDetails.stockISIN);
            });
            
        }
    }

    getStocksToWatch(industry,isin) {

        console.log('GET')
        Axios.get(`${REQUEST_BASE_URL}/stockstowatch/${industry}/${isin}/15`)
        .then(res=>{
            const data = res.data;
            // console.log(data.stocks);
            this.setState({
                WatchStocks : data.stocks
            })
        })
    }

    /*<--- Live Data Feed Methods --->*/
    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(LIVEFEED_BASE_URL);
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
        // console.log('connection : ',this.props.stockDetails.stockCode);
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
        // console.log('subscribe',this.state.stockDetails.stockCode);
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
                // console.log(data)

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
                        let stockdata = convertedData.livedata;

                        if(stockdata.last_traded_price === stockdata.close_price)
                        {
                            let compare = stockdata.open_price === 0 ? stockdata.close_price : stockdata.open_price;
                            // console.log(compare)
                            const {change_price,change_percentage} = setChange(stockdata.last_traded_price,compare);

                            let livedata = stockdata;
                            livedata['change_price'] = change_price;
                            livedata['change_percentage'] = change_percentage;

                            convertedData = {
                                livedata
                            }
                        }
                    }
    
                    let livedata = convertedData.livedata;
                    this.setState({
                        stockData : livedata
                    });
                }
            }
        }

        setInterval(()=>{
            ws.send(JSON.stringify({
                "a": "h", 
                "v": [[this.state.stockDetails.stockExchange.code, this.state.stockDetails.stockCode]], 
                "m": ""}
            ));
        },10*1000)

       

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
        // $('.bn__close').addClass('active');
    }

    closeNews()
    {
        $('.business__news__section').removeClass('open');
        // $('.bn__close').removeClass('active');
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
    compareStock(code,name,symbol,stocksymbol,company,exchange)
    {
        console.log('COMPARE ----> ',symbol,code,stocksymbol)
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
                let config = {
                    color : color,
                    hide : hide,
                    charttype : 'line',
                    chartwidth : '2',
                    priceline : false,
                    pricelabel : true,
                    stocklabel : true
                }
                this.setState({
                    CompareStockConfig : [...this.state.CompareStockConfig,{
                        code,name,symbol,stocksymbol,color,company,exchange,hide,config
                    }],
                    NewCompareStockConfig : {
                        code,name,symbol,stocksymbol,color,company,exchange,hide,config
                    }
                },()=>{
                    // console.log(this.state.CompareStockConfig);
                    // console.log(this.state.NewCompareStockConfig);
                });
            }
        }
    }

    toggleHide(e,symbol)
    {

        // console.log(symbol);
        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);

        // console.log(indx);

        if(indx !== -1)
        {
            // console.log(indx);
            let TempConfig = [...CompareStockConfig];

            let StockConfig = TempConfig[indx];
            StockConfig['hide'] = !StockConfig['hide'];
            StockConfig['config']['hide'] = !StockConfig['config']['hide'];
            TempConfig[indx] = StockConfig;

            // console.log(TempConfig);

            this.setState({
                CompareStockConfig : TempConfig,
            })
        }
    }

    toggleCompareSettings(e,symbol)
    {
        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);

        if(indx !== -1)
        {
            // console.log(indx);
            let TempConfig = [...CompareStockConfig][indx];
            this.setState({
                StockSettingsOpen : true,
                StockCompareSettings : TempConfig,
            });
            $('.app__back__blur').addClass('active');
        }
    }

    

    closeCompareSettings(CompareConfig)
    {

        let symbol = CompareConfig.symbol;
        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);

        if(indx !== -1)
        {
            // console.log(indx);
            CompareStockConfig[indx] = CompareConfig;
            
            this.setState({
                CompareStockConfig,
                compareSettingUpdateFlag : !this.state.compareSettingUpdateFlag,
                StockSettingsOpen : false
            });

            // console.log(this.state.CompareStockConfig)
        }
        $('.app__back__blur').removeClass('active');

    }

    saveCompareSettings(CompareConfig)
    {
        let symbol = CompareConfig.symbol;
        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);

        if(indx !== -1)
        {
            // console.log(indx);
            CompareStockConfig[indx] = CompareConfig;
            
            this.setState({
                CompareStockConfig,
                compareSettingUpdateFlag : !this.state.compareSettingUpdateFlag
            });

            // console.log(this.state.CompareStockConfig)
        }

    }

   

    removeStock(e,symbol)
    {
        // console.log(symbol);

        let CompareStockConfig = this.state.CompareStockConfig;
        let indx = CompareStockConfig.findIndex((c)=> c.symbol === symbol);
        // console.log(indx);
        if(indx !== -1)
        {
            // console.log(indx);
            let OldStock = CompareStockConfig[indx];
            setStockColor(OldStock.color);
            CompareStockConfig.splice(indx,1);
            // console.log('Old Stock : ',OldStock);
            // console.log(CompareStockConfig);

            this.setState({
                CompareStockConfig : CompareStockConfig,
                OldCompareStockConfig : OldStock
            })
        }
    }

    toggleZoom(zoom)
    {
        this.setState({
            zoom : zoom
        });
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
                                </div>
                            </div>
                            <div className="business__news__content">
                                <BusinessNews 
                                    closeNews={this.closeNews}
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
                            stockData={this.state.stockData} 
                            stockDetails={this.state.stockDetails}
                            dataLoaded={this.state.dataLoaded}
                            setRange={this.setRange}
                            range={this.state.range}
                            compareStock={this.compareStock}
                            toggleHide={this.toggleHide}
                            toggleCompareSettings={this.toggleCompareSettings}
                            closeCompareSettings={this.closeCompareSettings}
                            saveCompareSettings={this.saveCompareSettings}
                            compareSettingUpdateFlag={this.state.compareSettingUpdateFlag}
                            removeStock={this.removeStock}
                            WatchStocks={this.state.WatchStocks}
                            CompareStockConfig={this.state.CompareStockConfig}
                            NewCompareStockConfig={this.state.NewCompareStockConfig}
                            OldCompareStockConfig={this.state.OldCompareStockConfig}
                            StockSettingsOpen={this.state.StockSettingsOpen}
                            StockCompareSettings={this.state.StockCompareSettings}
                            limitFlag={this.state.limitFlag}
                            selectedStock={this.props.selectedStock}
                            toggleZoom={this.toggleZoom}

                        />
                        <StocksToWatch
                            WatchStocks={this.state.WatchStocks}
                            stockISIN={this.state.stockDetails.stockISIN} 
                            stockIndustry={this.state.stockDetails.stockIndustry}
                            selectedStock={this.props.selectedStock}
                        />
                        <KeyStatistics 
                            zoom={this.state.zoom}
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
