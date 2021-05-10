import React from 'react';
import PropTypes from 'prop-types';
import {ChartCanvas,Chart} from 'react-stockcharts';
import {AreaSeries,LineSeries,StraightLine,AlternatingFillAreaSeries} from 'react-stockcharts/lib/series';
import {XAxis,YAxis} from 'react-stockcharts/lib/axes';
import { format } from 'd3-format';
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {fitWidth} from 'react-stockcharts/lib/helper';
import { last } from "react-stockcharts/lib/utils";


export class UpperStockChart extends React.PureComponent {

    render() {

        // console.log(this.props.data);

        const { data : initialData, type, width, height , ratio } = this.props;


        let dataVal;
        let xAccessorVal;
        let xScaleVal;
        let displayxAccessorVal;
        let start,end;



        const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
            const {
                data,
                xScale,
                xAccessor,
                displayXAccessor,
            } = xScaleProvider(initialData);
        
        dataVal = data;
        xAccessorVal = xAccessor;
        xScaleVal = xScale;
        displayxAccessorVal = displayXAccessor;

        start = xAccessorVal(last(dataVal));
        let weeks = Math.floor((30)/4);
        let days = (30) - (weeks*2);
        end = xAccessorVal(dataVal[0]);
        const xExtents = [start,end];

        return (
            <ChartCanvas 
                ratio={ratio} 
                width={width} 
                height={height}
				margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
				seriesName="MSFT"
				data={dataVal} 
                type={type}
				xAccessor={xAccessorVal}
                displayXAccessor={displayxAccessorVal}
				xScale={xScaleVal}
				xExtents={xExtents}
                disableInteraction={true}
                useCrossHairStyleCursor={false}
			>
				<Chart id={0} yExtents={d=> d.open}>
                    <defs>
						<linearGradient id="MyGradientTop" x1="0" y1="100%" x2="0" y2="0%">
							<stop offset="0%" stopColor="#dff9fb" stopOpacity={0.1} />
							<stop offset="70%" stopColor="#55E6C1" stopOpacity={0.1} />
							<stop offset="100%" stopColor="#55E6C1" stopOpacity={0.1} />
						</linearGradient>
                        <linearGradient id="MyGradientBottom" x1="0" y1="100%" x2="0" y2="0%">
							<stop offset="0%" stopColor="#dff9fb" stopOpacity={0.1} />
							<stop offset="70%" stopColor="#e74c3c" stopOpacity={0.1} />
							<stop offset="100%" stopColor="#e74c3c" stopOpacity={0.1} />
						</linearGradient>
					</defs>
					<AreaSeries yAccessor={d => d.open} strokeWidth={2} stroke="#00b894" fill="url(#MyGradient)"/>
                    {/* <AlternatingFillAreaSeries 
                        yAccessor={d => d.open} 
                        baseAt={21.9} 
                        fill={{
                            top : "#ffffff",
                            bottom : "#ffffff"
                        }}    
                    />
                    <StraightLine strokeDasharray="ShortDash" strokeWidth={2} stroke="#E3342F" opacity={1} yValue={21.9}/> */}

                </Chart>
			</ChartCanvas>
        )
    }
}

UpperStockChart.propTypes = {
    data : PropTypes.array.isRequired,
    width : PropTypes.number.isRequired,
    ratio : PropTypes.number.isRequired,
    type : PropTypes.oneOf(['svg','hybrid']).isRequired
};

UpperStockChart.defaultProps ={
    type : 'svg'
}

UpperStockChart = fitWidth(UpperStockChart);

export default UpperStockChart;
