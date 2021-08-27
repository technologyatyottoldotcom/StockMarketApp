import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import ChartClock from './ChartClock';
import AnimatedDigit from './AnimatedDigit';
import StockChart from './StockChart';
import Interactive from './Interactive';
import ComparePopup from './AppPopups/ComparePopup/ComparePopup';
import IndicatorPopup from './AppPopups/IndicatorPopup/IndicatorPopup';
import StockSearchPopup from './AppPopups/StockSearchPopup/StockSearchPopup';
import StockWatchPopup from './AppPopups/StockWatchPopup/StockWatchPopup';
import CompareSettingPopup from './AppPopups/CompareSettingPopup/CompareSettingPopup';
import IndicatorSettingPopup from './AppPopups/IndicatorSettingPopup/IndicatorSettingPopup';
import StockWatchHero from './AppPopups/StockWatchPopup/StockWatchHero';
import { Alert } from './CustomChartComponents/CustomAlert/CustomAlert';
import Zoom from '../../assets/icons/zoom.svg';
import Chevron from '../../assets/icons/ChevronDown.svg';
import Compare from '../../assets/icons/compare.svg';
import IndicatorIcon from '../../assets/icons/indicator.svg';
import CrossIcon from '../../assets/icons/crossicon.svg';
import Line from '../../assets/icons/chart-line.svg';
import Area from '../../assets/icons/area-chart.svg';
import Candles from '../../assets/icons/candle-chart.svg';
import Column from '../../assets/icons/column-chart.svg';
import JumpLine from '../../assets/icons/chart-jump.svg';
import Range from '../../assets/icons/chart-range.svg';
import OHLC from '../../assets/icons/ohlc-chart.svg';
import Marker from '../../assets/icons/chart-marker.svg';
import Stick from '../../assets/icons/stick-chart.svg';
import Renko from '../../assets/icons/renko.svg';
import Kagi from '../../assets/icons/kagi.svg';
import Point from '../../assets/icons/point.svg';
import SearchIcon from '../../assets/icons/searchCompare.svg';
import SettingIcon from '../../assets/icons/settings.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import MinusIcon from '../../assets/icons/minus.svg';
import LineSegment from '../../assets/icons/linesegment.svg';
import InfiniteLine from '../../assets/icons/infiniteline.svg';
import Ray from '../../assets/icons/ray.svg';
import FibRet from '../../assets/icons/fibonacciretracement.svg';
import GannFan from '../../assets/icons/gannfan.svg';
import Spinner from '../Loader/Spinner';
import Pulse from '../Loader/Pulse';
import {getCandleDuration} from '../../exports/MessageStructure';
import {getFuturePoints,getStartPointIndex,filterBigData} from '../../exports/FutureEntries';
import {convertToUNIX,dateToUNIX} from '../../exports/TimeConverter';
import { splitAdjustmentArray } from '../../exports/SplitAdjustment';
import Technicals from './BusinessNews/Technicals';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

let updateInterval,bigdatainterval;

export class ChartContainer extends React.PureComponent {


    constructor(props)
    {
        super(props);
        this.setInitialSize = this.setInitialSize.bind(this);
        this.CloseComparePopup = this.CloseComparePopup.bind(this);
        this.CloseIndicatorPopup = this.CloseIndicatorPopup.bind(this);
        this.CloseStockPopup = this.CloseStockPopup.bind(this);
        this.CloseStockWatchPopup = this.CloseStockWatchPopup.bind(this);
        this.ChangeIndicatorType = this.ChangeIndicatorType.bind(this);
        this.addCompareData = this.addCompareData.bind(this);
        this.removeCompareData = this.removeCompareData.bind(this);
        this.DeleteIndicatorType = this.DeleteIndicatorType.bind(this);
        this.SwapCharts = this.SwapCharts.bind(this);
        this.saveIndicatorSettings = this.saveIndicatorSettings.bind(this);
        this.toggleIndicatorSettings = this.toggleIndicatorSettings.bind(this);
        this.closeIndicatorSettings = this.closeIndicatorSettings.bind(this);
        this.state = {
            isLoaded : false,
            dataLoaded : false,
            bigdataLoaded : true,
            chartTypeOpen : false,
            indicatorOpen : false,
            compareOpen : false,
            interactiveOpen : false,
            indicatorInfoOpen : false,
            stockOpen : false,
            stockWatchOpen : false,
            comparedataLoaded : true,
            bigcomparedataLoaded : true,
            RemoveFlag : false,
            IndicatorSettingOpen : false,
            indicatorSettingUpdateFlag : false,
            chartType : 'line',
            chartdata : [],
            TotalCharts : 1,
            TotalSwapCharts : 0,
            IndicatorOutside : [],
            IndicatorInside : [],
            OldIndicator : {},
            indicatorInfoType : '',
            indicatorType : 'none',
            IndicatorSettingName : '',
            chartWidth : 0,
            chartHeight : 0,
            zoom : false,
            range : this.props.range,
            chartTypeIcon : Line,
            interactiveType : '',
            trendLineType : '',
            interFlag : false
            
        }
    }

    componentDidMount()
    {

        console.log("MOUNT");
        let options = getCandleDuration(this.state.range);
        this.loadChartData(this.state.range,options.candle,options.duration,options.mixed);
        this.setInitialSize();
        this.loadBigChartData('MAX',3,1,true);
    }

    componentDidUpdate(prevProps)
    {
        // console.log('--update--',prevProps.NewCompareStockConfig,this.props.NewCompareStockConfig);

        if(this.props.NewCompareStockConfig.symbol !== prevProps.NewCompareStockConfig.symbol && this.props.NewCompareStockConfig.code !== prevProps.NewCompareStockConfig.code)
        {
            console.log('ADD COMPARE DATA');
            this.setState({
                comparedataLoaded : false,
                bigcomparedataLoaded : false,
            },()=>{
                console.log('LOAD COMPARE DATA')
                let options = getCandleDuration(this.state.range);
                this.addCompareData(this.state.range,options.candle,options.duration,options.mixed);
                this.loadBigCompareChartData('MAX',3,1,true);
            })
        }

        if(this.props.OldCompareStockConfig.symbol !== prevProps.OldCompareStockConfig.symbol && this.props.OldCompareStockConfig.color !== prevProps.OldCompareStockConfig.color)
        {
            console.log('REMOVE COMPARE DATA ',this.props.OldCompareStockConfig.symbol);
            this.removeCompareData(this.props.OldCompareStockConfig.symbol);
        }

        if(prevProps.stockDetails.stockCode !== this.props.stockDetails.stockCode)
        {
            let options = getCandleDuration(this.state.range);
            console.log('props update : ',this.props.stockDetails.stockCode);
            clearInterval(updateInterval);
            clearInterval(bigdatainterval);

            this.setState({
                chartdata : null,
                bigchartdata : null
            },()=>{
                this.loadBigChartData('MAX',3,1,true);
                // this.loadChartData(this.state.range,options.candle,options.duration,options.mixed);
                this.changeRange('D');
            });
        }

        if(this.props.limitFlag !== prevProps.limitFlag)
        {
            this.compareLimitReached();
        }

        

       
    }

    /*<--- Chart Data Loading Methods --->*/
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
            code = this.props.stockDetails.stockNSECode;
        }
        else if(exchange === 'BSE')
        {
            code = this.props.stockDetails.stockBSECode;
        }

        axios.get(`${REQUEST_BASE_URL}/stockdata`,{
            params : {
                'ct' : ct,
                'starttime' : startUNIX,
                'dd' : dd,
                'exchange' : exchange,
                'token' : this.props.stockDetails.stockCode,
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

                let converteddata = splitAdjustmentArray(stockArray);
                // console.log(converteddata);
                
                converteddata.forEach(d =>{
                    let dobj = {
                        date : new Date(d['date']),
                        open : parseFloat(d['open']),
                        high : parseFloat(d['high']),
                        low : parseFloat(d['low']),
                        close : parseFloat(d['close']),
                        volume : parseInt(d['volume'])
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
                    chartProps : {
                        chartdata : tempDataArray,
                        extradata : futurePoints,
                        lastPoint : lastPoint,
                        startIndex : startIndex,
                        extraPoints : futurePoints.length,
                        range : type
                    },
                    chartdata : tempDataArray,
                    isLoaded : true,
                    dataLoaded : true,
                    
                },()=>{
                    // console.log(this.state.chartProps,this.state.dataLoaded);
                    this.loadCompareData();
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

            // console.log(lastPoint.date);

            // console.log(startUNIX,type,ct,dd);

            let exchange = this.props.stockDetails.stockExchange.exchange;
            let code;

            if(exchange === 'NSE')
            {
                code = this.props.stockDetails.stockNSECode;
            }
            else if(exchange === 'BSE')
            {
                code = this.props.stockDetails.stockBSECode;
            }

            // console.log(ct,dd);

            axios.get(`${REQUEST_BASE_URL}/stockdata`,{
                params : {
                    'ct' : ct,
                    'starttime' : startUNIX,
                    'dd' : dd,
                    'exchange' : exchange,
                    'token' : this.props.stockDetails.stockCode,
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
                    // console.log(stockArray.length);
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
                        // console.log(futurePoints.length);
                        // mergedData = mergedData.concat(futurePoints);


                        this.setState({
                            chartdata : tempDataArray,
                            isLoaded : true,
                            dataLoaded : true,
                            chartProps : {
                                unixtime : startUNIX,
                                chartdata : tempDataArray,
                                extradata : futurePoints,
                                lastPoint : lastPoint,
                                startIndex : startIndex,
                                extraPoints : futurePoints.length,
                                range : type
                            }
                        },()=>{
                            // console.log('add new point')
                            // this.updateCompareData(startUNIX);
                        })
                    }
                    else
                    {
                        // console.log('Wait');
                    }

                }

                // console.log('chart data');

                //make an interval to update data points

                
                
            });

            this.updateCompareData();

        },5000)

    }

    async updateCompareData()
    {
        let CompareStockConfig = this.props.CompareStockConfig;

        let unixtime = this.state.chartProps.unixtime;

        if(CompareStockConfig.length > 0)
        {
            // console.log('ADD WITH COMPARE DATA'); 
            const type = this.state.range;
            const {candle,duration,mixed} = getCandleDuration(type);
            // console.log(candle,duration,mixed);
            // console.log(unixtime);
            // console.log(this.state.chartProps.lastPoint);

            const Stocks = this.props.CompareStockConfig;

            const requests = Stocks.map( s=> axios.get(`${REQUEST_BASE_URL}/stockdata?ct=${candle}&starttime=${unixtime}&dd=${duration}&exchange=${s.exchange.exchange}&token=${s.code}&code=${s.symbol}&mixed=${mixed}&type=${type}`).catch(err => null))

            // console.log(requests);

            let chartdata = this.state.chartdata;
            let lastPoint;

            let added = false;

            axios.all(requests)
            .then(axios.spread((...response)=>{
                response.forEach((r)=>{
                    // console.log(r.data);
                if(r.data.status === 'success' && r.data.data.length>0)
                {
                    // console.log(r.data.data.length);
                    //    console.log(r);
                    let stockArray = r.data.data;

                    let code = r.data.params.code;

                    let indx = chartdata.length - 1;

                    stockArray.reverse().forEach((d,i) =>{

                            let dobj = {};
                            dobj[code+'date'] = new Date(d[0]); 
                            dobj[code+'open'] = parseFloat(d[1]);
                            dobj[code+'high'] = parseFloat(d[2]);
                            dobj[code+'low'] = parseFloat(d[3]);
                            dobj[code+'close'] = parseFloat(d[4]);
                            dobj[code+'volume'] = parseFloat(d[5]);
                            
                            chartdata[indx] = {...chartdata[indx],...dobj};
                            indx-=1;

                            // console.log(code,dobj[code+'date']);
                        }); 


                        lastPoint = chartdata[chartdata.length - 1];

                        // console.log(lastPoint)

                        added = true;

                    }
                })
            }))
            .then(()=>{
                if(added)
                {
                    this.setState({
                        chartProps : {
                            ...this.state.chartProps,
                            chartdata : chartdata,
                            lastPoint : lastPoint,
                        },
                        chartdata : chartdata
                    },()=>{
                        // console.log('DONEEEEEE -------------> ',this.state.chartdata[0],this.state.chartdata[this.state.chartdata.length-1]);
                    }); 
                }
                // console.log('DONEEEEE')
            })   
        }
    }

    loadBigChartData(type,ct,dd,mixed)
    {
        
        console.log('LOAD BIG CHART DATA');
        this.setState({
            bigdataLoaded : false
        })

        let startUNIX = convertToUNIX(type);

        // console.log(startUNIX,type,ct,dd);

        let exchange = this.props.stockDetails.stockExchange.exchange;
        let code;

        if(exchange === 'NSE')
        {
            code = this.props.stockDetails.stockNSECode;
        }
        else if(exchange === 'BSE')
        {
            code = this.props.stockDetails.stockBSECode;
        }

        axios.get(`${REQUEST_BASE_URL}/stockdata`,{
            params : {
                'ct' : ct,
                'starttime' : startUNIX,
                'dd' : dd,
                'exchange' : exchange,
                'token' : this.props.stockDetails.stockCode,
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

                let converteddata = splitAdjustmentArray(stockArray);


                converteddata.forEach(d =>{
                    let dobj = {
                        date : new Date(d['date']),
                        open : parseFloat(d['open']),
                        high : parseFloat(d['high']),
                        low : parseFloat(d['low']),
                        close : parseFloat(d['close']),
                        volume : parseInt(d['volume'])
                    }

                    // console.log(d,dobj);

                    tempDataArray.push(dobj);

                });

                // console.log(tempDataArray);

                this.setState({
                    bigdataLoaded : true,
                    bigchartdata : tempDataArray
                },()=>{
                    // console.log('big data loaded ',tempDataArray[tempDataArray.length - 1]);
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
            console.log(tempDataArray)
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

    async addCompareData(type,ct,dd,mixed)
    {
        let startUNIX = convertToUNIX(type);
        // console.log(startUNIX);
        axios.get(`${REQUEST_BASE_URL}/stockdata`,{
          params : {
            'ct' : ct,
            'starttime' : startUNIX,
            'dd' : dd,
            'exchange' : this.props.NewCompareStockConfig.exchange.exchange,
            'token' : parseInt(this.props.NewCompareStockConfig.code),
            'code' : this.props.NewCompareStockConfig.symbol,
            'mixed' : mixed,
            'type' : type
          }
        })
        .then(res=>{
            // console.log(res.data);
            const data = res.data;
            if(data.status === 'success')
            {
                let code = this.props.NewCompareStockConfig.symbol;
                let stockArray = data.data;
                let chartdata = this.state.chartdata;
                let indx = chartdata.length - 1;
                let dobj = {};
                // console.log(stockArray);

                let converteddata = splitAdjustmentArray(stockArray);
                // console.log(converteddata);

                converteddata.reverse().forEach(d =>{

                    // let csd = this.state.chartdata[indx].csd;
                    // console.log(csd);
                    dobj = {};
                    // dobj['code'] = code; 
                    dobj[code+'open'] = parseFloat(d['open']);
                    dobj[code+'high'] = parseFloat(d['high']);
                    dobj[code+'low'] = parseFloat(d['low']);
                    dobj[code+'close'] = parseFloat(d['close']);
                    dobj[code+'volume'] = parseFloat(d['volume']);

                    // csd.push(dobj);

                    // console.log(csd)
                    chartdata[indx] = {...chartdata[indx],...dobj};

                    // chartdata[indx] = {...chartdata[indx],...csd};
                    indx-=1;
        
                });
    
                // console.log(chartdata);
                // console.log(this.state.lastPoint);
                let lastPoint = chartdata[chartdata.length - 1];
                console.log(lastPoint);

                this.setState({
                    chartProps : {
                        ...this.state.chartProps,
                        chartdata : chartdata,
                        lastPoint : lastPoint,
                    },
                    chartdata : chartdata,
                    comparedataLoaded : true
                })

            }
            
        })
    }

    loadBigCompareChartData(type,ct,dd,mixed)
    {
        
        console.log('LOAD BIG COMPARE CHART DATA');

        let startUNIX = convertToUNIX(type);

        axios.get(`${REQUEST_BASE_URL}/stockdata`,{
          params : {
            'ct' : ct,
            'starttime' : startUNIX,
            'dd' : dd,
            'exchange' : this.props.NewCompareStockConfig.exchange.exchange,
            'token' : parseInt(this.props.NewCompareStockConfig.code),
            'code' : this.props.NewCompareStockConfig.symbol,
            'mixed' : mixed,
            'type' : type
          }
        })
        .then(res=>{
            const data = res.data;
            // console.log(data);
            if(data.status === 'success')
            {
                
                let code = this.props.NewCompareStockConfig.symbol;
                let stockArray = data.data;
                let bigchartdata = this.state.bigchartdata;
                let indx = bigchartdata.length - 1;
                let dobj = {};
                // console.log(stockArray);
                let converteddata = splitAdjustmentArray(stockArray);

                converteddata.reverse().forEach(d =>{

                    // let csd = this.state.chartdata[indx].csd;
                    // console.log(csd);
                    dobj = {};
                    // dobj['code'] = code; 
                    dobj[code+'open'] = parseFloat(d['open']);
                    dobj[code+'high'] = parseFloat(d['high']);
                    dobj[code+'low'] = parseFloat(d['low']);
                    dobj[code+'close'] = parseFloat(d['close']);
                    dobj[code+'volume'] = parseFloat(d['volume']);

                    // csd.push(dobj);

                    // console.log(csd)
                    bigchartdata[indx] = {...bigchartdata[indx],...dobj};

                    // chartdata[indx] = {...chartdata[indx],...csd};
                    indx-=1;
        
                });

                console.log('BIG DATA LOADED ',bigchartdata[bigchartdata.length - 1]);


                this.setState({
                    bigchartdata : bigchartdata,
                    bigcomparedataLoaded : true
                },()=>{
                    console.log('BIG DATA LOADED ',bigchartdata[bigchartdata.length - 1]);
                })
            }

           
            
            
        })
    }

    async loadCompareData()
    {

        let CompareStockConfig = this.props.CompareStockConfig;
        if(CompareStockConfig.length > 0)
        {
            this.setState({
                comparedataLoaded : false
            });
            console.log('ADD WITH COMPARE DATA'); 
            const type = this.state.range;
            const {candle,duration,mixed} = getCandleDuration(type);
            // console.log(candle,duration,mixed);
            let startUNIX = convertToUNIX(type);
            // console.log(startUNIX);

            const Stocks = this.props.CompareStockConfig;

            const requests = Stocks.map( s=> axios.get(`${REQUEST_BASE_URL}/stockdata?ct=${candle}&starttime=${startUNIX}&dd=${duration}&exchange=NSE&token=${s.code}&code=${s.symbol}&mixed=${mixed}&type=${type}`).catch(err => null))

            // console.log(requests);

            let chartdata = this.state.chartdata;
            let lastPoint;


            axios.all(requests)
            .then(axios.spread((...response)=>{
                response.forEach((r)=>{
                    // console.log(r.data);
                if(r.data.status === 'success')
                {
                    console.log(r.data.data.length);
                    //    console.log(r);
                    let stockArray = r.data.data;

                    let code = r.data.params.code;

                    let indx = chartdata.length - 1;

                    let converteddata = splitAdjustmentArray(stockArray);
                    // console.log(converteddata);

                    converteddata.reverse().forEach((d,i) =>{

                            let dobj = {};
                            dobj[code+'date'] = new Date(d['date']); 
                            dobj[code+'open'] = parseFloat(d['open']);
                            dobj[code+'high'] = parseFloat(d['high']);
                            dobj[code+'low'] = parseFloat(d['low']);
                            dobj[code+'close'] = parseFloat(d['close']);
                            dobj[code+'volume'] = parseFloat(d['volume']);
                            
                            chartdata[indx] = {...chartdata[indx],...dobj};
                            indx-=1;
                        }); 


                        lastPoint = chartdata[chartdata.length - 1];

                        console.log(lastPoint)

                    }
                })
            }))
            .then(()=>{
                this.setState({
                    chartProps : {
                        ...this.state.chartProps,
                        chartdata : chartdata,
                        lastPoint : lastPoint,
                    },
                    chartdata : chartdata,
                    comparedataLoaded : true
                },()=>{
                    console.log('DONEEEEEE -------------> ',this.state.chartdata[0]);
                }); 
                // console.log('DONEEEEE')
            })

           

             
        }

        
    }

    async removeCompareData(symbol)
    {

        // console.log(this.state.lastPoint); 
        console.log('REMOVE FLAG : ',this.state.RemoveFlag) ;

        let chartdata = this.state.chartdata;
        console.log(symbol);
        if(chartdata)
        {
            chartdata.forEach((d)=>{
                delete d[symbol];
                delete d[symbol+'open'];
                delete d[symbol+'high'];
                delete d[symbol+'low'];
                delete d[symbol+'close'];
                delete d[symbol+'volume'];
            });

            console.log('REMOVED')

            // console.log(this.state.lastPoint);   

            let lastPoint = chartdata[chartdata.length - 1];

            console.log(lastPoint);
            

            this.setState({
                chartProps : {
                    ...this.state.chartProps,
                    chartdata : chartdata,
                    lastPoint : lastPoint,
                },
                chartdata : chartdata,
                RemoveFlag : !this.state.RemoveFlag
            },()=>{
                console.log(this.state.chartdata[this.state.chartdata.length - 1]);
                console.log('REMOVE FLAG : ',this.state.RemoveFlag) ;

            });
        }
    }

    setInitialSize()
    {
        let wd = $('.stock__chart').width();
        let ht = $('.stock__chart').height();
        // console.log($('.stock__chart'));
        this.setState({
            chartWidth : wd,
            chartHeight : ht,
        });
        // console.log(wd,ht);
    }

    changeChart(type)
    {
        console.log(type);
        this.setState({
            chartType : type
        });
        if(type === 'area')
        {
            this.state.chartTypeIcon = Area;
        }
        else if(type === 'candlestick')
        {
            this.state.chartTypeIcon = Candles;
        }
        else if(type === 'column')
        {
            this.state.chartTypeIcon = Column;
        }
        else if(type === 'jumpLine')
        {
            this.state.chartTypeIcon = JumpLine;
        }
        else if(type === 'line')
        {
            this.state.chartTypeIcon = Line;
        }
        else if(type === 'rangeArea')
        {
            this.state.chartTypeIcon = Range;
        }
        else if(type === 'ohlc')
        {
            this.state.chartTypeIcon = OHLC;
        }
        else if(type === 'marker')
        {
            this.state.chartTypeIcon = Marker;
        }
        else if(type === 'stick')
        {
            this.state.chartTypeIcon = Stick;
        }
        else if(type === 'renko')
        {
            this.state.chartTypeIcon = Renko;
        }
        else if(type === 'kagi')
        {
            this.state.chartTypeIcon = Kagi;
        }
        else if(type === 'point')
        {
            this.state.chartTypeIcon = Point;
        }
        $('.stock__chart__types>div').removeClass('active');
        $('.stock__chart__types>div[data-chart="'+type+'"]').addClass('active');
    }

    changeRange(range)
    {
        clearInterval(updateInterval);
        clearInterval(bigdatainterval);
        let options = getCandleDuration(range);
        console.log(options);
        this.setState({
            range : range
        });
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
        this.props.setRange(range);
        $('.chart__range>div').removeClass('active__range');
        $('.chart__range>div[data-range="'+range+'"]').addClass('active__range');
    }

    ChangeIndicatorType(indicator)
    {
        let type = indicator.InfoType;
        let position = indicator.Position;
        console.log('INDICATOR TYPE ',type,indicator);
        if(position)
        {
            if(this.state.TotalCharts <= 2)
            {
                if(!this.state.IndicatorOutside.includes(type))
                {
                    this.setState({
                        indicatorType : type,
                        TotalCharts : this.state.TotalCharts+1,
                        IndicatorOutside : [...this.state.IndicatorOutside,type]
                    },()=>{
                        console.log(this.state.IndicatorOutside)
                    });
                }
            }
            else
            {
                this.indicatorLimitReached();
            }
        }
        else
        {
            if(!this.state.IndicatorInside.includes(type))
            {
                this.setState({
                    indicatorType : type,
                    IndicatorInside : [...this.state.IndicatorInside,type]
                },()=>{
                    console.log(this.state.IndicatorInside)
                })
            }
        }
    }

    DeleteIndicatorType(position,type)
    {

        if(position)
        {
            let IndicatorOutside = this.state.IndicatorOutside;
            let indx = IndicatorOutside.findIndex((c)=> c === type);
            // console.log(indx);

            if(indx !== -1)
            {
                let OldIndicator = IndicatorOutside[indx];
                IndicatorOutside.splice(indx,1);
                console.log(IndicatorOutside);
                this.setState({
                    OldIndicator,
                    IndicatorOutside,
                    TotalCharts : this.state.TotalCharts-1,
                });
            }
        }
        else
        {
            let IndicatorInside = this.state.IndicatorInside;
            let indx = IndicatorInside.findIndex((c)=> c === type);
            if(indx !== -1)
            {
                let OldIndicator = IndicatorInside[indx];
                IndicatorInside.splice(indx,1);
                console.log(IndicatorInside);
                this.setState({
                    OldIndicator,
                    IndicatorInside
                });
            }
        }
    }

    SwapCharts(action,indx)
    {
        let IndicatorOutside = this.state.IndicatorOutside;
        let cindx;
        if(action === 'up')
        {
            cindx = indx - 1;
        }
        else
        {
            cindx = indx + 1;
        }

        console.log(indx,cindx);

        [IndicatorOutside[indx],IndicatorOutside[cindx]] = [IndicatorOutside[cindx],IndicatorOutside[indx]];

        console.log(IndicatorOutside);
        this.setState({
            IndicatorOutside,
            TotalSwapCharts : this.state.TotalSwapCharts + 1
        });

    }

    ToggleChartType()
    {
        if(this.state.chartTypeOpen)
        {
            $('.stock__chart__types').removeClass('active');
            this.setState({
                chartTypeOpen : false
            });
        }
        else
        {
            $('.stock__chart__types').addClass('active');
            this.setState({
                chartTypeOpen : true
            });
        }
    }

    OpenIndicatorPopup()
    {
        if(!this.state.indicatorOpen)
        {
            this.wrapPopups('Indicator__popup',true);
            this.wrapStates('indicatorOpen',true);
        }
    }

    CloseIndicatorPopup()
    {
        
        if(this.state.indicatorOpen)
        {
            this.wrapPopups('Indicator__popup',false);
            this.wrapStates('indicatorOpen',false);
        } 
    }

    OpenComparePopup()
    {
        if(!this.state.compareOpen)
        {
            this.wrapPopups('Compare__popup',true);
            this.wrapStates('compareOpen',true);
        }
    }

    CloseComparePopup()
    {
        if(this.state.compareOpen)
        {
            this.wrapPopups('Compare__popup',false);
            this.wrapStates('compareOpen',false);
        } 
    }

    OpenInteractivePopup()
    {
        if(!this.state.interactiveOpen)
        {
            this.wrapPopups('Interactive__popup',true);
            this.wrapStates('interactiveOpen',true);
        }
    }

    CloseInteractivePopup()
    {
        if(this.state.interactiveOpen)
        {
            this.wrapPopups('Interactive__popup',false);
            this.wrapStates('interactiveOpen',false);
        } 
    }


    OpenStockPopup()
    {
        if(!this.state.stockOpen)
        {
            this.wrapPopups('Stock__popup',true);
            this.wrapStates('stockOpen',true);

            console.log('stock open')
        }
    }

    CloseStockPopup()
    {
        if(this.state.stockOpen)
        {
            this.wrapPopups('Stock__popup',false);
            this.wrapStates('stockOpen',false);
        }
    }

    OpenStockWatchPopup()
    {
        if(!this.state.stockWatchOpen)
        {
            $('#stock-watch-arrow').addClass('active');
            this.wrapPopups('Stock__watch__popup',true);
            this.wrapStates('stockWatchOpen',true);
        }
    }

    CloseStockWatchPopup()
    {
        if(this.state.stockWatchOpen)
        {
            $('#stock-watch-arrow').removeClass('active');
            this.wrapPopups('Stock__watch__popup',false);
            this.wrapStates('stockWatchOpen',false);
        }
    }

    changeInteractiveType(Itype,Stype)
    {
        this.setState({
            interactiveType : Itype,
            trendLineType : Stype,
            interactiveOpen : false,
            interFlag : !this.state.interFlag
        });
        this.CloseInteractivePopup();
    }

    OpenZoomMode()
    {
        console.log('zoom');
        if(this.state.zoom)
        {
            $('.app__header').removeClass('app__header__zoom');
            $('.app__body').removeClass('app__body__zoom');
            $('.app__footer').removeClass('app__footer__zoom');
            $('.key__statistics').removeClass('key__statistics__zoom');
            $('.app__body__left').removeClass('app__body__left__zoom');
            $('.app__body__right').removeClass('app__body__right__zoom');
            $('.app__body__top').removeClass('app__body__top__zoom');
            $('.app__body__bottom').removeClass('app__body__bottom__zoom');
            $('.chart__container').removeClass('chart__container__zoom');
            
            $('.chart__container__stock__options').removeClass('active');
            $('.cash__position').removeClass('cash__position__zoom');
            // $('.ks__container__full').css('display','none');
            // $('.ks__container__half').css('display','flex');
        
            this.setState({
                zoom : false,
                chartWidth : $('.stock__chart').width(),
                chartHeight : $('.stock__chart').height()
            });
            this.props.toggleZoom(false);
            console.log('zoom out',$('.stock__chart').height(),$('.stock__chart').width());
        }
        else
        {
            $('.app__header').addClass('app__header__zoom');
            $('.app__body').addClass('app__body__zoom');
            $('.app__footer').addClass('app__footer__zoom');
            $('.key__statistics').addClass('key__statistics__zoom');
            $('.chart__container').addClass('chart__container__zoom');
            $('.app__body__left').addClass('app__body__left__zoom');
            $('.app__body__right').addClass('app__body__right__zoom');
            $('.app__body__top').addClass('app__body__top__zoom');
            $('.app__body__bottom').addClass('app__body__bottom__zoom');
            $('.cash__position').addClass('cash__position__zoom');
            $('.chart__container__stock__options').addClass('active');
            // $('.ks__container__full').css('display','flex');
            // $('.ks__container__half').css('display','none');

            this.setState({
                zoom : true,
                chartWidth : $('.stock__chart').width(),
                chartHeight : $('.stock__chart').height()
            });
            this.props.toggleZoom(true);

            console.log('zoom in',$('.stock__chart').height(),$('.stock__chart').width());

           
            
        }

       
    }

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

    compareLimitReached()
    {
        this.CloseComparePopup();
        // $('.app__back__blur').addClass('active');
        Alert({Message : 'Max number of securities to compared reaches.'})
        // $('.compare__limit__popup').addClass('active');
    }

    indicatorLimitReached()
    {
        this.CloseIndicatorPopup();
        // $('.app__back__blur').addClass('active');
        // $('.indicator__limit__popup').addClass('active');
        // Alert({Message : 'Max number of indicators can be used reaches.'})
        Alert({
            TitleText : 'Warning',
            Message : 'Max number of indicators can be used reaches.',
            Band : true,
            BandColor : '#00a0e3',
            BoxColor : '#ffffff',
            TextColor : '#000000',
            AutoClose : {
                Active : false,
                Line : true,
                LineColor : '#00a0e3',
                Time : 5
            }
        })

    }

    toggleIndicatorSettings(e,indicator)
    {
        const {IndicatorInside,IndicatorOutside} = this.state;

        if(IndicatorInside.includes(indicator) || IndicatorOutside.includes(indicator))
        {
            this.setState({
                IndicatorSettingName : indicator,
                IndicatorSettingOpen : true
            });
            $('.app__back__blur').addClass('active');
        }
    }

    closeIndicatorSettings()
    {
        this.setState({
            IndicatorSettingName : '',
            IndicatorSettingOpen : false
        });
        $('.app__back__blur').removeClass('active');
    }

    saveIndicatorSettings()
    {
        this.setState({
            indicatorSettingUpdateFlag : !this.state.indicatorSettingUpdateFlag
        })
    }

    wrapPopups(popup,open)
    {
        const PopupArray = ['Compare__popup','Interactive__popup','Indicator__popup','Stock__popup','Stock__watch__popup'];

        PopupArray.map((p,i)=>{
            popup && $('.'+p).removeClass('active');
        });

        if(open)
        {
            $('.'+popup).addClass('active');
            $('.app__back__blur').addClass('active');
        }

        else
        {
            $('.app__back__blur').removeClass('active');
        }


        

    }

    wrapStates(state,open)
    {
        const states = ['compareOpen','indicatorOpen','interactiveOpen','stockOpen','stockOpen','stockWatchOpen'];

        let stateobj = {};

        states.map((s,i)=>{
            stateobj[s] = false;
        });

        if(open)
        {
            stateobj[state] = open;
        }


        this.setState({
            ...stateobj
        });


    }

    render() {

        // console.log('Rendering chart...');
        // console.log(this.props.data);

        const {StockSettingsOpen,StockCompareSettings} = this.props;

        const {IndicatorSettingOpen} = this.state;

        let stockData = this.props.stockData;

        let TradePrice = this.convertIntoPriceFormat(stockData.last_traded_price);

        let dPrice,fPrice,change_price,change_percentage,priceClass;
        
        if(TradePrice && TradePrice !== 'undefined')
        {
            dPrice = (TradePrice+'').split('.')[0];
            fPrice = (TradePrice+'').split('.')[1];

            change_price = parseFloat(stockData.change_price);
            change_percentage = parseFloat(stockData.change_percentage);

            // console.log(change_price,change_percentage);
            // console.log(typeof change_price,typeof change_percentage);

            priceClass = change_price >= 0 ? 'positive' : 'negative';
        }

        let stockName = this.props.stockDetails.stockExchange.exchange === 'NSE' ? this.props.stockDetails.stockNSECode : this.props.stockDetails.stockBSECode; 
        
            return (

                <>
                <IndicatorPopup 
                    ChangeIndicatorType={this.ChangeIndicatorType}
                    CloseIndicatorPopup={this.CloseIndicatorPopup}
                />
    
                <ComparePopup 
                    stockDetails={this.props.stockDetails}
                    CloseComparePopup={this.CloseComparePopup}
                    CompareStockConfig={this.props.CompareStockConfig}
                    WatchStocks={this.props.WatchStocks}
                    compareStock={this.props.compareStock}
                    removeStock={this.props.removeStock}
                    RemoveFlag={this.state.RemoveFlag}
                />


                <StockSearchPopup 

                    stockDetails={this.props.stockDetails}
                    CloseStockPopup={this.CloseStockPopup}
                    CompareStockConfig={this.props.CompareStockConfig}
                    WatchStocks={this.props.WatchStocks}
                    compareStock={this.props.compareStock}
                    removeStock={this.props.removeStock}
                    RemoveFlag={this.state.RemoveFlag}
                    selectedStock={this.props.selectedStock}

                />

                <StockWatchPopup 
                    WatchStocks={this.props.WatchStocks}
                    stockDetails={this.props.stockDetails}
                    CloseStockWatchPopup={this.CloseStockWatchPopup}
                    selectedStock={this.props.selectedStock}
                />

                {StockSettingsOpen && 
                    
                    <>
                        <CompareSettingPopup 
                            zoom={this.state.zoom}
                            saveCompareSettings={this.props.saveCompareSettings}
                            closeCompareSettings={this.props.closeCompareSettings}
                            StockCompareSettings={StockCompareSettings}
                        />
                    </>
                    
                }

                {IndicatorSettingOpen && 
                    <>
                        <IndicatorSettingPopup 
                            IndicatorName={this.state.IndicatorSettingName}
                            indicatorSettingUpdateFlag={this.state.indicatorSettingUpdateFlag}
                            saveIndicatorSettings={this.saveIndicatorSettings}
                            closeIndicatorSettings={this.closeIndicatorSettings}
                        />
                    </>
                }

                
                
    
                <div className="Interactive__popup">
                    <div className="Interactive__title__name">
                        <p>Interactive</p>
                        <span id="Interactive__close" onClick={this.CloseInteractivePopup.bind(this)}>
                            <img src={CrossIcon} alt="X"/>
                        </span>
                    </div>
                    <div className="Interactive__options">
                        <div className="Interactive__option__block">
                            <p>Line and Ray</p>
                            <div>
                                <Interactive IImage={LineSegment} Name="Line Segment" Itype="line" Stype="LINE" changeInteractive={this.changeInteractiveType.bind(this)}/>
                                <Interactive IImage={InfiniteLine} Name="Infinite Line" Itype="line" Stype="XLINE" changeInteractive={this.changeInteractiveType.bind(this)}/>
                                <Interactive IImage={Ray} Name="Ray" Itype="line" Stype="RAY" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                        <div className="Interactive__option__block">
                            <p>Channel</p>
                            <div>
                                <Interactive IImage={LineSegment} Name="Trend Channel" Itype="channel" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                                <Interactive IImage={LineSegment} Name="Standard Deviation Channel" Itype="sdchannel" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                        <div className="Interactive__option__block">
                            <p>Retracement</p>
                            <div>
                                <Interactive IImage={FibRet} Name="Fibonacci Retracement" Itype="retracements" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                        <div className="Interactive__option__block">
                            <p>Fan</p>
                            <div>
                                <Interactive IImage={GannFan} Name="Gann Fan" Itype="fans" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                    </div> 
                </div>
    
                <div className="chart__container" >
    
                    <div className="chart__container__stock__options">
                        <div className="chart__options">
                            <div className="chart__option__block chart__stock__name" onClick={this.OpenStockPopup.bind(this)}>
                                <span>{stockName}</span>
                            </div>
                            
                            <div className="chart__option__block chart__stock__type__change" onClick={this.ToggleChartType.bind(this)}>
                                <span><img src={this.state.chartTypeIcon} alt="C" id="chart__type__icon"/></span>
                                <div className="stock__chart__types">
                                    <div data-chart="area" onClick={this.changeChart.bind(this,'area')}><img src={Area} alt="+"/><span>Area</span></div>
                                    <div data-chart="candlestick" onClick={this.changeChart.bind(this,'candlestick')}><img src={Candles} alt="+"/><span>Candlestick</span></div>
                                    <div data-chart="column" onClick={this.changeChart.bind(this,'column')}><img src={Column} alt="+"/><span>Column</span></div>
                                    <div data-chart="jumpLine" onClick={this.changeChart.bind(this,'jumpLine')}><img src={JumpLine} alt="+"/><span>Jump Line</span></div>
                                    <div data-chart="line" className="active" onClick={this.changeChart.bind(this,'line')}><img src={Line} alt="+"/><span>Line</span></div>
                                    <div data-chart="stepline" onClick={this.changeChart.bind(this,'stepline')}><img src={Line} alt="+"/><span>Step Line</span></div>
                                    <div data-chart="rangeArea" onClick={this.changeChart.bind(this,'rangeArea')}><img src={Range} alt="+"/><span>Range Area</span></div>
                                    <div data-chart="ohlc" onClick={this.changeChart.bind(this,'ohlc')}><img src={OHLC} alt="+"/><span>OHLC</span></div>
                                    <div data-chart="marker" onClick={this.changeChart.bind(this,'marker')}><img src={Marker} alt="+"/><span>Marker</span></div>
                                    <div data-chart="stick" onClick={this.changeChart.bind(this,'stick')}><img src={Stick} alt="+"/><span>Stick</span></div>
                                    
                                </div>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenComparePopup.bind(this)}>
                                <img src={Compare} alt="+"/>
                                <span>Compare</span>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenIndicatorPopup.bind(this)}>
                                <img src={IndicatorIcon} alt="+"/>
                                <span>Indicator</span>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenInteractivePopup.bind(this)}>
                                <img src={IndicatorIcon} alt="+"/>
                                <span>Interactive</span>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenStockWatchPopup.bind(this)}>
                                <img src={IndicatorIcon} alt="+"/>
                                <span>People Also Watch</span>
                                {this.props.WatchStocks.length > 0 && 
                                    <StockWatchHero config={this.props.WatchStocks[0]}/>
                                }
                                <img id="stock-watch-arrow" width={15} height={15} src={Chevron} alt="^"/>
                            </div>
                        </div>
                        
                    </div>
    
                    <div className="stock__info__chart">
                        {this.props.stockDetails && 
                            <div className="stock__info">
                            <div className="stock__details">
                                <p className="stock__name__code">
                                    <span id="stock__code">{stockName}</span>
                                </p>
                                <div className="stock__type">
                                    <img src={SettingIcon} alt="s"/>
                                    <p>{this.props.stockDetails.stockIndustry}</p>
                                </div>
                            </div>
                            <div id="stock__full__name">
                                <span>{this.props.stockDetails.stockName}</span>
                            </div>
                            <div className="stock__price__purchase">
                                <div className="stock__price__details">
                                    <div className="price__decimals" style={{display : 'flex'}}>
                                        {dPrice &&
                                        dPrice.split('').map((n,i) => {
                                            return <AnimatedDigit 
                                                digit={n} 
                                                key={i}
                                                size={28}
                                            />
                                        })}
                                    </div>
                                    <div className="price__fraction" style={{display : 'flex'}}>
                                        {fPrice &&
                                        fPrice.split('').map((n,i) => {
                                            return <AnimatedDigit 
                                                digit={n} 
                                                key={i}
                                                size={20}
                                            />
                                        })}
                                    </div>
                                    
                                </div>
                                <div className="stock__price__change">
                            
                                    <div className={priceClass +' stock__performance__amount'} style={{display : 'flex'}}>
                                        {stockData.change_price &&
                                            stockData.change_price.split('').map((n,i) => {
                                                return <AnimatedDigit 
                                                digit={n} 
                                                size={18} 
                                                key={i}    
                                                digitMargin={-0.8}
                                            />
                                        })}
                                    </div>

                                    {stockData.change_percentage && 
                                        
                                        <div className={priceClass +' stock__performance__percentage'} style={{display : 'flex'}}>
                                            ({
                                                stockData.change_percentage.split('').map((n,i) => {
                                                    return <AnimatedDigit 
                                                    digit={n} 
                                                    size={18} 
                                                    key={i}
                                                    digitMargin={-0.8}
                                                />
                                            })})
                                        </div>
                                        
                                    }
                                    
                                    
                                    {/* <ChartClock /> */}
                                </div>
                            </div>
                            
                        </div>
                        }
                        <div className="stock__purchase">
                            <div className="buy__stock"><img src={PlusIcon} alt=""/></div>
                            <div className="sell__stock"><img src={MinusIcon} alt=""/></div>
                        </div>
                        {/* {this.state.dataLoaded && this.state.comparedataLoaded?  */}
                        {this.state.bigdataLoaded && this.state.bigcomparedataLoaded ? 
                            (
                                this.state.dataLoaded && this.state.comparedataLoaded ? 
                                    <div className="stock__chart">
                                        <StockChart 
                                            key={this.state.zoom ? 1 : 2} 
                                            openPrice={this.props.stockData.open_price}
                                            closePrice={this.props.stockData.close_price}
                                            currentPrice={this.props.stockData.last_traded_price}
                                            initial={this.props.initial}
                                            // stockData={this.props.stockData}
                                            range={this.state.range} 
                                            width={this.state.chartWidth} 
                                            height={this.state.chartHeight} 
                                            zoom={this.state.zoom} 
                                            chartType={this.state.chartType}
                                            IndicatorType={this.state.indicatorType}
                                            TotalCharts={this.state.TotalCharts}
                                            TotalSwapCharts={this.state.TotalSwapCharts}
                                            trendLineType={this.state.trendLineType} 
                                            interactiveType={this.state.interactiveType}
                                            interFlag={this.state.interFlag}
                                            chartProps={this.state.chartProps}
                                            stockDetails={this.props.stockDetails}
                                            CompareStockConfig={this.props.CompareStockConfig}
                                            NewCompareStockConfig={this.props.NewCompareStockConfig}
                                            OldCompareStockConfig={this.props.OldCompareStockConfig}
                                            toggleHide={this.props.toggleHide}
                                            toggleCompareSettings={this.props.toggleCompareSettings}
                                            removeStock={this.props.removeStock}
                                            IndicatorOutside={this.state.IndicatorOutside}
                                            IndicatorInside={this.state.IndicatorInside}
                                            OldIndicator={this.state.OldIndicator}
                                            toggleIndicatorSettings={this.toggleIndicatorSettings}
                                            DeleteIndicatorType={this.DeleteIndicatorType}
                                            SwapCharts={this.SwapCharts}
                                            RemoveFlag={this.state.RemoveFlag}
                                    />
                                    </div>
                                    :
                                    <div className="stock__chart stock__chart__blur ">
                                        <div className="stock__chart__pulse">
                                            <Pulse />
                                        </div>
                                    </div>
                            )
                            :
                            (
                                    <div className="stock__chart stock__chart__load">
                                        <Pulse />
                                        <p>Loading Chart...</p>
                                    </div>
                            )
                        }
                        
                    </div>
                    
                    
                    <div className="chart__range" >
                        <div data-range="1D" className="chart__range__value" onClick={this.changeRange.bind(this,'1D')}>1D</div>
                        <div data-range="5D" className="chart__range__value" onClick={this.changeRange.bind(this,'5D')}>5D</div>
                        <div data-range="1M" className="chart__range__value" onClick={this.changeRange.bind(this,'1M')}>1M</div>
                        <div data-range="3M" className="chart__range__value" onClick={this.changeRange.bind(this,'3M')}>3M</div>
                        <div data-range="6M" className="chart__range__value" onClick={this.changeRange.bind(this,'6M')}>6M</div>
                        <div data-range="YTD" className="chart__range__value" onClick={this.changeRange.bind(this,'YTD')}>YTD</div>
                        <div data-range="1Y" className="chart__range__value" onClick={this.changeRange.bind(this,'1Y')}>1Y</div>
                        <div data-range="5Y" className="chart__range__value" onClick={this.changeRange.bind(this,'5Y')}>5Y</div>
                        <div data-range="MAX" className="chart__range__value" onClick={this.changeRange.bind(this,'MAX')}>Max</div>
                    </div>
                    <div className="chart__zoom" onClick={this.OpenZoomMode.bind(this)}>
                        <img src={Zoom} alt="zoom"/> 
                    </div>
                </div>
                </>
            )
       
    }
}

export default ChartContainer;
