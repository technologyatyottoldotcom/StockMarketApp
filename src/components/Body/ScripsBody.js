import React from 'react';
import Axios from 'axios';
import $ from 'jquery';
import Close from '../../assets/icons/close.svg';
import CashPosition from './CashPosition';
import ChartContainer from './ChartContainer';
import KeyStatistics from './KeyStatistics';
import StocksToWatch from './StocksToWatch';
import TopStocks from './TopStocks';
import Spinner from '../Loader/Spinner';
import Portfolios from './MenuSection/Portfolios';
import Orders from './MenuSection/Orders';
import SmallCase from './MenuSection/SmallCase';
import Research from './MenuSection/Research';
import Exit from './MenuSection/Exit';
import { timeParse } from "d3-time-format";
import MSFTArray from '../../data/MSFT';
import { BusinessNews } from './BusinessNews/BusinessNews';
import {readMarketData} from '../../exports/FormatData';
import '../../css/BusinessNews.css';
import '../../css/MenuSection.css';
import 'rsuite/dist/styles/rsuite-default.css';



const REQUEST_BASE_URL = process.env.REQUEST_BASE_URL || 'localhost';

console.log(REQUEST_BASE_URL);

class ScripsBody extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        this.state = {
            chartdata : null,
            stockData : '',
            tempData : '',
            stockDetails : this.props.stockDetails,
            oldStockDetails : this.props.stockDetails,
            snapdata : null,
            isLoaded : false,
            endpoint : 'wss://masterswift-beta.mastertrust.co.in/hydrasocket/v2/websocket?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8',
            ws : null,
            FeedConnection : false
        }

        this.SnapShotRequest = this.SnapShotRequest.bind(this);
    }

    componentDidMount()
    {
        this.makeSocketConnection()
        .then(()=>{
            this.loadChartData();
            this.checkConnection();
            this.SnapShotRequest(this.state.stockDetails.stockSymbol,this.state.stockDetails.stockNSECode,this.state.stockDetails.stockBSECode,this.state.stockDetails.stockExchange.exchange);
        });
        
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockDetails.stockCode !== this.props.stockDetails.stockCode)
        {
            console.log('props update : ',this.props.stockDetails.stockCode);
            this.setState({
                stockDetails : this.props.stockDetails,
                oldStockDetails : this.state.stockDetails,
                isLoaded : false
            },()=>{
                this.loadChartData();
                this.checkConnection();
                this.SnapShotRequest(this.state.stockDetails.stockSymbol,this.state.stockDetails.stockNSECode,this.state.stockDetails.stockBSECode,this.state.stockDetails.stockExchange.exchange);

            });
            
        }
    }

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
                this.feedLiveData(this.state.ws);
            }
        });     
       
    }

    feedLiveData(ws)
    {

        console.log(this.state);
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

            // console.log(response.data);
            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                if(this.state.stockData)
                {
                    convertedData = readMarketData(data,this.state.stockData.close_price);
                }
                else
                {
                    convertedData = readMarketData(data,-1);
                }
                // console.log(convertedData.last_traded_price);
                //get price change

                this.setState({
                    stockData : convertedData
                })
            }
        }
    }

    async loadChartData()
    {

        Axios.get(`https://mastertrust-charts.tradelab.in/api/v1/charts?exchange=${this.props.stockDetails.stockExchange.exchange}&token=${this.props.stockDetails.stockCode}&candletype=1&starttime=1617235200&endtime=1632583718&data_duration=1`)
        .then(res=>{
            const data = res.data;
            console.log(data);
            if(data.status === 'success')
            {
                
                let stockArray = data.data.candles;
                let tempDataArray = [];
                // console.log(stockArray);
                stockArray.forEach(d =>{
                    let dobj = {
                        date : new Date(d[0]),
                        open : parseFloat(d[1]),
                        high : parseFloat(d[2]),
                        low : parseFloat(d[3]),
                        close : parseFloat(d[4]),
                        volume : parseInt(d[5])
                    }

                    tempDataArray.push(dobj);

                });

                // console.log(tempDataArray);
                this.setState({
                    chartdata : tempDataArray,
                    isLoaded : true
                })
            }

            // console.log('chart data');
            
        })
    } 

    SnapShotRequest(stockSymbol,stockNSECode,stockBSECode,stockExchange)
    {
        Axios.get(`http://${REQUEST_BASE_URL}:8000/detailed_view/snapshot/${stockSymbol}/${stockNSECode}/${stockBSECode}/${stockExchange}`,{ crossDomain: true }).then(({ data }) => {
            if (data.code === 900 || data.msg === 'success' && data.data) {
                console.log('data = ', data)
                this.setState({ error: null, snapdata: data.data })
            } else {
                this.setState({  error: data.msg })
            }
        }).catch(e => {
            this.setState({  error: e.message })
        })
    }

    

    openNews()
    {
        $('.business__news__section').css('transform','translateY(0%)');
        $('.bn__close').addClass('active');
    }

    closeNews()
    {
        $('.business__news__section').css('transform','translateY(100%)');
        $('.bn__close').removeClass('active');
    }

    

    render()
    {

        // console.log('Rendering ScripsBody ...');

        let activeElement = this.props.active?.toLowerCase().replace(/ /g, '');


        if(this.state.chartdata)
        {

            return <div className="app__body">

                <div className="app__body__top">
                    <TopStocks ws={this.state.ws}/>
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
                            data={this.state.chartdata} 
                            stockData={this.state.stockData} 
                            stockDetails={this.state.stockDetails}
                            isLoaded={this.state.isLoaded}
                        />
                        <StocksToWatch />
                        <KeyStatistics stockData={this.state.stockData} snapdata={this.state.snapdata}/>
                    </div>
                    <div className="app__body__right">
                        <CashPosition />
                    </div>
                </div>

            </div>
           

        }
        else
        {
            return <Spinner size={50}/>
        }
    }
}

export default ScripsBody;
