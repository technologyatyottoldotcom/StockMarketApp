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
import {TrendLine,EquidistantChannel,StandardDeviationChannel ,FibonacciRetracement ,GannFan,DrawingObjectSelector} from "react-stockcharts/lib/interactive";
import {TrendLineAppearance,EquidistantChannelAppearance,StandardDeviationChannelAppearance,FibRetAppearance,GannFanAppearance} from '../../exports/InteractiveAppearance';
import { toObject } from "react-stockcharts/lib/utils";
import {lastValidVisibleItemBasedZoomAnchor} from './CustomChartComponents/ZoomBehaviour/zoomBehaviour';
import { timeFormat } from 'd3-time-format';
import {saveInteractiveNodes, getInteractiveNodes} from "../../exports/InteractiveUtils";
import { HoverTooltip } from "./CustomChartComponents/HoverTooltip/HoverTooltip";
import {getXCoordinateProps, getYCoordinateProps, getXAxisProps, getYAxisProps , tooltipContent } from '../../exports/ChartProps';
import {getMaxArray,CalculateIndicatorData} from '../../exports/MathematicalIndicators';
import LastPointIndicator from './CustomChartComponents/LastPointEdgeIndicator/LastPointIndicator';
import {getChartHeight,getHeroHeight,getIndicatorData,getCompareIndicatorData,ChartWrapper,ChartWrapperZoom,ChartWrapperCompare,ChartIndicators,ChartIndicatorInside,ChartToolTip} from './Charts/ChartFunctions';
import { splitAdjustment } from '../../exports/SplitAdjustment';
import { CrossHairCursor,MouseCoordinateX, MouseCoordinateY ,PriceCoordinate, EdgeIndicator } from "react-stockcharts/lib/coordinates";
import InteractiveSettingPopup from './AppPopups/InteractiveSettingPopup/InteractiveSettingPopup';


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
        this.handleSelection = this.handleSelection.bind(this);
        this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
        this.getInteractiveNodes = getInteractiveNodes.bind(this);
        this.saveCanvas = this.saveCanvas.bind(this);
        this.onDrawCompleteChart = this.onDrawCompleteChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.updateHead = this.updateHead.bind(this);
        this.setUpChart = this.setUpChart.bind(this);
        this.handleDownloadMore = this.handleDownloadMore.bind(this);
        this.wrapCanvas = this.wrapCanvas.bind(this);
        this.saveSelectedInteractive = this.saveSelectedInteractive.bind(this);
        this.deleteSelectedInteractive = this.deleteSelectedInteractive.bind(this);
        this.setInteractiveStatus = this.setInteractiveStatus.bind(this);

        this.state = {
            data : null,
            xScale : null,
            xAccessor : null, 
            displayXAccessor : null,
            initialIndex: 0,
            apidata : this.props.chartProps.chartdata,
            extradata : this.props.chartProps.extradata,
            chartdata : null,
            interactiveData : {
                trends : [],
                channels : [],
                sdchannel : [],
                retracements : [],
                fans : [],
            },
            interactiveStatus : {
                trends : false,
                channels : false,
                sdchannel : false,
                retracements : false,
                fans : false,
            },
            selectedInteractive : {},
            isSelected : false,
            interactiveFlag : false,
            chartProps : this.props.chartProps,
        };
    }

    saveCanvas(node) {
		this.canvas = node;
    }
    
    componentDidMount() {
        console.log('Stock Chart Mounted...');
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
        else if(this.props.interFlag !== prevProps.interFlag)
        {
            console.log('Update Interactives');
            this.setInteractiveStatus(this.props.interactiveType);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateChart();
    }
    
    setUpChart()
    {

        console.log('---CHART SETUP---');

        const { chartdata: inputdata , extradata ,  startIndex , lastPoint } = this.props.chartProps;


        console.log('START INDEX : ',startIndex);

        // console.log(inputdata);

        let sadata = splitAdjustment(inputdata);

        let IndicatorAll = this.props.IndicatorOutside.concat(this.props.IndicatorInside);

        const maxWindowSize = getMaxUndefined(getMaxArray(IndicatorAll));
        let chartdata,dataToCalculate,calculatedData,accessordata,LENGTH_TO_SHOW;

        if(IndicatorAll.length === 0)
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

        let IndicatorAll = this.props.IndicatorOutside.concat(this.props.IndicatorInside);

        if(IndicatorAll.length === 0)
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

        calculatedData = CalculateIndicatorData(IndicatorAll,dataToCalculate);

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

        let IndicatorAll = this.props.IndicatorOutside.concat(this.props.IndicatorInside);

        const maxWindowSize = getMaxUndefined(getMaxArray(IndicatorAll));
        // const maxWindowSize = getMaxUndefined([this.state.wma26,this.state.sma26]);

        const dataToCalculate = inputData
			.slice(-rowsToDownload - maxWindowSize - prevData.length, - prevData.length);

        const calculatedData = CalculateIndicatorData(IndicatorAll,dataToCalculate);
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

    setInteractiveStatus(type)
    {
        console.log(type)
        type = type.toLowerCase();
        if(type === 'line')
        {
            this.setState({
                interactiveStatus : {
                    trends : true,
                    channels : false,
                    sdchannel : false,
                    retracements : false,
                    fans : false,   
                }
            });
        }
        else if(type === 'channel')
        {
            this.setState({
                interactiveStatus : {
                    trends : false,
                    channels : true,
                    sdchannel : false,
                    retracements : false,
                    fans : false,   
                }
            });
        }
        else if(type === 'sdchannel')
        {
            this.setState({
                interactiveStatus : {
                    trends : false,
                    channels : false,
                    sdchannel : true,
                    retracements : false,
                    fans : false,   
                }
            });
        }
        else if(type === 'retracements')
        {
            this.setState({
                interactiveStatus : {
                    trends : false,
                    channels : false,
                    sdchannel : false,
                    retracements : true,
                    fans : false,   
                }
            });
        }
        else if(type === 'fans')
        {
            this.setState({
                interactiveStatus : {
                    trends : false,
                    channels : false,
                    sdchannel : false,
                    retracements : false,
                    fans : true,   
                }
            });
        }
        else
        {
            this.setState({
                enableTrendLine: false,
                enableChannel : false,
                enableSDChannel : false,
                enableretracements : false,
                enablefans : false
            });
        }
			
    }

    getInteractiveType(type)
    {
        type = type && type !== ''?type.split(' ').join('').toLowerCase() : '';

        if(type === '')
        {
            return ''
        }
        else if(type === 'trendline')
        {
            return 'trends'
        }
        else if(type === 'equidistantchannel')
        {
            return 'channels'
        }
        else if(type === 'standarddeviationchannel')
        {
            return 'sdchannel'
        }
        else if(type === 'fibonacciretracement')
        {
            return 'retracements'
        }
        else if(type === 'gannfan')
        {
            return 'fans'
        }
    }

    handleSelection(interactives) {

        // console.log(interactives)
        const state = toObject(interactives, each => {
            return [
                this.getInteractiveType(each.type),
                each.objects,
            ];
        });

        // console.log(state)
        this.setState({
            interactiveData : {
                ...this.state.interactiveData,
                ...state
            }
        },()=>{
            this.getSelectedInteractive(state);
            // console.log(this.state.interactiveData)
        });
    }

    findSelected(config)
    {
        let selecteditem = {};

        for(var key of Object.keys(config))
        {
            const items = config[key];
            const selected = items.find(i => i.selected === true);

            if(selected)
            {
                selecteditem = {
                    config : selected,
                    type : key
                };
                break;
            }
        }

        // console.log(selecteditem);
        return selecteditem;

    }

    getSelectedInteractive(config)
    {
        const selecteditem = this.findSelected(config);

        // console.log(selecteditem)

        if(selecteditem && selecteditem.config)
        {
            this.setState({
                isSelected : true,
                selectedInteractive : selecteditem.config,
                selectedtype : selecteditem.type,
                interactiveFlag : !this.state.interactiveFlag,
            });
        }
        else
        {
            this.setState({
                isSelected : false,
            });
        }
        // config = config[type];
        // if(config && config.length > 0)
        // {
        //     const selected = config.find(c=> c.selected === true);

        //     // console.log(selected);

        //     if(selected)
        //     {
        //         this.setState({
        //             isSelected : true,
        //             selectedInteractive : selected,
        //             interactiveFlag : !this.state.interactiveFlag,
        //         },()=>{
        //             console.log(this.state.isSelected,this.state.selectedInteractive)
        //         });
        //     }
        //     else
        //     {
        //         this.setState({
        //             isSelected : false,
        //         });
        //     }
        // }
    }

    saveSelectedInteractive(config)
    {
        // console.log(config)
        const selectedtype = this.state.selectedtype;

        const items = this.state.interactiveData[this.state.selectedtype];
        // console.log(items);

        const selected = items.findIndex(t => t.selected === true);
        // console.log(selected)
        if(selected >= 0)
        {
            // console.log(items[selected]);
            items[selected]['appearance'] = config['appearance'];
            // console.log(items,items[selected]);
            this.setState({
                interactiveData : {
                    ...this.state.interactiveData,
                    selectedtype : items
                },
            })
        }
    }

    deleteSelectedInteractive(selectedtype)
    {
        // console.log(selectedtype);
        const items = this.state.interactiveData[selectedtype];
        if(items.length > 0)
        {
            const selectedindx = items.findIndex(i=> i.selected === true);
            // console.log(selectedindx);
            if(selectedindx >= 0)
            {
                items.splice(selectedindx,1);
                this.setState({
                    isSelected : false,
                    selectedInteractive : {},
                    selectedtype : '',
                    interactiveFlag : !this.state.interactiveFlag,
                    interactiveData : {
                        ...this.state.interactiveData,
                        selectedindx : items
                    }
                })
            }
        }
    }

    onDrawCompleteChart(trends,type)
    {
        // console.log(trends,type);
        // console.log(this.props.interactiveType);
        const {interactiveData,interactiveStatus} = this.state;
        if(type === 'trends')
        {

            this.setState({
                interactiveData : {
                    ...interactiveData,
                    trends : trends
                },
                interactiveStatus : {
                    ...interactiveStatus,
                    trends : false
                },
                
            })
        }
        else if(type === 'channels')
        {
            this.setState({
                interactiveData : {
                    ...interactiveData,
                    channels : trends
                },
                interactiveStatus : {
                    ...interactiveStatus,
                    channels : false
                },
                
            })
        }
        else if(type === 'sdchannel')
        {
            this.setState({
                interactiveData : {
                    ...interactiveData,
                    sdchannel : trends
                },
                interactiveStatus : {
                    ...interactiveStatus,
                    sdchannel : false
                },
                
            })
        }
        else if(type === 'retracements')
        {
            this.setState({
                interactiveData : {
                    ...interactiveData,
                    retracements : trends
                },
                interactiveStatus : {
                    ...interactiveStatus,
                    retracements : false
                },
                
            })
        }
        else if(type === 'fans')
        {
            this.setState({
                interactiveData : {
                    ...interactiveData,
                    fans : trends
                },
                interactiveStatus : {
                    ...interactiveStatus,
                    fans : false
                },
                
            });
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
                l = 0.5;
            }
            else
            {
                h = 0.15;
                l = 0.5;
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
            return [Math.max(...arr)+0.010,Math.min(...arr)-0.010];
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

    wrapCanvas()
    {
        this.canvas.cancelDrag();
    }


    
    render() {

        if(this.state.data)
        {
            // console.log('---RENDER CHART---')
            const {type,width,height,ratio,range,zoom,chartType,TotalCharts,IndicatorOutside,IndicatorInside,trendLineType} = this.props;

            let { data, xScale, xAccessor, displayXAccessor } = this.state;

            const {interactiveData , interactiveStatus} = this.state;

            // console.log(data);

            // console.log(IndicatorInside);

            let margin,padding;

            if(zoom)
            {
                margin = {left: 0, right: 60, top:0, bottom: 0};
                padding = 0;
            }
            else
            {
                margin = {left: 0, right: 0, top: 30, bottom: 0};
                padding = 60;
            }
            var gridHeight = height - margin.top - margin.bottom;
            var gridWidth = width - margin.left - margin.right;

            const showGrid = true;

            const gridProps = {
                
            }

            let chartSeries = this.getChartType(chartType);

            //compare stock configurations
            let CompareStockConfig = this.props.CompareStockConfig;

            let CompareCodes = [];

            CompareStockConfig.forEach((c)=>{
                CompareCodes.push(c.symbol+'open')
            });

            IndicatorInside.forEach((i)=>{
                CompareCodes.push(i.toLowerCase())
            })

            // console.log(CompareCodes);

            const compareCalculator = compare()
            .options({
                basePath: "open",
                mainKeys: ["high", "low", "close"],
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

            // console.log(data);

            return (
                <>
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
                        padding={padding}
                        yExtents={yExtents}
                        origin={[0,0]} 
                        height={getHeroHeight(height,zoom,IndicatorOutside.length)}
                        // height={200}

                    >


                        {!zoom && <>
                            {CompareStockConfig.length > 0 ? 
                                <>
                                {ChartWrapperCompare(zoom,range,chartType,this.props.stockDetails,CompareStockConfig,this.props.TotalCharts)}
                                {IndicatorInside.map((indicator,index)=>{
                                        const [indicatordata,yAccessor,tooltipAccessor,series,title,accessor,color,indicatorConfig,indicatorSettings] = getCompareIndicatorData(indicator,data);
                                        return ChartIndicatorInside(series,yAccessor,tooltipAccessor,title,indicatorSettings)
                                    })} 
                                </>
                                :
                                (ChartWrapper(range,chartType,this.props.closePrice))
                            }
                        </>}

                        {zoom && <>
                            {
                                CompareStockConfig.length > 0 ? 
                                <>
                                    {ChartWrapperCompare(zoom,range,chartType,this.props.stockDetails,CompareStockConfig,this.props.TotalCharts)}
                                    {IndicatorInside.map((indicator,index)=>{
                                        const [indicatordata,yAccessor,tooltipAccessor,series,title,accessor,color,indicatorConfig,indicatorSettings] = getCompareIndicatorData(indicator,data);
                                        return ChartIndicatorInside(series,yAccessor,tooltipAccessor,title,indicatorSettings)
                                    })}
                                </>
                                :
                                (ChartWrapperZoom(range,this.state.lastPoint,this.props.stockDetails,chartType,this.props.closePrice,this.props.TotalCharts))
                                
                            }


                        </>}

                        {zoom && <>
                            {ChartToolTip(data,zoom,CompareStockConfig,IndicatorInside,this.props.toggleHide,this.props.removeStock,this.props.toggleCompareSettings,this.props.DeleteIndicatorType,this.props.toggleIndicatorSettings)}
                        </>}

                        {zoom && CompareStockConfig.length ===0 && <>
                            {IndicatorInside.map((indicator,index)=>{
                                const [indicatordata,yAccessor,tooltipAccessor,series,title,accessor,color,indicatorConfig,indicatorSettings] = getIndicatorData(indicator,data);
                                return ChartIndicatorInside(series,yAccessor,tooltipAccessor,title,indicatorSettings)
                            })}
                        </>}

                        {zoom && 

                            <>

                                <TrendLine
                                        ref={this.saveInteractiveNodes("Trendline", 1)}
                                        enabled={interactiveStatus.trends}
                                        type={trendLineType}
                                        snap={false}
                                        snapTo={d => [d.high, d.low]}
                                        onStart={() => console.log("START")}
                                        onComplete={d => this.onDrawCompleteChart(d,'trends')}
                                        trends={interactiveData.trends}
                                        currentPositionStrokeWidth={2}
                                        currentPositionRadius={5}
                                        hoverText={{
                                            enable : false
                                        }}
                                        
                                /> 

                                <EquidistantChannel
                                    ref={this.saveInteractiveNodes("EquidistantChannel", 1)}
                                    enabled={interactiveStatus.channels}
                                    onStart={() => console.log("START")}
                                    onComplete={d => this.onDrawCompleteChart(d,'channels')}
                                    channels={interactiveData.channels}
                                    currentPositionStroke='#f1c40f'
                                    currentPositionStrokeWidth={4}
                                    currentPositionRadius={5}
                                    hoverText={{
                                        enable: false
                                    }}
                                />

                                <StandardDeviationChannel
                                    ref={this.saveInteractiveNodes("StandardDeviationChannel", 1)}
                                    enabled={interactiveStatus.sdchannel}
                                    onStart={() => console.log("START")}
                                    onComplete={d => this.onDrawCompleteChart(d,'sdchannel')}
                                    channels={interactiveData.sdchannel}
                                    currentPositionStroke='#f1c40f'
                                    currentPositionStrokeWidth={4}
                                    currentPositionRadius={5}
                                        hoverText={{
                                            enable: false
                                        }}
                                />

                                <FibonacciRetracement
                                    ref={this.saveInteractiveNodes("FibonacciRetracement", 1)}
                                    enabled={interactiveStatus.retracements}
                                    retracements={interactiveData.retracements}
                                    onComplete={d => this.onDrawCompleteChart(d,'retracements')}
                                    currentPositionStroke='#f1c40f'
                                    currentPositionStrokeWidth={4}
                                    currentPositionRadius={5}
                                        hoverText={{
                                            enable: false
                                        }}
                                />

                                <GannFan
                                    ref={this.saveInteractiveNodes("GannFan", 1)}
                                    enabled={interactiveStatus.fans}
                                    onStart={() => console.log("START")}
                                    onComplete={d => this.onDrawCompleteChart(d,'fans')}
                                    fans={interactiveData.fans}
                                    currentPositionStroke='#00a0e3'
                                    currentPositionStrokeWidth={4}
                                    currentPositionRadius={5}
                                    currentPositionOpacity={1}
                                    appearance= {GannFanAppearance}

                                />

                            
                            </>
                        }

                    </Chart>

                    {zoom &&
                        IndicatorOutside.map((indicator,index)=>{
                            const [indicatordata,yAccessor,tooltipAccessor,series,title,accessor,color,indicatorConfig,indicatorSettings] = getIndicatorData(indicator,data);

                            let chartConfig = getChartHeight(height,zoom,IndicatorOutside.length);
                            let chartHeight = chartConfig.height;
                            let originHeight = chartConfig.origin + (chartHeight*(index)) + (index)*10;

                                    {/* console.log(indicatordata); */}

                            return <Chart key={index} id={(index+2)} yExtents={accessor} height={chartHeight} origin={(w,h)=>[0,originHeight]} padding={5}>

                                {ChartIndicators(index,indicator,width,height,range,series,title,color,indicatorConfig,indicatorSettings,yAccessor,TotalCharts,IndicatorOutside,this.props.DeleteIndicatorType,this.props.toggleIndicatorSettings,this.props.SwapCharts)}
                                
                            </Chart>
                        })
                    }

                    <DrawingObjectSelector
                        enabled={
                                !interactiveStatus.trends && 
                                !interactiveStatus.channels &&
                                !interactiveStatus.sdchannel &&
                                !interactiveStatus.retracements &&
                                !interactiveStatus.fans
                            }
                        getInteractiveNodes={this.getInteractiveNodes}
                        drawingObjectMap={{
                            Trendline: "trends",
                            EquidistantChannel: "channels",
                            StandardDeviationChannel : "channels",
                            FibonacciRetracement : "retracements",
                            GannFan : "fans"
                        }}
                        onSelect={this.handleSelection}
				    /> 

                </ChartCanvas>
                </div>
                <div>
                    <InteractiveSettingPopup 
                        isSelected={this.state.isSelected} 
                        selectedInteractive={this.state.selectedInteractive}
                        selectedtype={this.state.selectedtype}
                        saveInteractive={this.saveSelectedInteractive}
                        deleteInteractive={this.deleteSelectedInteractive}
                        interactiveFlag={this.state.interactiveFlag}
                    />
                </div>
                </>
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
