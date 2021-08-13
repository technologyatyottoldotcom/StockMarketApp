import React from 'react';
import PropTypes from 'prop-types';
import {ChartCanvas,Chart} from 'react-stockcharts';
import { curveCardinal } from "d3-shape";
import {AreaSeries,LineSeries,StraightLine} from 'react-stockcharts/lib/series';
import {XAxis,YAxis} from 'react-stockcharts/lib/axes';
import { format } from 'd3-format';
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import LastPointIndicator from '../CustomChartComponents/LastPointEdgeIndicator/LastPointIndicator';
import {fitWidth} from 'react-stockcharts/lib/helper';
import { last } from "react-stockcharts/lib/utils";
import { tooltipContent } from '../../../exports/ChartProps';
import { HoverTooltip } from "../CustomChartComponents/HoverTooltip/HoverTooltip";




export class UpperStockChart extends React.PureComponent {


    constructor(props)
    {
        super(props);
        this.state = {
            chartConfig : null,
            apidata : this.props.apidata,
            // extradata : this.props.extradata,
        }

        this.setUpChart = this.setUpChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount()
    {
        // console.log('---TOP STOCK MOUNTED---');
        this.setUpChart();
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.apidata.length !== prevProps.apidata.length)
        {
            // console.log('-----UPDATE-----');
            this.updateChart();
        }
    }

    setUpChart()
    {

        let dataVal;
        let xAccessorVal;
        let xScaleVal;
        let displayxAccessorVal;

        // let chartdata = this.state.apidata.concat(this.state.extradata);
        let chartdata = this.state.apidata;

        const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
            const {
                data,
                xScale,
                xAccessor,
                displayXAccessor,
            } = xScaleProvider(chartdata);
        
        dataVal = data;
        xAccessorVal = xAccessor;
        xScaleVal = xScale;
        displayxAccessorVal = displayXAccessor;

        // console.log(chartdata);

        this.setState({
            chartConfig : {
                chartdata : chartdata,
                dataVal : dataVal,
                xAccessorVal : xAccessorVal,
                xScaleVal : xScaleVal,
                displayxAccessorVal : displayxAccessorVal,
            }
        })
    }

    updateChart()
    {

        let dataVal;
        let xAccessorVal;
        let xScaleVal;
        let displayxAccessorVal;

        // let chartdata = this.props.apidata.concat(this.props.extradata);
        let chartdata = this.state.apidata;

        const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
            const {
                data,
                xScale,
                xAccessor,
                displayXAccessor,
            } = xScaleProvider(chartdata);
        
        dataVal = data;
        xAccessorVal = xAccessor;
        xScaleVal = xScale;
        displayxAccessorVal = displayXAccessor;

        // console.log(chartdata);

        this.setState({
            chartConfig : {
                chartdata : chartdata,
                dataVal : dataVal,
                xAccessorVal : xAccessorVal,
                xScaleVal : xScaleVal,
                displayxAccessorVal : displayxAccessorVal,
            }
        })
    }

    render() {

        if(this.state.apidata && this.state.chartConfig)
        {

            const { type, width, height , ratio } = this.props;


            
            let openPrice;
            if(this.props.openPrice && this.props.openPrice !== 'NaN')
            {
                openPrice = parseFloat(this.props.openPrice)
            }
            else
            {
                openPrice = 0;
            }

            // console.log(this.props.openPrice,typeof this.props.openPrice);

            // console.log(openPrice);

            return (
                <ChartCanvas 
                    ratio={ratio} 
                    width={width} 
                    height={height}
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    seriesName="MSFT"
                    data={this.state.chartConfig.dataVal} 
                    type={type}
                    xAccessor={this.state.chartConfig.xAccessorVal}
                    displayXAccessor={this.state.chartConfig.displayxAccessorVal}
                    xScale={this.state.chartConfig.xScaleVal}
                    pointsPerPxThreshold={5}
                    // xExtents={xExtents}
                    disableInteraction={true}
                    useCrossHairStyleCursor={false}
                >
                    <Chart 
                        padding={10}
                        id={0} 
                        yExtents={d=> d.open}
                    >
                        
                        <LineSeries 
                            yAccessor={d => d.open} 
                            strokeWidth={1} 
                            stroke={this.props.status === 'positive' ? "#19E683" : "#e51a4b"} 
                            interpolation={curveCardinal}
                        />
                        {/* <LastPointIndicator yAccessor={d => d.open} displayFormat={format(".4s")} radius={2} fill={this.props.status === 'positive' ? "#00b894" : "#e51a4b"}/> */}
                        <StraightLine strokeDasharray="ShortDash" strokeWidth={1} stroke={this.props.status === 'positive' ? "#19E683" : "#e51a4b"} opacity={1} yValue={openPrice}/>

                            {/* <HoverTooltip
                                    tooltipContent={tooltipContent('1D')}
                                    fontSize={8}
                                    bgOpacity={0}
                                    fill='#ffffff'
                                    opacity={1}
                                    stroke='none'
                                    isLabled={false}
                            /> */}

                    </Chart>
                </ChartCanvas>
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

UpperStockChart.propTypes = {
    // data : PropTypes.array.isRequired,
    width : PropTypes.number.isRequired,
    ratio : PropTypes.number.isRequired,
    type : PropTypes.oneOf(['svg','hybrid']).isRequired
};

UpperStockChart.defaultProps ={
    type : 'svg'
}

UpperStockChart = fitWidth(UpperStockChart);

export default UpperStockChart;
