import {Chart} from 'react-stockcharts';
import {LineSeries,AreaSeries,BarSeries,CandlestickSeries,ScatterSeries ,OHLCSeries,KagiSeries,RenkoSeries,PointAndFigureSeries, SquareMarker,CircleMarker , BollingerSeries , MACDSeries , RSISeries ,StochasticSeries ,StraightLine ,ElderRaySeries , SARSeries , VolumeProfileSeries} from 'react-stockcharts/lib/series';
import { curveMonotoneX, curveCardinal, curveStep } from "d3-shape";
import { format } from 'd3-format';
import {XAxis,YAxis} from 'react-stockcharts/lib/axes';
import { pointAndFigure ,kagi,renko} from "react-stockcharts/lib/indicator";
import { tooltipContent } from '../../../exports/ChartProps';
import LastPointIndicator from '../CustomChartComponents/LastPointEdgeIndicator/LastPointIndicator';
import LabelEdgeCoordinate from '../CustomChartComponents/EdgeLabel/LabelEdgeCoordinate';
import PriceMarkerCoordinate from '../CustomChartComponents/PriceMarker/PriceMarkerCoordinate';
import PriceEdgeIndicator from '../CustomChartComponents/EdgeIndicator/PriceEdgeIndicator';
import {StockMarker} from '../CustomChartComponents/StockMarker/StockMarker';
import { HoverTooltip } from "../CustomChartComponents/HoverTooltip/HoverTooltip";
import { CompareStockTooltip } from '../CustomChartComponents/CompareStockToolip/CompareStockTooltip';
import { IndicatorTooltip } from '../CustomChartComponents/IndicatorTooltip/IndicatorTooltip';
import IndicatorOptions from '../CustomChartComponents/IndicatorOptions/IndicatorOptions';
import { getXCoordinateProps, getYCoordinateProps, getXAxisProps, getYAxisProps, getCompareXAxisProps , getCompareYAxisProps } from '../../../exports/ChartProps';
import { CrossHairCursor,MouseCoordinateX, MouseCoordinateY ,PriceCoordinate, EdgeIndicator } from "react-stockcharts/lib/coordinates";
import {SMA,WMA,EMA,TMA,BB,macdCalculator,rsiCalculator,atrCalculator,slowSTO,fastSTO,fullSTO,fi,fiEMA,elder,elderImpulseCalculator,defaultSar} from '../../../exports/MathematicalIndicators';


function getChartType(chartType,chartdata)
{

    let calculatedData,chartSeries;
    if(chartType === 'line'){
        calculatedData = chartdata;
        chartSeries = <>
                        <LineSeries yAccessor ={d =>d.open} strokeWidth={2} stroke="#00a0e3" interpolation={curveCardinal}/>
                        <LastPointIndicator yAccessor={d => d.open} displayFormat={format(".4s")} radius={4} fill='#00a0e3'/>
                      </>;     
    }
    else if(chartType === 'stepline'){
        calculatedData = chartdata;
        chartSeries = <>
                        <LineSeries yAccessor ={d =>d.open} strokeWidth={2} stroke="#00a0e3" interpolation={curveStep}/>
                        <LastPointIndicator yAccessor={d => d.open} displayFormat={format(".4s")} radius={4} fill='#00a0e3'/>
                      </>;     
    }
    else if(chartType === 'rangeArea')
    {
        calculatedData = chartdata;
        chartSeries = <LineSeries yAccessor ={d =>d.open} strokeWidth={30} stroke="#00a0e3" opacity={1} />
    }
    else if(chartType === 'jumpLine')
    {
        calculatedData = chartdata;
        chartSeries = <ScatterSeries yAccessor ={d =>d.open} marker={SquareMarker} markerProps={{ width : 8 , height : 1 , fill : '#00A0E3' , stroke : '#00A0E3' , strokeWidth : 0 , opacity : 1}}/>
    }
    else if(chartType === 'column')
    {
        calculatedData = chartdata;
        chartSeries = <BarSeries yAccessor ={d =>d.open} stroke={false} fill='#00a0e3' opacity={1}/>
    }
    else if(chartType === 'stick')
    {
        calculatedData = chartdata;
        chartSeries = <BarSeries yAccessor ={d =>d.open} width={1} stroke={true} fill='#00a0e3' opacity={1}/>
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
    else
    {
        calculatedData = chartdata;
        chartSeries = <AreaSeries yAccessor ={d =>d.open} strokeWidth={2} stroke="#00a0e3" fill='#00a0e3' opacity={0.3} interpolation={curveMonotoneX}/>
    }

    return [calculatedData,chartSeries];
}

function getCompareChartType(config,stockconfig,getCompareAccessor)
{
    const type = stockconfig.charttype;
    const width = stockconfig.chartwidth;

    console.log(type,width)

    if(type === 'line')
    {
        return <>
                <LineSeries yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} strokeWidth={width} stroke={stockconfig.color} interpolation={curveMonotoneX}/>
                <LastPointIndicator yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} displayFormat={format(".2%")} fill={stockconfig.color} radius={5}/>
        </>
    }
    else if(type === 'area')
    {
        return <>
                <AreaSeries yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} strokeWidth={width} stroke={stockconfig.color} fill={stockconfig.color} opacity={0.3} interpolation={curveMonotoneX}/>
                <LastPointIndicator yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} displayFormat={format(".2%")} fill={stockconfig.color} radius={5}/>
        </>
    }
    else if(type === 'column')
    {
        return <>
                <BarSeries yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} stroke={false} fill={stockconfig.color} opacity={0.9}/>
            </>
    }
    else if(type === 'stepline')
    {
        return <>
            <LineSeries yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} strokeWidth={width} stroke={stockconfig.color} interpolation={curveStep}/>
            <LastPointIndicator yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} displayFormat={format(".2%")} fill={stockconfig.color} radius={5}/>
        </>
    }
    else
    {
        return <>
            <LineSeries yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} strokeWidth={2} stroke={stockconfig.color} interpolation={curveMonotoneX}/>
            <LastPointIndicator yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} displayFormat={format(".2%")} fill={stockconfig.color} radius={5}/>
        </>
    }

}

function ChartWrapper(range,chartType,closePrice)
{

    // console.log('CHART WRAPPER CALL');
    let chartSeries = getChartType(chartType);
    return (
        <>
            {chartSeries}
            <PriceEdgeIndicator 
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
                opacity={1}
                rectRadius={10}
                fontWeight="700"
                dx={1}
            />
            <PriceMarkerCoordinate 
                at="left"
                orient="right"
                price={closePrice}
                displayFormat={format('.2f')}
                strokeDasharray="ShortDot"
                dx={20} 
                fill="#000000"
                rectWidth={55}
                rectHeight={20} 
                fontSize={10} 
                opacity={0.5} 
            />
            <HoverTooltip
                tooltipContent={tooltipContent(range)}
                fontSize={11}
                bgOpacity={0}
                fill='#ffffff'
                opacity={1}
                bgrx={15}
                stroke='none'
                isLabled={false}
                isInline={true}
            />
        </>
    )
}

function ChartWrapperZoom(range,lastPoint,stockDetails,chartType,closePrice,totalCharts)
{
    let chartSeries = getChartType(chartType);

    return (
        <>
            {chartSeries}
            {/* <LineSeries yAccessor={d =>d.sma}/> */}
            <YAxis {...getYAxisProps(totalCharts)} />
            {
                totalCharts === 1 ?
                    <> 
                        <XAxis {...getXAxisProps()} />
                        <MouseCoordinateX {...getXCoordinateProps(range)}/>
                    </>
                :
                <>
                    <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} stroke="#c8c8c8"/>
                </>
            }
            <MouseCoordinateY {...getYCoordinateProps()}/>
            <LabelEdgeCoordinate 
                at="right"
                orient="left"
                price={lastPoint.open}
                displayFormat={format('.2f')}
                labelText={stockDetails.stockNSECode}
                fill="#00a0e3"
                rectHeight={18}
                rectWidth={stockDetails.stockNSECode.length * 11}
                rectRadius={10}
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
                price={lastPoint.open}
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
            <PriceMarkerCoordinate 
                at="left"
                orient="right"
                price={closePrice}
                displayFormat={format('.2f')}
                strokeDasharray="ShortDot"
                dx={20} 
                fill="#000000"
                rectWidth={55}
                rectHeight={20} 
                fontSize={10}  
                opacity={0.5}
            />
            <HoverTooltip
                tooltipContent={tooltipContent(range)}
                fontSize={12}
                fill='#ffffff'
                bgOpacity={0}
                opacity={1}
                bgrx={15}
                stroke='none'
                isLabled={false}
                isInline={true}
            />
            <CrossHairCursor />
        </>
    )
}

function ChartCompareStock(zoom,indx,config,getCompareAccessor)
{

        const stockconfig = config.config && config.config;
        // console.log(stockconfig);

        let series = getCompareChartType(config,stockconfig,getCompareAccessor);


        if(zoom)
        {
            if(!config.hide)
            {
                return (

                    <>
                        {series}
                        {stockconfig.pricelabel && 
                            
                            <>
                                <EdgeIndicator 
                                    orient="right"
                                    edgeAt="right"
                                    itemType="last"
                                    yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')}
                                    displayFormat={format(".2%")}
                                    arrowWidth={0}
                                    fill={stockconfig.color}
                                    fontSize={11}
                                    rectHeight={18}
                                    strokeWidth={1}
                                    lineOpacity={0}
                                />
                            </>
                            
                        }

                        {stockconfig.stocklabel && 
                        
                            <>
                                <StockMarker 
                                    edgeAt="right"
                                    orient="left"
                                    itemType="last"
                                    yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')}
                                    displayFormat={format(".2%")}
                                    arrowWidth={0}
                                    fill={stockconfig.color}
                                    fontSize={11}
                                    rectHeight={18}
                                    rectWidth={config.symbol.length * 11}
                                    rectRadius={10}
                                    strokeWidth={1}
                                    lineOpacity={0}
                                    labelText={config.symbol}
                                />
                            </>

                        }

                        
                        
                    </>
                )
            }
            else
            {
                return (
                    <></>
                )
            }
        }
        else
        {
            return <>
                <LineSeries yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} strokeWidth={2} stroke={stockconfig.color} interpolation={curveMonotoneX}/>
                <LastPointIndicator yAccessor={(d) => getCompareAccessor(d,config.symbol+'open')} displayFormat={format(".2%")} fill={stockconfig.color} radius={5}/>
            </>
        }
}

function ChartCompareStockTooltip(zoom,indx,config,toggleHide,removeStock,toggleCompareSettings)
{
    if(!config.hide)
    {
        return (

            <>
                <CompareStockTooltip
                    yAccessor={d => d[config.symbol+'open']}
                    yLabel={config.symbol}
                    yDisplayFormat={format(".2f")}
                    valueStroke={config.color}
                    labelFill={config.color}
                    hide={config.hide}
                    origin={[10, 25*(indx+4)]}
                    toggleHide={toggleHide}
                    removeStock={removeStock}
                    toggleCompareSettings={toggleCompareSettings}
                />
            </>
        )
    }
    else
    {
        return (
            <CompareStockTooltip
                yAccessor={d => d[config.symbol+'open']}
                yLabel={config.symbol}
                yDisplayFormat={format(".2f")}
                valueStroke={config.color}
                labelFill={config.color}
                origin={[10, 25*(indx+4)]}
                hide={config.hide}
                toggleHide={toggleHide}
                removeStock={removeStock}
            />  
        )
    }
    
}

function ChartWrapperCompare(zoom,range,stockDetails,CompareStockConfig,totalCharts)
{
    return (
        <>
            {zoom  && <>
                <YAxis {...getCompareYAxisProps()}/>
                {
                    totalCharts === 1 ?
                        <> 
                            <XAxis {...getXAxisProps()} />
                            <MouseCoordinateX {...getXCoordinateProps(range)}/>
                        </>
                    :
                    <>
                        <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} stroke="#c8c8c8"/>
                    </>
                }
            </>
            }
            <LineSeries yAccessor={d =>d.compare.open} strokeWidth={2} stroke="#00a0e3" interpolation={curveMonotoneX}/>
            <EdgeIndicator 
                orient="right"
                edgeAt="right"
                itemType="last"
                yAccessor={d => d.compare.open}
                displayFormat={format(".2%")}
                arrowWidth={0}
                fill='#00a0e3'
                fontSize={11}
                rectHeight={18}
                strokeWidth={1}
                lineOpacity={0}
            />
            {zoom && 
                <>
                    <StockMarker 
                        edgeAt="right"
                        orient="left"
                        itemType="last"
                        yAccessor={d => d.compare.open}
                        displayFormat={format(".2%")}
                        arrowWidth={0}
                        fill='#00a0e3'
                        fontSize={11}
                        rectHeight={18}
                        rectWidth={stockDetails.stockNSECode.length * 11}
                        rectRadius={10}
                        strokeWidth={1}
                        lineOpacity={0}
                        labelText={stockDetails.stockNSECode}
                    />
                </>
            }
            <LastPointIndicator yAccessor={d => d.compare.open} displayFormat={format(".2%")} fill="#00a0e3" radius={5}/>
            <MouseCoordinateX {...getXCoordinateProps(range)}/>
            <MouseCoordinateY 
                at="right" 
                orient="right" 
                displayFormat={format(".2%")}
                arrowWidth={0}
                strokeWidt={2}
            />

            {CompareStockConfig.map((config,indx)=>{
                return <>
                    {ChartCompareStock(zoom,indx,config,getCompareAccessor)}
                </>;
            })}


            {zoom && 
                <><CrossHairCursor /></>
            }
            
            
        </>
    )
}

function ChartIndicators(index,indicator,width,height,range,series,title,color,indicatorConfig,yAccessor,TotalCharts,IndicatorOutside,DeleteIndicatorType,SwapCharts)
{
    return <>
        <IndicatorOptions
            index={index} 
            indicator={indicator}
            origin={[width - 180,20]}
            showup={index === 0 ? false : true}
            showdown={index === IndicatorOutside.length - 1 ? false : true}
            DeleteIndicatorType={DeleteIndicatorType}
            SwapCharts={SwapCharts}
        />
        {series}
        {
            index === IndicatorOutside.length - 1 ?
                <> 
                    <XAxis {...getXAxisProps()} />
                    <MouseCoordinateX {...getXCoordinateProps(range)}/>
                </>
            :
            <>
                <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} stroke="#c8c8c8"/>
            </>
        }
        <YAxis {...getYAxisProps(TotalCharts)} />
        <EdgeIndicator 
            orient="right"
            edgeAt="right"
            itemType="last"
            yAccessor={yAccessor}
            displayFormat={format(".2f")}
            arrowWidth={0}
            fill={color}
            fontSize={11}
            rectHeight={18}
            strokeWidth={1}
            lineOpacity={0}
        />
        <StockMarker 
            edgeAt="right"
            orient="left"
            itemType="last"
            yAccessor={yAccessor}
            displayFormat={format(".2f")}
            arrowWidth={0}
            fill={color}
            fontSize={11}
            rectHeight={18}
            rectWidth={title.length * 11}
            strokeWidth={1}
            lineOpacity={0}
            labelText={title}
        />
        <IndicatorTooltip 
            origin={[10, 5]}
            yDisplayFormat={format(".2f")}
            indicatorConfig={indicatorConfig}
            yAccessor={yAccessor}
            indicator={indicator}
            IndicatorPosition={1}
            DeleteIndicatorType={DeleteIndicatorType}
        />
    </>
}

function ChartIndicatorInside(index,indicator,series,yAccessor,title,color,indicatorConfig,DeleteIndicatorType)
{
    // console.log(series);
   return <>
     {series}
     <EdgeIndicator 
        orient="right"
        edgeAt="right"
        itemType="last"
        yAccessor={yAccessor}
        displayFormat={format(".2f")}
        arrowWidth={0}
        fill={color}
        fontSize={11}
        rectHeight={18}
        strokeWidth={1}
        lineOpacity={0}
    />
    <StockMarker 
        edgeAt="right"
        orient="left"
        itemType="last"
        yAccessor={yAccessor}
        displayFormat={format(".2f")}
        arrowWidth={0}
        fill={color}
        fontSize={11}
        rectHeight={18}
        rectWidth={title.length * 11}
        strokeWidth={1}
        lineOpacity={0}
        labelText={title}
    />
    <IndicatorTooltip 
        origin={[10, 20*(index+4)]}
        yDisplayFormat={format(".2f")}
        indicatorConfig={indicatorConfig}
        yAccessor={yAccessor}
        indicator={indicator}
        IndicatorPosition={0}
        DeleteIndicatorType={DeleteIndicatorType}
    />
    
     {/* <LineSeries yAccessor={d => d.wma}/> */}
   </>
}

function ChartToolTip(zoom,CompareStockConfig,toggleHide,removeStock,toggleCompareSettings)
{

    let ToolTipConfig = [];
    CompareStockConfig.map((config,indx)=>{
       ToolTipConfig.push({
           type : 'compare',
           config : config
       });
    });

    let index = 0;
    return (
        CompareStockConfig.map((config,indx)=>{
            return ChartCompareStockTooltip(zoom,index++,config,toggleHide,removeStock,toggleCompareSettings);
        })
    )
}

function getIndicatorData(indicator,chartdata)
{
    let tempData,yAccessor,indicatorSeries,chartIndicatorY,indicatorTitle,indicatorColor,indicatorConfig;

    if(indicator === 'SMA')
    {
        tempData = SMA(chartdata);
        yAccessor = (d) => d.sma;
        chartIndicatorY = (d) => getIndicatorExtents(d.sma);
        indicatorTitle = 'SMA';
        indicatorSeries =  <>
            <LineSeries yAccessor={SMA.accessor()} stroke={SMA.stroke()} strokeWidth={2} interpolation={curveMonotoneX}/>
            <LastPointIndicator yAccessor={SMA.accessor()} displayFormat={format(".2s")} radius={4} fill={SMA.stroke()}/>
        </>;
        indicatorColor = SMA.stroke();
        indicatorConfig = [{
            'title' : 'SMA',
            'accessor' : yAccessor,
            'color' : SMA.stroke()
        }];
    }
    else if(indicator === 'WMA')
    {
        tempData = WMA(chartdata);
        yAccessor = (d) => d.wma;
        chartIndicatorY = (d) => getIndicatorExtents(d.wma);
        indicatorTitle = 'WMA';
        indicatorSeries = <> 
            <LineSeries yAccessor={WMA.accessor()} stroke={WMA.stroke()} strokeWidth ={2} interpolation={curveMonotoneX}/>;
            <LastPointIndicator yAccessor={WMA.accessor()} displayFormat={format(".2s")} radius={4} fill={WMA.stroke()}/>
        </>;
        indicatorColor = WMA.stroke();
        indicatorConfig = [{
            'title' : 'WMA',
            'accessor' : yAccessor,
            'color' : WMA.stroke()
        }];
    }
    else if(indicator === 'EMA')
    {
        tempData = EMA(chartdata);
        yAccessor = (d) => d.ema;
        chartIndicatorY = (d) => getIndicatorExtents(d.ema);
        indicatorTitle = 'EMA';
        indicatorSeries = <> 
            <LineSeries yAccessor={EMA.accessor()} stroke={EMA.stroke()} strokeWidth ={2} interpolation={curveMonotoneX}/>;
            <LastPointIndicator yAccessor={WMA.accessor()} displayFormat={format(".2s")} radius={4} fill={EMA.stroke()}/>
        </>;
        indicatorColor = EMA.stroke();
        indicatorConfig = [{
            'title' : 'EMA',
            'accessor' : yAccessor,
            'color' : EMA.stroke()
        }];
    }
    else if(indicator === 'TMA')
    {
        tempData = TMA(chartdata);
        yAccessor = (d) => d.tma;
        chartIndicatorY = (d) => getIndicatorExtents(d.tma);
        indicatorTitle = 'TMA';
        indicatorSeries = <> 
            <LineSeries yAccessor={TMA.accessor()} stroke={TMA.stroke()} strokeWidth ={2} interpolation={curveMonotoneX}/>;
            <LastPointIndicator yAccessor={TMA.accessor()} displayFormat={format(".2s")} radius={4} fill={TMA.stroke()}/>
        </>;
        indicatorColor = TMA.stroke();
        indicatorConfig = [{
            'title' : 'TMA',
            'accessor' : yAccessor,
            'color' : TMA.stroke()
        }];
    }
    else if(indicator === 'BB')
    {
        tempData = BB(chartdata);
        yAccessor = (d) => d.bb && d.bb.middle;
        chartIndicatorY = (d) => d.bb;
        indicatorTitle = 'BB';
        indicatorSeries =  <BollingerSeries 
                                yAccessor={d => d.bb} 
                                stroke={{top : '#0097e6' , middle : '#2e86de' , bottom : '#0097e6'}} 
                                fill="#48dbfb" 
                                opacity={0.15} 
                            />;
        indicatorColor = '#2e86de';
        indicatorConfig = [
            {
                'title' : 'BB (T)',
                'accessor' : (d) => d.bb && d.bb.top,
                'color' : '#0097e6'
            },
            {
                'title' : 'BB (M)',
                'accessor' : (d) => d.bb && d.bb.middle,
                'color' : '#2e86de'
            },
            {
                'title' : 'BB (B)',
                'accessor' : (d) => d.bb && d.bb.bottom,
                'color' : '#0097e6'
            }
        ];
    }
    else if(indicator === 'MACD')
    {
        tempData = macdCalculator(chartdata);
        yAccessor = (d) => d.macd && d.macd.macd;
        chartIndicatorY = macdCalculator.accessor();
        indicatorTitle = 'MACD';
        indicatorSeries = <MACDSeries 
                                yAccessor={d => d.macd} 
                                stroke={{macd : '#1dd1a1' , signal : '#ee5253'}} 
                                fill={{divergence : '#00a0e3'}} width={3} 
                                zeroLineOpacity={1} 
                                zeroLineStroke="#404040"
                                widthRatio={1}
                                opacity={1}
                            />;
        indicatorColor = '#2d3436';
        indicatorConfig = [
            {
                'title' : 'MACD',
                'accessor' : (d) => d.macd && d.macd.macd,
                'color' : '#1dd1a1'
            },
            {
                'title' : 'Signal',
                'accessor' : (d) => d.macd && d.macd.signal,
                'color' : '#ee5253'
            },
            {
                'title' : 'Divergence',
                'accessor' : (d) => d.macd && d.macd.divergence,
                'color' : '#00a0e3'
            }
        ];
    }
    else if(indicator === 'RSI')
    {
        tempData = rsiCalculator(chartdata);
        yAccessor = (d) => d.rsi;
        chartIndicatorY = (d) => getIndicatorExtents(d.rsi);
        indicatorTitle = 'RSI';
        indicatorSeries = <>
            <RSISeries 
                yAccessor={d => d.rsi} 
                stroke={{line: "#404040" , top: "#404040" , middle: "#404040", bottom: "#404040", outsideThreshold: "#ee5253", insideThreshold: "#1dd1a1"}} 
                strokeDasharray={{line: 'Solid' , top: "LongDash" , middle: "LongDash", bottom: "LongDash"}} 
                strokeWidth={{outsideThreshold : 2 , insideThreshold : 2 , top: 0.3, middle: 0.3, bottom: 0.3}}
            />
        </>;
        indicatorColor = '#2d3436';
        indicatorConfig = [
            {
                'title' : 'RSI',
                'accessor' : (d) => d.rsi,
                'color' : '#2d3436'
            }
        ];
    }
    else if(indicator === 'ATR')
    {
        tempData = atrCalculator(chartdata);
        yAccessor = (d) => d.atr;
        chartIndicatorY = (d) => getIndicatorExtents(d.atr);
        indicatorTitle = 'ATR';
        indicatorSeries = <>
            <LineSeries yAccessor={atrCalculator.accessor()} stroke='#576574' strokeWidth={2} interpolation={curveMonotoneX}/>
            <LastPointIndicator yAccessor={atrCalculator.accessor()} displayFormat={format(".2s")} radius={4} fill="#576574"/>
        </>;
        indicatorColor = '#576574';
        indicatorConfig = [
            {
                'title' : 'ATR',
                'accessor' : (d) => d.atr,
                'color' : '#576574'
            }
        ];
    }
    else if(indicator === 'SOSlow')
    {
        tempData = slowSTO(chartdata);
        yAccessor = (d) => d.slowSTO && d.slowSTO.K;
        chartIndicatorY = [0,100];
        indicatorTitle = 'SO (slow)';
        indicatorSeries = <StochasticSeries 
            yAccessor={d => d.slowSTO} 
            stroke={{top : '#404040' , middle : '#404040' , bottom : '#404040' , dLine : '#ee5253' , kLine : '#1dd1a1'}} 
            refLineOpacity={0.1}
        />;
        indicatorColor = '#2d3436';
        indicatorConfig = [
            {
                'title' : '%K',
                'accessor' : (d) => d.slowSTO && d.slowSTO.K,
                'color' : '#1dd1a1'
            },
            {
                'title' : '%D',
                'accessor' : (d) => d.slowSTO && d.slowSTO.D,
                'color' : '#ee5253'
            }
        ];
    }
    else if(indicator === 'SOFast')
    {
        tempData = fastSTO(chartdata);
        yAccessor = (d) => d.fastSTO && d.fastSTO.K;
        chartIndicatorY = [0,100];
        indicatorTitle = 'SO (fast)';
        indicatorSeries = <StochasticSeries 
            yAccessor={d => d.fastSTO} 
            stroke={{top : '#404040' , middle : '#404040' , bottom : '#404040' , dLine : '#ee5253' , kLine : '#1dd1a1'}} 
            refLineOpacity={0.1}
        />;
        indicatorColor = '#2d3436';
        indicatorConfig = [
            {
                'title' : '%K',
                'accessor' : (d) => d.fastSTO && d.fastSTO.K,
                'color' : '#1dd1a1'
            },
            {
                'title' : '%D',
                'accessor' : (d) => d.fastSTO && d.fastSTO.D,
                'color' : '#ee5253'
            }
        ];
    }
    else if(indicator === 'SOFull')
    {
        tempData = fullSTO(chartdata);
        yAccessor = (d) => d.fullSTO && d.fullSTO.K;
        chartIndicatorY = [0,100];
        indicatorTitle = 'SO (full)';
        indicatorSeries = <StochasticSeries 
            yAccessor={d => d.fullSTO} 
            stroke={{top : '#404040' , middle : '#404040' , bottom : '#404040' , dLine : '#ee5253' , kLine : '#1dd1a1'}} 
            refLineOpacity={0.1}
        />;
        indicatorColor = '#2d3436';
        indicatorConfig = [
            {
                'title' : '%K',
                'accessor' : (d) => d.fullSTO && d.fullSTO.K,
                'color' : '#1dd1a1'
            },
            {
                'title' : '%D',
                'accessor' : (d) => d.fullSTO && d.fullSTO.D,
                'color' : '#ee5253'
            }
        ];
    }
    else if(indicator === 'FI')
    {
        tempData = fiEMA(fi(chartdata));
        yAccessor = (d) => d.fi;
        chartIndicatorY = (d) => getIndicatorExtents(d.fi);
        indicatorTitle = 'Force Index';
        indicatorSeries = <>
            <AreaSeries 
                baseAt={scale => scale(0)} 
                yAccessor={fiEMA.accessor()} fill='#48dbfb' stroke='#2e86de' 
                opacity={1}  
                strokeWidth={2}
                interpolation={curveMonotoneX}  
            />
            <StraightLine yValue={0} stroke="#404040"/>
        </>;
        indicatorColor = '#48dbfb';
        indicatorConfig = [
            {
                'title' : 'Force Index',
                'accessor' : (d) => d.fi,
                'color' : '#48dbfb'
            }
        ];
    }
    else if(indicator === 'ERI')
    {
        tempData = elder(chartdata);  
        yAccessor = (d) => elder.accessor()(d) && elder.accessor()(d).bullPower;
        chartIndicatorY = [0,elder.accessor()];
        indicatorTitle = 'ERI';
        indicatorSeries = <ElderRaySeries 
            yAccessor={elder.accessor()} 
            bullPowerFill='#1dd1a1' 
            bearPowerFill='#ee5253' 
            opacity={1} 
            widthRatio={0.3}
        />;
        indicatorColor = '#2d3436';
        indicatorConfig = [
            {
                'title' : 'Elder Ray (Bull Power)',
                'accessor' : (d) => elder.accessor()(d) && elder.accessor()(d).bullPower,
                'color' : '#1dd1a1'
            },
            {
                'title' : 'Elder Ray (Bear Power)',
                'accessor' : (d) => elder.accessor()(d) && elder.accessor()(d).bearPower,
                'color' : '#ee5253'
            }
        ];
    }
    else if(indicator === 'ERIBull')
    {
        tempData = elder(chartdata); 
        yAccessor = (d) => elder.accessor()(d) && elder.accessor()(d).bullPower;
        chartIndicatorY = [0,d => elder.accessor()(d) && elder.accessor()(d).bullPower];
        indicatorTitle = 'ERI (Bull)';
        indicatorSeries = <>
            <BarSeries 
                yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower} 
                baseAt={(xScale, yScale, d) => yScale(0)} 
                fill="#1dd1a1" 
                width={3} 
                opacity={1} 
            />
            <StraightLine yValue={0} />
        </> ;
        indicatorColor = '#1dd1a1';
        indicatorConfig = [
            {
                'title' : 'Elder Ray (Bull Power)',
                'accessor' : (d) => elder.accessor()(d) && elder.accessor()(d).bullPower,
                'color' : '#1dd1a1'
            }
        ];
    }
    else if(indicator === 'ERIBear')
    {
        tempData = elder(chartdata); 
        yAccessor = (d) => elder.accessor()(d) && elder.accessor()(d).bearPower;
        chartIndicatorY = [0, d => elder.accessor()(d) && elder.accessor()(d).bearPower];
        indicatorTitle = 'ERI (Bear)';
        indicatorSeries = <>
            <BarSeries 
                yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower} 
                baseAt={(xScale, yScale, d) => yScale(0)} 
                fill="#ee5253" 
                width={3} 
                opacity={1}     
            />
            <StraightLine yValue={0} />
        </> ;
        indicatorColor = '#ee5253';
        indicatorConfig = [
            {
                'title' : 'Elder Ray (Bear Power)',
                'accessor' : (d) => elder.accessor()(d) && elder.accessor()(d).bearPower,
                'color' : '#ee5253'
            }
        ];
    }
    else if(indicator === 'ERIMP')
    {
        tempData = elderImpulseCalculator(macdCalculator(EMA(chartdata))); 
        yAccessor = (d) => d.macd;
        chartIndicatorY = macdCalculator.accessor();
        indicatorTitle = 'Impulse';
        indicatorSeries = <MACDSeries 
            yAccessor={d => d.macd} 
            stroke={{macd : '#1dd1a1' , signal : '#ee5253'}} 
            fill={{divergence : '#00a0e3'}} 
            width={3} 
            zeroLineStroke="#404040"
            zeroLineOpacity={0.4} 
            widthRatio={1}
            opacity={1}
        />;
        indicatorColor = '#2d3436';
    }
    else if(indicator === 'PSAR')
    {
        tempData = defaultSar(chartdata); 
        yAccessor = (d) => d.sar;
        indicatorSeries = <SARSeries yAccessor={d => d.sar} fill={{
            falling: "#4682B4",
            rising: "#15EC2E",
        }}/>;
    }
    else if(indicator === 'vlmp')
    {
        tempData = EMA(chartdata);
        chartIndicatorY = [d => [d.high, d.low]];
        indicatorSeries = <VolumeProfileSeries fill='#000000'/>;
    }

    return [tempData,yAccessor,indicatorSeries,indicatorTitle,chartIndicatorY,indicatorColor,indicatorConfig];
}

function getCompareAccessor(d, s)
{
    return d.compare[s]
}

function getIndicatorExtents(accessor)
{
    return [accessor + (accessor * (0.12/100)) , accessor - (accessor * (0.12/100))]
}

function getHeroHeight(height,zoom,charts)
{
    if(zoom)
    {
        if(charts > 0)
        {
            return ((70*height)/100);
        }
        else
        {
            return height-20;
        }
    }
    else
    {
        return height;
    }
}

function getChartHeight(height,zoom,charts)
{
    let h = ((30*height)/100);
    let heroHeight = ((70*height)/100);
    if(charts > 0)
    {
        return {
            height : (h/charts)-((30+((charts-1)*10))/(charts)),
            origin : heroHeight
        };
    }
    else
    {
        return {
            height : 0,
            origin : 0
        };
    }
   
}


export { getChartHeight, getHeroHeight, getIndicatorData, ChartWrapper, ChartWrapperZoom, ChartWrapperCompare , ChartIndicators , ChartIndicatorInside , ChartToolTip }