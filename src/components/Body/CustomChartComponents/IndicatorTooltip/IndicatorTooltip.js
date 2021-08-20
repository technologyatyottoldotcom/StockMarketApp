

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import displayValuesFor from 'react-stockcharts/lib/tooltip/displayValuesFor';
import GenericChartComponent from "react-stockcharts/lib/GenericChartComponent";

import ToolTipText from "react-stockcharts/lib/tooltip/ToolTipText";
import ToolTipTSpanLabel from "react-stockcharts/lib/tooltip/ToolTipTSpanLabel";
import { isDefined, identity, noop, functor } from "react-stockcharts/lib/utils";

export class IndicatorTooltip extends Component {

	
	constructor(props) {
		super(props);
		this.state = {
            hover : false,
            removeColor : '#636e72'
        }
		this.renderSVG = this.renderSVG.bind(this);
	}

   

	renderSVG(moreProps) {

		const { onClick, fontFamily, fontSize, labelFill, valueFill, className  } = this.props;
		let { xDisplayFormat, yDisplayFormat, xLabel, yLabel, xAccessor, yAccessor } = this.props;

		let {indicator , IndicatorPosition , DeleteIndicatorType} = this.props;

		const { displayValuesFor } = this.props;

		const { chartConfig: { width, height } } = moreProps;

        const currentItem = displayValuesFor(this.props, moreProps);

        // console.log(currentItem);

        const { indicatorConfig } = this.props;


		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

        // console.log(indicatorConfig);

		let tspans = [];

		{indicatorConfig.map((indicator,indx)=>{

			const {title,accessor,color} = indicator;

			const yDisplayValue = isDefined(currentItem) && isDefined(accessor(currentItem)) ? yDisplayFormat(accessor(currentItem)) : "0";

			tspans.push(<ToolTipTSpanLabel fill={color}>{`${title}`}</ToolTipTSpanLabel>);
			if(indx === indicatorConfig.length - 1)
			{
				tspans.push(<tspan fill={color} >{` : ${yDisplayValue}`}</tspan>)
			}
			else
			{
				tspans.push(<tspan fill={color} >{` : ${yDisplayValue} , `}</tspan>)
			}	

		})}

		return (
            <g 
				className={className} 
				transform={`translate(${ x }, ${ y })`} 
				onClick={onClick}
				onMouseOver={()=>{this.setState({hover : true})}} 
                onMouseLeave={()=>{this.setState({hover : false})}}
				
				>

				{this.state.hover && <>
					<svg width="160" height="22">
						<rect width="160" height="22" fill='#ffffff' rx={3} style={{
							stroke : '#cccccc'
						}}/>
					</svg>
					<g onClick={e => DeleteIndicatorType(IndicatorPosition,indicator)}>
                        <svg className="compare-icon-back" x={135} y={2} width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={this.state.removeColor} onMouseOver={()=>{this.setState({removeColor : labelFill})}} onMouseLeave={()=>{this.setState({removeColor : '#636e72'})}}>
                            <rect width="26" height="26" fill="#ffffff"></rect>
                            <path fillRule="evenodd" clipRule="evenodd" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
                        </svg>
                    </g>
				</>}

				<ToolTipText x={15} y={15} fontFamily={fontFamily} fontSize={fontSize} fontWeight={600}>
                    {this.state.hover ?
						<>
							{tspans[0]}
						</> 
						: 
						<>
							{tspans}
						</>
					}
                </ToolTipText>

				
					
            </g>
        )
	}


	render() {
		return <GenericChartComponent
			clip={true}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
		/>;
	}
}

IndicatorTooltip.propTypes = {
	xDisplayFormat: PropTypes.func,
	yDisplayFormat: PropTypes.func.isRequired,
	xLabel: PropTypes.string,
	yLabel: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]).isRequired,
	labelFill: PropTypes.string.isRequired,
	valueFill: PropTypes.string,
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize : PropTypes.number,
	onClick: PropTypes.func,
	displayValuesFor: PropTypes.func,
	xAccessor: PropTypes.func,
	yAccessor: PropTypes.func,
    indicatorConfig : PropTypes.array,
	DeleteIndicatorType : PropTypes.func,
	IndicatorPosition : PropTypes.number
    
};

IndicatorTooltip.defaultProps = {
	origin: [0, 0],
	labelFill: "#4682B4",
	valueFill: "#000000",
	yDisplayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	xAccessor: noop,
	yAccessor: identity,
	className: "react-stockcharts-indicator-tooltip",
    
};

export default IndicatorTooltip;
