import React from 'react';
import Axios from 'axios';
import $ from 'jquery';
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
import {readMarketData,readMarketStatus} from '../../exports/FormatData';
import {getCandleDuration} from '../../exports/MessageStructure';
import {splitAdjustment} from '../../exports/SplitAdjustment';
import {getFuturePoints,getStartPointIndex,filterBigData} from '../../exports/FutureEntries';
import {convertToUNIX,dateToUNIX} from '../../exports/TimeConverter';
import '../../css/BusinessNews.css';
import '../../css/MenuSection.css';
import '../../css/CustomChartComponents.css';
import 'rsuite/dist/styles/rsuite-default.css';



const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;;

let updateInterval,bigdatainterval;


class ScripsBody extends React.PureComponent
{

    constructor(props)
    {
        super(props);
        this.state = {
            initial : true,
            chartdata : null,
            bigchartdata : null,
            chartProps : null,
            stockData : '',
            tempData : '',
            stockDetails : this.props.stockDetails,
            oldStockDetails : this.props.stockDetails,
            snapdata : null,
            isLoaded : false,
            dataLoaded : false,
            bigdataLoaded : false,
            range : 'D',
            endpoint : 'wss://masterswift-beta.mastertrust.co.in/hydrasocket/v2/websocket?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8',
            ws : null,
            FeedConnection : false
        }

        this.SnapShotRequest = this.SnapShotRequest.bind(this);
        this.setRange = this.setRange.bind(this);
        this.appendRandomData = this.appendRandomData.bind(this);
    }

    componentDidMount()
    {
        let options = getCandleDuration(this.state.range);
        this.makeSocketConnection()
        .then(()=>{
            this.loadChartData(this.state.range,options.candle,options.duration,options.mixed);
            this.loadBigChartData('MAX',3,1,true);
            this.checkConnection();
            this.SnapShotRequest(this.state.stockDetails.stockSymbol,this.state.stockDetails.stockNSECode,this.state.stockDetails.stockBSECode,this.state.stockDetails.stockExchange.exchange);
        });
        
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockDetails.stockCode !== this.props.stockDetails.stockCode)
        {
            let options = getCandleDuration(this.state.range);
            console.log('props update : ',this.props.stockDetails.stockCode);
            this.setState({
                stockDetails : this.props.stockDetails,
                oldStockDetails : this.state.stockDetails,
                stockData : '',
                isLoaded : false
            },()=>{
                this.loadChartData(this.state.range,options.candle,options.duration,options.mixed);
                this.loadBigChartData('MAX',3,1,true);
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
                if(this.state.stockData)
                {
                    convertedData = readMarketData(data,this.state.stockData.close_price);
                }
                else
                {
                    convertedData = readMarketData(data,-1);
                }

                let livedata = convertedData.livedata;

                //get price change
                if(response.data.size === convertedData.size)
                {
                    this.setState({
                        stockData : livedata
                    })
                }
            }
        }

       setInterval(()=>{
            //heartbeat message
            ws.send(JSON.stringify({
                "a": "h", 
                "v": [], 
                "m": ""
            }));
       },10000)

    }

    async loadChartData(type,ct,dd,mixed)   
    {

        this.setState({
            dataLoaded : false,
        })

        let startUNIX = convertToUNIX(type);

        let exchange = this.props.stockDetails.stockExchange.exchange;
        let code;

        if(exchange === 'NSE')
        {
            code = this.state.stockDetails.stockNSECode;
        }
        else if(exchange === 'BSE')
        {
            code = this.state.stockDetails.stockBSECode;
        }

        Axios.get(`http://${REQUEST_BASE_URL}:8000/stockdata`,{
            params : {
                'ct' : ct,
                'starttime' : startUNIX,
                'dd' : dd,
                'exchange' : exchange,
                'token' : this.state.stockDetails.stockCode,
                'code' : code,
                'mixed' : mixed,
                'type' : type
            }
        })
        .then(res=>{
            const data = res.data;
            // console.log(data);
            if(data.status === 'success')
            {
                
                let stockArray = data.data;
                // console.log(stockArray);
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

                // tempDataArray = splitAdjustment(tempDataArray);

                let lastPoint = tempDataArray[tempDataArray.length - 1];
                let firstPoint = tempDataArray[0];
                let startIndex = getStartPointIndex(tempDataArray,type,lastPoint,firstPoint);

                // console.log(startIndex);

                let futurePoints = getFuturePoints(lastPoint,type);
                // console.log(futurePoints);
                // mergedData = mergedData.concat(futurePoints);


                this.setState({
                    chartdata : tempDataArray,
                    isLoaded : true,
                    dataLoaded : true,
                    chartProps : {
                        chartdata : tempDataArray,
                        extradata : futurePoints,
                        lastPoint : lastPoint,
                        startIndex : startIndex,
                        extraPoints : futurePoints.length,
                        range : type
                    }
                },()=>{
                    this.updateChartData(type,ct,dd,mixed);
                    // this.appendRandomData(type);
                })
            }

            // console.log('chart data');

            //make an interval to update data points
            
            
        })
    } 

    async updateChartData(type,ct,dd,mixed)
    {

        updateInterval = setInterval(()=>{

            let lastPoint = this.state.chartProps.lastPoint;
            let startUNIX = dateToUNIX(lastPoint.date,type);

            // console.log(lastPoint.date,lastPoint.open);

            // console.log(startUNIX,type,ct,dd);

            let exchange = this.props.stockDetails.stockExchange.exchange;
            let code;

            if(exchange === 'NSE')
            {
                code = this.state.stockDetails.stockNSECode;
            }
            else if(exchange === 'BSE')
            {
                code = this.state.stockDetails.stockBSECode;
            }

            // console.log(ct,dd);

            Axios.get(`http://${REQUEST_BASE_URL}:8000/stockdata`,{
                params : {
                    'ct' : ct,
                    'starttime' : startUNIX,
                    'dd' : dd,
                    'exchange' : exchange,
                    'token' : this.state.stockDetails.stockCode,
                    'code' : code,
                    'mixed' : mixed,
                    'type' : type
                }
            })
            .then(res=>{
                const data = res.data;
                if(data.status === 'success')
                {
                    
                    let stockArray = data.data;
                    // console.log(stockArray);
                    if(stockArray.length > 0)
                    {
                        let tempDataArray = this.state.chartProps.chartdata;
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

                            // console.log(dobj.date,dobj.open);

                            tempDataArray.push(dobj);

                        });

                        // console.log(tempDataArray);
                        let lastPoint = tempDataArray[tempDataArray.length - 1];
                        // console.log(lastPoint);
                        let firstPoint = tempDataArray[0];
                        let startIndex = getStartPointIndex(tempDataArray,type,lastPoint,firstPoint);

                        // console.log(startIndex);

                        let futurePoints = getFuturePoints(lastPoint,type);
                        // console.log(futurePoints);
                        // mergedData = mergedData.concat(futurePoints);


                        this.setState({
                            initial : false,
                            chartdata : tempDataArray,
                            isLoaded : true,
                            dataLoaded : true,
                            chartProps : {
                                chartdata : tempDataArray,
                                extradata : futurePoints,
                                lastPoint : lastPoint,
                                startIndex : startIndex,
                                extraPoints : futurePoints.length,
                                range : type
                            }
                        },()=>{
                            // console.log('add new point')
                        })
                    }
                    else
                    {
                        console.log('Wait');
                    }
                }

                // console.log('chart data');

                //make an interval to update data points
                
                
            })
        },5000)

    }

    loadBigChartData(type,ct,dd,mixed)
    {
        this.setState({
            bigdataLoaded : false
        })

        let startUNIX = convertToUNIX(type);

        console.log(startUNIX,type,ct,dd);

        let exchange = this.props.stockDetails.stockExchange.exchange;
        let code;

        if(exchange === 'NSE')
        {
            code = this.state.stockDetails.stockNSECode;
        }
        else if(exchange === 'BSE')
        {
            code = this.state.stockDetails.stockBSECode;
        }

        Axios.get(`http://${REQUEST_BASE_URL}:8000/stockdata`,{
            params : {
                'ct' : ct,
                'starttime' : startUNIX,
                'dd' : dd,
                'exchange' : exchange,
                'token' : this.state.stockDetails.stockCode,
                'code' : code,
                'mixed' : mixed,
                'type' : type
            }
        })
        .then(res=>{
            const data = res.data;
            // console.log(data);
            if(data.status === 'success')
            {
                
                let stockArray = data.data;
                // console.log(stockArray);
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

                // tempDataArray = splitAdjustment(tempDataArray);

                this.setState({
                    bigdataLoaded : true,
                    bigchartdata : tempDataArray
                },()=>{
                    console.log('big data loaded ',tempDataArray.length)
                })
            }

           
            
            
        })
    }

    async loadBigChartConfig(type)
    {
        console.log('load big chart config');
        
        if(this.state.bigdataLoaded)
        {
            clearInterval(bigdatainterval);
            let tempDataArray = this.state.bigchartdata;
            let filteredData = filterBigData(tempDataArray,type);
            console.log('big data loaded ');
            console.log(filteredData.length);
            let lastPoint = filteredData[filteredData.length - 1];
            let firstPoint = filteredData[0];
            let startIndex = getStartPointIndex(filteredData,type,lastPoint,firstPoint);
            let futurePoints = getFuturePoints(lastPoint,type);
            this.setState({
                chartdata : filteredData,
                isLoaded : true,
                dataLoaded : true,
                chartProps : {
                    chartdata : filteredData,
                    extradata : futurePoints,
                    lastPoint : lastPoint,
                    startIndex : startIndex,
                    extraPoints : futurePoints.length,
                    range : type
                }
            })
        }
        
    }

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

    SnapShotRequest(stockSymbol,stockNSECode,stockBSECode,stockExchange)
    {
        Axios.get(`http://${REQUEST_BASE_URL}:8000/detailed_view/snapshot/${stockSymbol}/${stockNSECode}/${stockBSECode}/${stockExchange}`,{ crossDomain: true }).then(({ data }) => {
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

    setRange(range,mixed)
    {
        let options = getCandleDuration(range);
        console.log(options);
        clearInterval(updateInterval);
        if(range === '1Y' ||  range === '5Y' || range === 'MAX')
        {
            this.setState({
                dataLoaded : false
            });
            bigdatainterval = setInterval(()=>{
                this.loadBigChartConfig(range);
            },1000);
        }
        else
        {
            this.loadChartData(range,options.candle,options.duration,options.mixed)
            .then(()=>{
                this.setState({
                    range : range            
                });
            });
        }
        
    }

    appendRandomData = (type) => {
        updateInterval = setInterval(() => {
          
          let lastPoint = this.state.chartProps.lastPoint;
          console.log(lastPoint);
          let newdate = lastPoint;
          newdate.date.setTime(newdate.date.getTime() + (1*60*1000));
          // console.log(newdate.date);
          let dobj = {
              date : newdate.date,
              open : this.state.currentPrice,
              high : parseFloat(lastPoint.high),
              low : parseFloat(lastPoint.low),
              close : parseFloat(lastPoint.close + this.randomInteger(2,-2)),
              volume : parseInt(lastPoint.volume)
          }
          
          // console.log(dobj);
                  
                      
          let stockArray = this.state.chartProps.chartdata;
          let futurePoints = getFuturePoints(type,lastPoint);
          stockArray.push(dobj);
          // console.log(stockArray);
          if(stockArray.length > 0)
          {
                this.setState({
                    chartProps : {
                        chartdata : stockArray,
                        extradata : futurePoints,
                        lastPoint : lastPoint,
                        startIndex : 0,
                        extraPoints : futurePoints.length,
                        range : type
                    }
                });
                            
            }
        }, 10000);
      };

      randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    
    render()
    {
        // console.log('Rendering ScripsBody ...');

        let activeElement = this.props.active?.toLowerCase().replace(/ /g, '');


        if(this.state.chartdata)
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
                            initial={this.state.initial}
                            data={this.state.chartProps.chartdata}
                            extradata={this.state.chartProps.extradata} 
                            stockData={this.state.stockData} 
                            stockDetails={this.state.stockDetails}
                            isLoaded={this.state.isLoaded}
                            dataLoaded={this.state.dataLoaded}
                            chartProps={this.state.chartProps}
                            setRange={this.setRange}
                            range={this.state.range}
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
