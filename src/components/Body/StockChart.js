import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import {scaleTime} from 'd3-scale';
import { format } from 'd3-format';
import { curveMonotoneX, curveCardinal } from "d3-shape";
import {ChartCanvas,Chart} from 'react-stockcharts';
import {XAxis,YAxis} from 'react-stockcharts/lib/axes';
import {LineSeries,AreaSeries,BarSeries,CandlestickSeries,ScatterSeries ,OHLCSeries,KagiSeries,RenkoSeries,PointAndFigureSeries, SquareMarker,CircleMarker , BollingerSeries , MACDSeries , RSISeries ,StochasticSeries ,StraightLine ,ElderRaySeries , SARSeries , VolumeProfileSeries} from 'react-stockcharts/lib/series';
import { pointAndFigure ,kagi,renko} from "react-stockcharts/lib/indicator";
import { discontinuousTimeScaleProvider , discontinuousTimeScaleProviderBuilder } from "react-stockcharts/lib/scale";
import {fitWidth} from 'react-stockcharts/lib/helper';
import { last ,toObject , rightDomainBasedZoomAnchor , lastVisibleItemBasedZoomAnchor } from "react-stockcharts/lib/utils/zoomBehavior";
import {lastValidVisibleItemBasedZoomAnchor} from './CustomChartComponents/ZoomBehaviour/zoomBehaviour';
import { timeFormat } from 'd3-time-format';
import { TrendLine,EquidistantChannel,StandardDeviationChannel ,FibonacciRetracement ,GannFan} from "react-stockcharts/lib/interactive";
import {saveInteractiveNodes, getInteractiveNodes} from "../../exports/InteractiveUtils";
import { HoverTooltip } from "./CustomChartComponents/HoverTooltip/HoverTooltip";
import {getXCoordinateProps, getYCoordinateProps, getXAxisProps, getYAxisProps , tooltipContent } from '../../exports/ChartProps';
import { CrossHairCursor, MouseCoordinateX, MouseCoordinateY ,PriceCoordinate, EdgeIndicator  } from "react-stockcharts/lib/coordinates";
import {sma20,wma20,ema20,tma20,bb,macdCalculator,rsiCalculator,atrCalculator,slowSTO,fastSTO,fullSTO,fi,fiEMA,elder,elderImpulseCalculator,defaultSar,changeCalculator,compareCalculator} from '../../exports/MathematicalIndicators';
import {TrendLineAppearance,EquidistantChannelAppearance,StandardDeviationChannelAppearance,FibRetAppearance,GannFanAppearance} from '../../exports/InteractiveAppearance';
import LastPointIndicator from './CustomChartComponents/LastPointEdgeIndicator/LastPointIndicator';
import PriceMarkerCoordinate from './CustomChartComponents/PriceMarker/PriceMarkerCoordinate';
import LabelEdgeCoordinate from './CustomChartComponents/EdgeLabel/LabelEdgeCoordinate';


export class StockChart extends React.PureComponent {


    constructor(props)
    {
        super(props);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
        this.getInteractiveNodes = getInteractiveNodes.bind(this);
        this.saveCanvas = this.saveCanvas.bind(this);
        this.onDrawCompleteChart = this.onDrawCompleteChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.updateHead = this.updateHead.bind(this);
        this.setInteractionType = this.setInteractionType.bind(this);
        this.setUpChart = this.setUpChart.bind(this);
        this.handleDownloadMore = this.handleDownloadMore.bind(this);

        this.state = {
            isInteracted : false,
            data : null,
            xScale : null,
            xAccessor : null, 
            displayXAccessor : null,
            initialIndex: 0,
            apidata : this.props.chartProps.chartdata,
            extradata : this.props.chartProps.extradata,
            chartdata : null,
            enableTrendLine : false,
            enableChannel : false,
            enableSDChannel : false,
            enableFibRet : false,
            enableGannFan : false,
            trends : [],
            channel : [],
            SDchannel : [],
            FibRet : [],
            GannFan : [],
            chartProps : this.props.chartProps
        };
    }

    saveCanvas(node) {
		this.canvas = node;
    }
    
    componentDidMount() {
        console.log('Stock Chart Mounted...');
        // console.log('MOUNT');
        document.addEventListener("keyup", this.onKeyPress);
        this.setUpChart(); 
    }

    componentDidUpdate(prevProps)
    {
        
        if(this.props.currentPrice !== prevProps.currentPrice)
        {
            // console.log('update head');
            // console.log(this.props.currentPrice)
            this.updateHead();
        }
        // this.updateChart();
    }

    componentWillReceiveProps(nextProps) {
        this.updateChart();
    }
    
    // componentWillUnmount() {
	// 	document.removeEventListener("keyup", this.onKeyPress);
    // }

    setUpChart()
    {

        console.log('---CHART SETUP---');

        const { chartdata: inputdata , extradata ,  startIndex , lastPoint } = this.props.chartProps;


        console.log('START INDEX : ',startIndex);

        let chartdata = inputdata.concat(extradata);

        const LENGTH_TO_SHOW = chartdata.length - startIndex;

        console.log('LENGTH : ',LENGTH_TO_SHOW);

        const dataToCalculate = chartdata.slice(-LENGTH_TO_SHOW);

        const calculatedData = dataToCalculate;

        const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

        const { index } = indexCalculator(calculatedData);


        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.withIndex(index);
		const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

        // console.log(linearData);

        this.setState({
            apidata : inputdata,
            extradata : extradata,  
            data: linearData, 
            lastPoint,         
            xScale,
            xAccessor, 
            displayXAccessor,
        },()=>{
            // console.log('set');
        });
    }

    updateChart()
    {
        
        // console.log("--UPDATE CHART--");
        const { chartdata: newdata , extradata , lastPoint } = this.props.chartProps;
        let chartdata = newdata.concat(extradata);
        // let chartdata = newdata;
        const { initialIndex } = this.state;
        /* SERVER - START */
        const dataToCalculate = chartdata.slice(
          -this.canvas.fullData.length
        );

        // console.log(dataToCalculate.length);

        // console.log(initialIndex);
    
        const calculatedData = dataToCalculate;
        const indexCalculator = discontinuousTimeScaleProviderBuilder()
          .initialIndex(initialIndex)
          .indexCalculator();
            
        // console.log(indexCalculator);

        const { index } = indexCalculator(calculatedData);
        // /* SERVER - END */
    
        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
          .initialIndex(initialIndex)
          .withIndex(index);
        const {
          data: linearData,
          xScale,
          xAccessor,
          displayXAccessor
        } = xScaleProvider(calculatedData.slice(-this.canvas.fullData.length));
    
        // // console.log(head(linearData), last(linearData))
        // // console.log(linearData.length)
    
        this.setState({
          apidata : newdata,
          extradata : extradata,
          data: linearData,
          lastPoint,
          xScale,
          xAccessor,
          displayXAccessor
        });
        
    }

    updateHead()
    {
        // console.log('update');
        let apidata = this.props.chartProps.chartdata;
        // console.log('Last point in stock chart ',apidata[apidata.length - 1]);
        apidata[apidata.length - 1].open = parseFloat(this.props.currentPrice);
        this.setState({
            apidata : apidata
        });
    }

    setChartConfiguration()
    {

    }

    handleDownloadMore(start, end) {

        // console.log('dm');
        if (Math.ceil(start) === end) return;
		// console.log("rows to download", rowsToDownload, start, end)
        console.log(this.state);
        const { data: prevData } = this.state;
		const { chartdata: inputData } = this.props.chartProps;

        console.log('PREV LENGTH : ',prevData.length);


        if (inputData.length === prevData.length) return;

        // console.log(end,start);

		const rowsToDownload = end - Math.ceil(start);


        const dataToCalculate = inputData
			.slice(-rowsToDownload  - prevData.length, - prevData.length);

        const calculatedData = dataToCalculate;

        // console.log(calculatedData);
        
        const indexCalculator = discontinuousTimeScaleProviderBuilder()
            .initialIndex(Math.ceil(start))
            .indexCalculator();
        const { index } = indexCalculator(
        calculatedData.slice(-rowsToDownload).concat(prevData)
        );
        /* SERVER - END */

        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
        .initialIndex(Math.ceil(start))
        .withIndex(index);

		const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData.slice(-rowsToDownload).concat(prevData));
		
        // console.log(linearData);
        setTimeout(() => {
			this.setState({
                data: linearData,
                xScale,
                xAccessor,
                displayXAccessor,
                initialIndex: Math.ceil(start)
			});
		}, 300);
        
    }

    handleSelection(interactives) {
		const state = toObject(interactives, each => {
			return [
                'trends',
				each.objects,
			];
		});
        this.setState(state);
        // console.log(this.state);
    }

    onDrawCompleteChart(trends)
    {
        console.log(trends);
        console.log(this.props.interactiveType);
        if(this.props.interactiveType === 'line')
        {
            this.setState({
                enableTrendLine: false,
                trends : trends
            });
        }
        else if(this.props.interactiveType === 'channel')
        {
            this.setState({
                enableChannel: false,
                channel : trends
            });
        }
        else if(this.props.interactiveType === 'SDchannel')
        {
            this.setState({
                enableSDChannel: false,
                SDchannel : trends
            });
        }
        else if(this.props.interactiveType === 'FibRet')
        {
            this.setState({
                enableFibRet: false,
                FibRet : trends
            });
        }
        else if(this.props.interactiveType === 'GannFan')
        {
            this.setState({
                enableGannFan: false,
                GannFan : trends
            });
        }
        console.log('Drawing Done....',this.state);
    }

    onKeyPress(e) {
		const keyCode = e.which;
		// console.log(keyCode);
		switch (keyCode) {
		case 46: { // DEL

			const trends = this.state.trends
                .filter(each => !each.selected);
            
            const channel = this.state.channel
                .filter(each => !each.selected);
        
            const SDchannel = this.state.SDchannel
                .filter(each => !each.selected);
                
            const FibRet = this.state.FibRet
                .filter(each => !each.selected);
            
            const GannFan = this.state.GannFan
				.filter(each => !each.selected);

			this.Canvas.cancelDrag();
			this.setState({
                trends,
                channel,
                SDchannel,
                FibRet,
                GannFan
            });
			break;
		}
        case 27: { // ESC
            
            // console.log(this.TrendLine_1);
			// this.node_1.terminate();
			// this.node_3.terminate();
			this.Canvas.cancelDrag();
			this.setState({
                enableTrendLine: false,
                enableChannel : false,
                enableSDChannel : false,
                enableFibRet : false,
                enableGannFan : false
			});
			break;
		}
		case 68:   // D - Draw trendline
        case 69: { // E - Enable trendline

            // console.log(this.props);
            
            if(this.props.interactiveType === 'line')
            {
                this.setState({
                    enableTrendLine: true,
                    enableChannel : false,
                    enableSDChannel : false,
                    enableFibRet : false,
                    enableGannFan : false
                });
            }
            else if(this.props.interactiveType === 'channel')
            {
                this.setState({
                    enableTrendLine: false,
                    enableChannel : true,
                    enableSDChannel : false,
                    enableFibRet : false,
                    enableGannFan : false
                });
            }
            else if(this.props.interactiveType === 'SDchannel')
            {
                this.setState({
                    enableTrendLine: false,
                    enableChannel : false,
                    enableSDChannel : true,
                    enableFibRet : false,
                    enableGannFan : false
                });
            }
            else if(this.props.interactiveType === 'FibRet')
            {
                this.setState({
                    enableTrendLine: false,
                    enableChannel : false,
                    enableSDChannel : false,
                    enableFibRet : true,
                    enableGannFan : false
                });
            }
            else if(this.props.interactiveType === 'GannFan')
            {
                this.setState({
                    enableTrendLine: false,
                    enableChannel : false,
                    enableSDChannel : false,
                    enableFibRet : false,
                    enableGannFan : true
                });
            }
            else
            {
                this.setState({
                    enableTrendLine: false,
                    enableChannel : false,
                    enableSDChannel : false,
                    enableFibRet : false,
                    enableGannFan : false
                });
            }
			
			break;
        }
        default : {
            break;
        }
	    }
    }

    getIndicatorData(indicator,chartdata)
    {
        let tempData,indicatorSeries,chartIndicatorY;

        if(indicator === 'SMA')
        {
            tempData = sma20(chartdata);
            chartIndicatorY = (d) =>[d.open,d.close];
            indicatorSeries =  <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} strokeWidth ={2}/>;
        }
        else if(indicator === 'WMA')
        {
            tempData = wma20(chartdata);
            chartIndicatorY = (d) =>[d.open,d.close];
            indicatorSeries =  <LineSeries yAccessor={wma20.accessor()} stroke={wma20.stroke()} strokeWidth ={2}/>;
        }
        else if(indicator === 'EMA')
        {
            tempData = ema20(chartdata);
            chartIndicatorY = (d) =>[d.open,d.close];
            indicatorSeries =  <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} strokeWidth ={2}/>;
        }
        else if(indicator === 'TMA')
        {
            tempData = tma20(chartdata);
            chartIndicatorY = (d) =>[d.open,d.close];
            indicatorSeries =  <LineSeries yAccessor={tma20.accessor()} stroke={tma20.stroke()} strokeWidth ={2}/>;
        }
        else if(indicator === 'BB')
        {
            tempData = bb(chartdata);
            chartIndicatorY = (d) =>[d.open,d.close];
            indicatorSeries =  <BollingerSeries yAccessor={d => d.bb} stroke={{top : '#c0392b' , middle : '#2c3e50' , bottom : '#c0392b'}} fill="#e67e22" opacity={0.5} />;
        }
        else if(indicator === 'MACD')
        {
            tempData = macdCalculator(chartdata);
            chartIndicatorY = macdCalculator.accessor();
            indicatorSeries = <MACDSeries yAccessor={d => d.macd} stroke={{macd : '#ff7675' , signal : '#00b894'}} fill={{divergence : '#3498db'}} width={3} zeroLineOpacity={0.8} widthRatio={1}/>;
        }
        else if(indicator === 'RSI')
        {
            tempData = rsiCalculator(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <RSISeries yAccessor={d => d.rsi} stroke={{line: "#000000" , top: "#000000" , middle: "#000000", bottom: "#000000", outsideThreshold: "#ff7675", insideThreshold: "#00b894"}} strokeWidth={{outsideThreshold : 2 , insideThreshold : 2 , top: 0.7, middle: 0.7, bottom: 0.7}}/>
        }
        else if(indicator === 'ATR')
        {
            tempData = atrCalculator(chartdata);
            chartIndicatorY = atrCalculator.accessor();
            indicatorSeries = <LineSeries yAccessor={atrCalculator.accessor()} stroke='#2ecc71' strokeWidth={2}/>
        }
        else if(indicator === 'SOSlow')
        {
            tempData = slowSTO(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <StochasticSeries yAccessor={d => d.slowSTO} stroke={{top : '#000000' , middle : '#000000' , bottom : '#000000' , dLine : '#e67e22' , kLine : '#1abc9c'}} refLineOpacity={0.7}/>;
        }
        else if(indicator === 'SOFast')
        {
            tempData = fastSTO(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <StochasticSeries yAccessor={d => d.fastSTO} stroke={{top : '#000000' , middle : '#000000' , bottom : '#000000' , dLine : '#e67e22' , kLine : '#1abc9c'}} refLineOpacity={0.7}/>
        }
        else if(indicator === 'SOFull')
        {
            tempData = fullSTO(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <StochasticSeries yAccessor={d => d.fullSTO} stroke={{top : '#000000' , middle : '#000000' , bottom : '#000000' , dLine : '#e67e22' , kLine : '#1abc9c'}} refLineOpacity={0.7}/>
        }
        else if(indicator === 'FI')
        {
            tempData = fiEMA(fi(chartdata));
            chartIndicatorY = fi.accessor();
            indicatorSeries = <>
                <AreaSeries baseAt={scale => scale(0)} yAccessor={fiEMA.accessor()} fill='#e67e22' stroke='#e74c3c' />
                <StraightLine yValue={0} />
            </>
        }
        else if(indicator === 'ERI')
        {
            tempData = elder(chartdata);  
            chartIndicatorY = [0,elder.accessor()];
            indicatorSeries = <ElderRaySeries yAccessor={elder.accessor()} bullPowerFill='#00b894' bearPowerFill='#ff7675' opacity={1} widthRatio={0.1}/>
        }
        else if(indicator === 'ERIBull')
        {
            tempData = elder(chartdata); 
            chartIndicatorY = [0,d => elder.accessor()(d) && elder.accessor()(d).bullPower];
            indicatorSeries = <>
                <BarSeries yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower} baseAt={(xScale, yScale, d) => yScale(0)} fill="#00b894" width={3} opacity={1} />
                <StraightLine yValue={0} />
            </> 
        }
        else if(indicator === 'ERIBear')
        {
            tempData = elder(chartdata); 
            chartIndicatorY = [0, d => elder.accessor()(d) && elder.accessor()(d).bearPower];
            indicatorSeries = <>
                <BarSeries yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower} baseAt={(xScale, yScale, d) => yScale(0)} fill="#ff7675" width={3} opacity={1} />
                <StraightLine yValue={0} />
            </> 
        }
        else if(indicator === 'ERIMP')
        {
            tempData = elderImpulseCalculator(macdCalculator(ema20(chartdata))); 
            chartIndicatorY = macdCalculator.accessor();
            indicatorSeries = <MACDSeries yAccessor={d => d.macd} stroke={{macd : '#ff7675' , signal : '#00b894'}} fill={{divergence : '#3498db'}} width={3} zeroLineOpacity={0.8} widthRatio={1}/>
        }
        else if(indicator === 'PSAR')
        {
            tempData = defaultSar(chartdata); 
            indicatorSeries = <SARSeries yAccessor={d => d.sar} fill={{
                falling: "#4682B4",
                rising: "#15EC2E",
            }}/>;
        }
        else if(indicator === 'vlmp')
        {
            tempData = ema20(chartdata);
            chartIndicatorY = [d => [d.high, d.low]];
            indicatorSeries = <VolumeProfileSeries fill='#000000'/>;
        }

        return [tempData,indicatorSeries,chartIndicatorY];
    }

    getChartType(chartType,chartdata)
    {

        let calculatedData,chartSeries;
        if(chartType === 'line'){
            calculatedData = chartdata;
            chartSeries = <>
                            <LineSeries yAccessor ={d =>d.open} strokeWidth={2} stroke="#00a0e3" interpolation={curveCardinal}/>
                            <LastPointIndicator yAccessor={d => d.open} displayFormat={format(".4s")} radius={4} fill='#00a0e3'/>
                          </>;
            
        }
        else if(chartType === 'rangeArea')
        {
            calculatedData = chartdata;
            chartSeries = <LineSeries yAccessor ={d =>d.open} strokeWidth ={30} stroke="#64b5f6"/>
        }
        else if(chartType === 'jumpLine')
        {
            calculatedData = chartdata;
            chartSeries = <ScatterSeries yAccessor ={d =>d.open} marker={SquareMarker} markerProps={{ width : 8 , height : 1 , fill : '#00A0E3' , stroke : '#00A0E3' , strokeWidth : 1}}/>
        }
        else if(chartType === 'column')
        {
           
            calculatedData = chartdata;
            chartSeries = <BarSeries yAccessor ={d =>d.open} width={5} stroke={false} fill='#00a0e3'/>
        }
        else if(chartType === 'stick')
        {
            calculatedData = chartdata;
            chartSeries = <BarSeries yAccessor ={d =>d.open} width={1} stroke={true} fill='#00a0e3'/>
        }
        else if(chartType === 'candlestick')
        {
            calculatedData = chartdata;
            chartSeries = <CandlestickSeries stroke='#ffffff' fill={d => d.close>d.open ? '#00A0E3' : '#EF6C00'} wickStroke={d => d.close>d.open ? '#00A0E3' : '#EF6C00'} opacity = '1'/>
        }
        else if(chartType === 'marker')
        {
            calculatedData = chartdata;
            chartSeries = <ScatterSeries yAccessor ={d =>d.open} marker={CircleMarker} markerProps={{r : 4 , fill : '#00A0E3' , stroke : '#00A0E3' , strokeWidth : 0.1}}/>
        }
        else if(chartType === 'ohlc')
        {
            calculatedData = chartdata;
            chartSeries = <OHLCSeries stroke={d => d.close>d.open ? '#00A0E3' : '#EF6C00'} clip={true}/>
        }
        else if(chartType === 'kagi')
        {

            const kagiCal = kagi();
            calculatedData = kagiCal(chartdata);
            chartSeries = <KagiSeries  strokeWidth={1} stroke={{yang : '#00A0E3' , yin : '#EF6C00'}}/>
        }
        else if(chartType === 'renko')
        {

            const renkoCal = renko();
            calculatedData = renkoCal(chartdata);
            chartSeries = <RenkoSeries yAccessor= {d => ({ open: d.open, high: d.high, low: d.low, close: d.close })}  stroke={{up : '#000000' , down : '#000000'}} fill={{up : '#00A0E3' , down : '#EF6C00' , partial : '#000000'}} clip={true}/>
        }
        else if(chartType === 'point')
        {

            const pointCal = pointAndFigure();
            calculatedData = pointCal(chartdata);
            chartSeries = <PointAndFigureSeries fill={{up : '#EF6C00' , down : '#81ecec'}} stroke= {{ up: "#EF6C00", down: "#00A0E3" }}/>
        }
        else{
            calculatedData = chartdata;
            chartSeries = <AreaSeries yAccessor ={d =>d.open} strokeWidth ={2} stroke="#64b5f6" fill='#00a0e3'/>
        }

        return [calculatedData,chartSeries];
    }

    getChartHeight(height,zoom,TotalCharts)
    {

        // console.log(height);
        if(zoom)
        {
            return (height/TotalCharts)-((20+((TotalCharts-1)*10))/(TotalCharts));
        }
        else
        {
            return height;
        }
    }

    getYExtents(zoom,high,low,lastPoint)
    {

        let h,l;
        if(zoom)
        {
            h = 1.5;
            l = 0.1
        }
        else
        {
            h = 0.5;
            l = 0.1;
        }
        if(high && low)
        {
            return [high+(high*(h/100)),low-(low*(l/100))];
        }
        else
        {
            return [lastPoint.high+(lastPoint.high*(h/100)),lastPoint.low-(lastPoint.low*(l/100))];
        }
    }

    getDisplayBuffer(range)
    {
        let buffer;
        if(range === 'D')
        {
            buffer = 20;
        }
        else if(range === '1D')
        {
            buffer = 60;
        }
        else if(range === '5D')
        {
            buffer = 80;
        }
        else if(range === '1M')
        {
            buffer = 60;
        }
        else if(range === '3M')
        {
            buffer = 90;
        }
        else if(range === '6M')
        {
            buffer = 90;
        }
        else if(range === 'YTD')
        {
            buffer = 30;
        }
        else if(range === '1Y')
        {
            buffer = 60;
        }
        else if(range === '5Y')
        {
            buffer = 60;
        }
        else if(range === 'MAX')
        {
            buffer = 40;
        }
        else
        {
            buffer = 2;
        }

        return buffer;
        
    }

    setInteractionType(type)
    {
        // console.log(type);
        let startDate = type.itemFirst.date;
        let endDate = type.itemLast.date;

        console.log(startDate,endDate)

        let xAccessorVal = this.state.xAccessor;
        let dataVal = this.state.data;

        let buffer = this.getDisplayBuffer(this.props.chartProps.range);

        let startIndx = dataVal.findIndex((d)=>{
            return d.date === startDate;
        });

        let endIndx = dataVal.findIndex((d)=>{
            return d.date === endDate;
        });

        // console.log(startIndx,endIndx);

        let start = xAccessorVal(dataVal[Math.min(startIndx,dataVal.length-1)]);
        let end = xAccessorVal(dataVal[Math.max(dataVal.length - (endIndx) + buffer,0)]);
        // console.log(dataVal[start],dataVal[end]);
        let xExtents = [start,end];

        console.log(start,end);

        if(this.state.chartConfig.xExtents !== xExtents)
        {
            // this.setState({
            //     chartConfig : {
            //         xExtents : xExtents
            //     }
            // })
        }
       
    }

    render() {

        if(this.state.data)
        {
            console.log('---RENDER CHART---');
            const {type,width,height,ratio,range,zoom,chartType,TotalCharts,IndicatorChartTypeArray,trendLineType} = this.props;

            const { data, xScale, xAccessor, displayXAccessor } = this.state;
            let margin;

            if(zoom)
            {
                margin = {left: 0, right: 60, top:0, bottom: 0};
            }
            else
            {
                margin = {left: 0, right: 0, top: 30, bottom: 20};
            }
            var gridHeight = height - margin.top - margin.bottom;
            var gridWidth = width - margin.left - margin.right;

            const showGrid = true;

            const gridProps = {
                
            }

            let chartSeries = this.getChartType(chartType);

            // console.log(this.props.zoom,this.props.width,this.props.height)


            return (
                <div>
                    <ChartCanvas 
                        ref={this.saveCanvas}
                        width={width} 
                        height={height} 
                        ratio={ratio}
                        margin = {margin}
                        seriesName="IBM"
                        postCalculator={compareCalculator}
                        xScale={xScale}
                        xAccessor={xAccessor}
                        displayXAccessor={displayXAccessor}
                        data={data}
                        type={type}
                        onLoadMore={this.handleDownloadMore}
                        zoomAnchor={lastValidVisibleItemBasedZoomAnchor} 
                    >


                    <Chart 
                        id={1} 
                        padding={30}
                        yExtents={d=> this.getYExtents(zoom,d.high,d.low,this.state.lastPoint)} 
                        height={this.getChartHeight(height,zoom,TotalCharts)}>

                        {/* {this.state.chartConfig.chartSeries} */}
                        {chartSeries}
                        {/* <LineSeries yAccessor ={d =>d.open} strokeWidth={2} stroke="#00a0e3" interpolation={curveCardinal}/> */}
                        {/* <LastPointIndicator yAccessor={d => d.open} displayFormat={format(".4s")} radius={4} fill='#00a0e3'/> */}

                        
                        {!zoom && <>
                            <EdgeIndicator 
                                orient="left"
                                edgeAt="right"
                                itemType="last"
                                yAccessor={d =>d.open}
                                displayFormat={format(".2f")}
                                arrowWidth={0}
                                fill="#ffffff"
                                fontSize={11}
                                textFill="#00a0e3"
                                strokeWidth={1}
                                lineOpacity={0}
                                dx={1}
                            />
                        </>}

                        {zoom && <>

                            <YAxis {...getYAxisProps()} {...gridProps}/>

                            {TotalCharts === 1 ? 
                                <>
                                    <XAxis {...getXAxisProps()} {...gridProps}/>
                                    <MouseCoordinateX {...getXCoordinateProps(range)}/>
                                    <LabelEdgeCoordinate 
                                        at="right"
                                        orient="left"
                                        price={this.state.lastPoint.open}
                                        displayFormat={format('.2f')}
                                        labelText={this.props.stockDetails.stockNSECode}
                                        fill="#00a0e3"
                                        rectHeight={18}
                                        rectWidth={this.props.stockDetails.stockNSECode.length * 11}
                                        dx={1}
                                        fontSize={11}
                                        strokeDasharray="ShortDot"
                                        lineStroke="#00a0e3"
                                        lineOpacity={0.5}
                                        textFill="#ffffff"
                                    />
                                    <PriceCoordinate 
                                        at="right"
                                        orient="right"
                                        price={this.state.lastPoint.open}
                                        displayFormat={format('.2f')}
                                        fill="#00a0e3"
                                        rectHeight={18}
                                        fontSize={11}
                                        hideLine={true}
                                        lineOpacity={0}
                                        
                                    />

                                    <EdgeIndicator 
                                        orient="right"
                                        edgeAt="right"
                                        itemType="last"
                                        yAccessor={d =>d.open}
                                        displayFormat={format(".2f")}
                                        arrowWidth={0}
                                        fill="#00a0e3"
                                        fontSize={11}
                                        rectHeight={18}
                                        strokeWidth={1}
                                        lineOpacity={0}
                                    />
                            
                                </> :
                                <>
                                    <XAxis {...getXAxisProps()} {...this.state.chartConfig.gridProps}/>
                                </>
                            }

                            
                            <MouseCoordinateY {...getYCoordinateProps()}/>
                        </>}
                        <PriceMarkerCoordinate 
                            at="left"
                            orient="right"
                            // price={this.state.closePrice}
                            price={100}
                            displayFormat={format('.2f')}
                            strokeDasharray="ShortDot"
                            dx={20} 
                            fill="#4E4E4E"
                            rectWidth={55}
                            rectHeight={20} 
                            fontSize={10}  
                        />

                        <HoverTooltip
                            tooltipContent={tooltipContent(range)}
                            fontSize={12}
                            bgOpacity={0}
                            fill='#ffffff'
                            opacity={1}
                            stroke='none'
                            isLabled={false}
                        />

                        {/* <TrendLine
                                ref={this.saveInteractiveNodes("Trendline", 1)}
                                enabled={this.state.enableTrendLine}
                                type={trendLineType}
                                snap={false}
                                snapTo={d => [d.high, d.low]}
                                onStart={() => console.log("START")}
                                onComplete={this.onDrawCompleteChart}
                                trends={this.state.trends}
                                currentPositionStroke='#f1c40f'
                                currentPositionStrokeWidth={4}
                                currentPositionRadius={5}
                                appearance={TrendLineAppearance}
                                hoverText={{
                                    text : 'Select'
                                }}
                            />

                            <EquidistantChannel
                                ref={this.saveInteractiveNodes("EquidistantChannel", 1)}
                                enabled={this.state.enableChannel}
                                onStart={() => console.log("START")}
                                onComplete={this.onDrawCompleteChart}
                                channels={this.state.channel}
                                currentPositionStroke='#f1c40f'
                                currentPositionStrokeWidth={4}
                                currentPositionRadius={5}
                                appearance={EquidistantChannelAppearance}
                                hoverText={{
                                    text : 'Select',
                                    bgHeight: 'auto',
                                    bgWidth: 'auto'
                                }}
                            />

                            <StandardDeviationChannel
                                ref={this.saveInteractiveNodes("StandardDeviationChannel", 1)}
                                enabled={this.state.enableSDChannel}
                                onStart={() => console.log("START")}
                                onComplete={this.onDrawCompleteChart}
                                channels={this.state.SDchannel}
                                currentPositionStroke='#f1c40f'
                                currentPositionStrokeWidth={4}
                                currentPositionRadius={5}
                                appearance={StandardDeviationChannelAppearance}
                            />

                            <FibonacciRetracement
                                ref={this.saveInteractiveNodes("FibonacciRetracement", 1)}
                                enabled={this.state.enableFibRet}
                                retracements={this.state.FibRet}
                                onComplete={this.onDrawCompleteChart}
                                currentPositionStroke='#f1c40f'
                                currentPositionStrokeWidth={4}
                                currentPositionRadius={5}
                                appearance= {FibRetAppearance}
                            />

                            <GannFan
                                ref={this.saveInteractiveNodes("GannFan", 1)}
                                enabled={this.state.enableGannFan}
                                onStart={() => console.log("START")}
                                onComplete={this.onDrawCompleteChart}
                                fans={this.state.GannFan}
                                currentPositionStroke='#f1c40f'
                                currentPositionStrokeWidth={4}
                                currentPositionRadius={5}
                                appearance= {GannFanAppearance}
                            /> */}

                    </Chart>

                    {/* {zoom && 
                        this.state.chartConfig.IndicatorsArray.map((i,index) => {
                            let series = i[1];
                            let yExtents = i[2];
                            let chartHeight = this.getChartHeight(height,zoom,TotalCharts);
                            let originHeight = (chartHeight*(index+1)) + (index+1)*10;
                            console.log(chartHeight,originHeight);
                            return <Chart class="my__chart" id={(index+2)} yExtents={yExtents} height={chartHeight} origin={(w,h)=>[0,originHeight]}>
                                {index === (this.state.chartConfig.IndicatorsArray.length-1) ? 
                                    <>
                                        <XAxis axisAt="bottom" orient="bottom" ticks={5} tickStroke='#888888' stroke='#c8c8c8' fontWeight={600} fontFamily="Open Sans, sans-serif" fontSize={10}/>
                                        <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat("%d %b '%y")} fontFamily="Open Sans, sans-serif" fontSize={12}/>
                                    </> : 
                                    <>
                                        <XAxis axisAt="bottom" orient="bottom" ticks={5} tickStroke='#888888' stroke='#c8c8c8' fontWeight={600} fontFamily="Open Sans, sans-serif" fontSize={10} showTicks={false} outerTickSize={0}/>
                                    </>
                                    
                                }   
                                <YAxis axisAt="right" orient="right" ticks={4} tickStroke='#888888' stroke='#c8c8c8' fontWeight={600} fontFamily="Open Sans, sans-serif" fontSize={10} tickFormat={format(".2f")}/>
                                <MouseCoordinateY at="right" orient="right" displayFormat={format(".2f")} arrowWidth={0} fontFamily="Open Sans, sans-serif" fontSize={12}/>
                                {series}
                                
                            </Chart>
                        })
                    } */}

                    {zoom && <CrossHairCursor />}

                </ChartCanvas>
                </div>
            )
        }
        else
        {
            return (
                <p>Loading</p>
            )
        }
    }
}

StockChart.propTypes = {
    // data : PropTypes.array.isRequired,
    width : PropTypes.number.isRequired,
    ratio : PropTypes.number.isRequired,
    type : PropTypes.oneOf(['svg','hybrid']).isRequired
};

StockChart.defaultProps ={
    type : 'svg',
}

StockChart = fitWidth(StockChart);

export default StockChart;
