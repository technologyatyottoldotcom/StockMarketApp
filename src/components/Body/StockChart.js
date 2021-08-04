import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import {scaleTime} from 'd3-scale';
import { format } from 'd3-format';
import { curveMonotoneX, curveCardinal } from "d3-shape";
import {ChartCanvas,Chart} from 'react-stockcharts';
import {XAxis,YAxis} from 'react-stockcharts/lib/axes';
import {LineSeries,AreaSeries,BarSeries,CandlestickSeries,ScatterSeries ,OHLCSeries,KagiSeries,RenkoSeries,PointAndFigureSeries, SquareMarker,CircleMarker , BollingerSeries , MACDSeries , RSISeries ,StochasticSeries ,StraightLine ,ElderRaySeries , SARSeries , VolumeProfileSeries} from 'react-stockcharts/lib/series';
import { pointAndFigure ,kagi,renko , compare} from "react-stockcharts/lib/indicator";
import { discontinuousTimeScaleProvider , discontinuousTimeScaleProviderBuilder } from "react-stockcharts/lib/scale";
import {fitWidth} from 'react-stockcharts/lib/helper';
import { TrendLine,EquidistantChannel,StandardDeviationChannel ,FibonacciRetracement ,GannFan} from "react-stockcharts/lib/interactive";
import {TrendLineAppearance,EquidistantChannelAppearance,StandardDeviationChannelAppearance,FibRetAppearance,GannFanAppearance} from '../../exports/InteractiveAppearance';
import { last ,toObject , rightDomainBasedZoomAnchor , lastVisibleItemBasedZoomAnchor } from "react-stockcharts/lib/utils/zoomBehavior";
import {lastValidVisibleItemBasedZoomAnchor} from './CustomChartComponents/ZoomBehaviour/zoomBehaviour';
import { timeFormat } from 'd3-time-format';
import {saveInteractiveNodes, getInteractiveNodes} from "../../exports/InteractiveUtils";
import { HoverTooltip } from "./CustomChartComponents/HoverTooltip/HoverTooltip";
import {getXCoordinateProps, getYCoordinateProps, getXAxisProps, getYAxisProps , tooltipContent } from '../../exports/ChartProps';
import {getMaxArray,CalculateIndicatorData} from '../../exports/MathematicalIndicators';
import LastPointIndicator from './CustomChartComponents/LastPointEdgeIndicator/LastPointIndicator';
import {getChartHeight,getIndicatorData,ChartWrapper,ChartWrapperZoom,ChartWrapperCompare,ChartIndicators,ChartIndicatorInside} from './Charts/ChartFunctions';
import { splitAdjustment } from '../../exports/SplitAdjustment';
import { CrossHairCursor,MouseCoordinateX, MouseCoordinateY ,PriceCoordinate, EdgeIndicator } from "react-stockcharts/lib/coordinates";
import IndicatorOptions from './CustomChartComponents/IndicatorOptions/IndicatorOptions';


function getMaxUndefined(calculators) {
    console.log(calculators)
	if(calculators.length > 0)
    {
        return calculators.map(each => each.undefinedLength && each.undefinedLength()).reduce((a, b) => Math.max(a, b));
    }
    else
    {
        return 0;
    }
}

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
        this.setUpChart = this.setUpChart.bind(this);
        this.handleDownloadMore = this.handleDownloadMore.bind(this);



        this.state = {
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
            chartProps : this.props.chartProps,
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
        else if(this.props.CompareStockConfig.length !== prevProps.CompareStockConfig.length)
        {
            console.log('Compare Added');
            this.updateChart();
        }
        else if(this.props.IndicatorOutside.length !== prevProps.IndicatorOutside.length
                 || this.props.IndicatorInside.length !== prevProps.IndicatorInside.length
                 || this.props.OldIndicator !== prevProps.OldIndicator
                 || this.props.TotalSwapCharts !== prevProps.TotalSwapCharts )
        {
            console.log('Indicator Added');
            this.updateChart();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateChart();
    }
    
    componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
    }

    setUpChart()
    {

        console.log('---CHART SETUP---');

        const { chartdata: inputdata , extradata ,  startIndex , lastPoint } = this.props.chartProps;


        console.log('START INDEX : ',startIndex);

        // console.log(inputdata);

        let sadata = splitAdjustment(inputdata);

        const maxWindowSize = getMaxUndefined(getMaxArray(this.props.IndicatorOutside));
        let chartdata,dataToCalculate,calculatedData,accessordata,LENGTH_TO_SHOW;

        if(this.props.IndicatorOutside.length === 0)
        {
            chartdata = sadata.concat(extradata);
            LENGTH_TO_SHOW = chartdata.length - startIndex;
            dataToCalculate = chartdata.slice(
                -LENGTH_TO_SHOW - maxWindowSize
            );
            calculatedData = dataToCalculate;
            accessordata = calculatedData;
        }

        else
        {
            chartdata = sadata;
            LENGTH_TO_SHOW = chartdata.length - startIndex;
            dataToCalculate = chartdata.slice(
                -LENGTH_TO_SHOW - maxWindowSize
            );
            calculatedData = dataToCalculate;
            accessordata = calculatedData;

        }

        // let chartdata = sadata.concat(extradata);
        // let chartdata = sadata;


        

        // const dataToCalculate = chartdata.slice(-LENGTH_TO_SHOW - maxWindowSize);

        // let calculatedData = dataToCalculate;

        const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();


        const { index } = indexCalculator(calculatedData);



        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.withIndex(index);
		const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(accessordata);


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
        const { initialIndex } = this.state;

        let chartdata,dataToCalculate,calculatedData,accessordata;

        if(this.props.IndicatorOutside.length === 0)
        {
            chartdata = newdata.concat(extradata);
            dataToCalculate = chartdata.slice(
                -this.canvas.fullData.length
            );
            calculatedData = dataToCalculate;
            accessordata = calculatedData.slice(-this.canvas.fullData.length);
        }

        else
        {
            chartdata = newdata;
            dataToCalculate = chartdata.slice(
                -this.canvas.fullData.length
            );
            calculatedData = dataToCalculate;
            accessordata = calculatedData;

        }

        calculatedData = CalculateIndicatorData(this.props.IndicatorOutside,dataToCalculate);

        // console.log(calculatedData[calculatedData.length - 1])

        /* SERVER - START */

        const indexCalculator = discontinuousTimeScaleProviderBuilder()
          .initialIndex(initialIndex)
          .indexCalculator();

        const { index } = indexCalculator(calculatedData);

        // /* SERVER - END */
    
        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
          .initialIndex(initialIndex)
          .withIndex(index);

        let {
          data: linearData,
          xScale,
          xAccessor,
          displayXAccessor
        } = xScaleProvider(calculatedData.slice(-this.canvas.fullData.length));

        // console.log(linearData);
    
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

    handleDownloadMore(start, end) {

        // console.log('dm');
        if (Math.ceil(start) === end) return;
		console.log("rows to download", start, end)
        // console.log(this.state);
        const { data: prevData } = this.state;
		const { chartdata: inputData } = this.props.chartProps;

        // console.log('PREV LENGTH : ',prevData.length);


        if (inputData.length === prevData.length) return;

        // console.log(end,start);

		const rowsToDownload = end - Math.ceil(start);

        const maxWindowSize = getMaxUndefined(getMaxArray(this.props.IndicatorOutside));
        // const maxWindowSize = getMaxUndefined([this.state.wma26,this.state.sma26]);

        const dataToCalculate = inputData
			.slice(-rowsToDownload - maxWindowSize - prevData.length, - prevData.length);

        const calculatedData = CalculateIndicatorData(this.props.IndicatorOutside,dataToCalculate);
        // const calculatedData = this.state.wma26(this.state.sma26(dataToCalculate));

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
        // console.log(this.canvas);
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

			this.canvas.cancelDrag();
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
			this.canvas.cancelDrag();
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
                console.log('LINE')
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

    
    getYExtents(range,zoom,open,high,low,lastPoint)
    {


        if(range === '1Y' || range === '5Y' || range === 'MAX')
        {
            return [open + open*(0.1),open - open*(0.1)]
        }
        else
        {
            let h,l;
            if(zoom)
            {
                h = 0.2;
                l = 0.1
            }
            else
            {
                h = 0.15;
                l = 0.1;
            }
            if(high && low)
            {
                return [high+(high*(h/100)),low-(low*(l/100))];
            }
            else
            {
                // console.log(lastPoint.high+(lastPoint.high*(h/100)),lastPoint.low-(lastPoint.low*(l/100)))
                return [lastPoint.high+(lastPoint.high*(h/100)),lastPoint.low-(lastPoint.low*(l/100))];
            }
        }
    }

    getCompareYExtents(compare)
    {
        // console.log(compare);
        let arr = Object.values(compare);
        if(arr.length > 0)
        {
            return [Math.max(...arr)+0.004,Math.min(...arr)-0.004];
        }
        return compare;
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

    
    render() {

        if(this.state.data)
        {
            // console.log('---RENDER CHART---')
            const {type,width,height,ratio,range,zoom,chartType,TotalCharts,IndicatorOutside,IndicatorInside,trendLineType} = this.props;

            let { data, xScale, xAccessor, displayXAccessor } = this.state;

            // console.log(data,xScale,xAccessor,displayXAccessor);

            // console.log(width);

            // console.log('INDICATOR CHART ARRAY : ',IndicatorOutside,IndicatorInside);

            let margin;

            if(zoom)
            {
                margin = {left: 0, right: 60, top:0, bottom: 0};
            }
            else
            {
                margin = {left: 0, right: 0, top: 30, bottom: 0};
            }
            var gridHeight = height - margin.top - margin.bottom;
            var gridWidth = width - margin.left - margin.right;

            const showGrid = true;

            const gridProps = {
                
            }

            let chartSeries = this.getChartType(chartType);

            // console.log(this.props.zoom,this.props.width,this.props.height)

            //compare stock configurations
            let CompareStockConfig = this.props.CompareStockConfig;

            let CompareCodes = [];

            CompareStockConfig.forEach((c)=>{
                CompareCodes.push(c.symbol+'open')
            });

            // console.log(CompareCodes);

            const compareCalculator = compare()
            .options({
                basePath: "open",
                mainKeys: [],
                compareKeys: ["open", ...CompareCodes],
            })
            .accessor(d => d.compare)
            .merge((d, c) => { d.compare = c; });

            let postCalculator,yExtents;

            const yAcc = (d, s) => {
                // console.log("Data : ", d, s);
                return d.compare[s];
            };

            if(CompareStockConfig.length > 0)
            {
                postCalculator = compareCalculator;
                yExtents = (d) => this.getCompareYExtents(d.compare)
            }
            else
            {
                yExtents = (d) =>this.getYExtents(range,zoom,d.open,d.high,d.close,this.state.lastPoint);
            }



            return (
                <div>
                    <ChartCanvas 
                        ref={node => this.saveCanvas(node)}
                        width={width} 
                        height={height} 
                        ratio={ratio}
                        margin={margin}
                        seriesName="IBM"
                        postCalculator={postCalculator}
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
                        padding={0}
                        yExtents={yExtents}
                        origin={[0,0]} 
                        height={getChartHeight(height,zoom,TotalCharts)}
                        // height={200}

                    >


                        {!zoom && <>
                            {CompareStockConfig.length > 0 ? 
                                (ChartWrapperCompare(zoom,range,this.props.stockDetails,CompareStockConfig,this.props.toggleHide,this.props.removeStock))
                                :
                                (ChartWrapper(range,chartType,this.props.closePrice))
                            }
                        </>}

                        {zoom && <>
                            {
                                CompareStockConfig.length > 0 ? 
                                (ChartWrapperCompare(zoom,range,this.props.stockDetails,CompareStockConfig,this.props.toggleHide,this.props.removeStock,this.props.TotalCharts))
                                :

                                (ChartWrapperZoom(range,this.state.lastPoint,this.props.stockDetails,chartType,this.props.closePrice,this.props.TotalCharts))
                                
                            }


                        </>}

                        {zoom && 

                            <>
                                <TrendLine
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
                                /> 

                            </>
                        }

                    </Chart>

                    {zoom &&
                        IndicatorOutside.map((indicator,index)=>{
                            const [indicatordata,yAccessor,series,title,accessor,color,indicatorConfig] = getIndicatorData(indicator,data);

                            let chartHeight = getChartHeight(height,zoom,TotalCharts);
                            let originHeight = (chartHeight*(index+1)) + (index+1)*10;

                                    {/* console.log(indicatordata); */}

                            return <Chart id={(index+2)} yExtents={accessor} height={chartHeight} origin={(w,h)=>[0,originHeight]} padding={5}>

                                {ChartIndicators(index,indicator,width,height,range,series,title,color,indicatorConfig,yAccessor,TotalCharts,IndicatorOutside,this.props.DeleteIndicatorType,this.props.SwapCharts)}
                                
                            </Chart>
                        })
                    }


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


{/* IndicatorInside.map((indicator,index)=>{
                                    const [indicatordata,yAccessor,series,title,accessor,color,indicatorConfig] = getIndicatorData(indicator,data);
                                    return ChartIndicatorInside(indicator,series)
                                }) */}