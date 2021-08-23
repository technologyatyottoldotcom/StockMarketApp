

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
            removeColor : '#636e72',
			settingColor : '#636e72'
        }
		this.renderSVG = this.renderSVG.bind(this);
	}

   

	renderSVG(moreProps) {

		const { onClick, fontFamily, fontSize, labelFill, valueFill, className  } = this.props;
		let { xDisplayFormat, yDisplayFormat, xLabel, yLabel, xAccessor, yAccessor } = this.props;

		let {hide , indicator , IndicatorPosition , DeleteIndicatorType , toggleIndicatorSettings} = this.props;

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

			tspans.push(<ToolTipTSpanLabel fill={hide ? '#b2bec3' : color}>{`${title}`}</ToolTipTSpanLabel>);
			if(indx === indicatorConfig.length - 1)
			{
				tspans.push(<tspan fill={hide ? '#b2bec3' : color} >{` : ${yDisplayValue}`}</tspan>)
			}
			else
			{
				tspans.push(<tspan fill={hide ? '#b2bec3' : color} >{` : ${yDisplayValue} , `}</tspan>)
			}	

		})}

		if(hide)
		{
			return (
				<g 
					className={className} 
					transform={`translate(${ x }, ${ y })`} 
					onClick={onClick}
					onMouseOver={()=>{this.setState({hover : true})}} 
					onMouseLeave={()=>{this.setState({hover : false})}}
					
					>
	
						<svg width="190" height="22">
							<rect width="190" height="22" fill='#ffffff' rx={3} style={{
								stroke : '#cccccc'
							}}/>
						</svg>
						<g onClick={e => toggleIndicatorSettings(e,indicator)}>
							<svg className="compare-icon-back" x={135} y={3} width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='#b2bec3'>
								<rect width="26" height="26" fill="#ffffff"></rect>
								<path d="M 10.490234 2 C 10.011234 2 9.6017656 2.3385938 9.5097656 2.8085938 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 5.2851562 5.2480469 C 4.8321563 5.0920469 4.33375 5.2793594 4.09375 5.6933594 L 2.5859375 8.3066406 C 2.3469375 8.7216406 2.4339219 9.2485 2.7949219 9.5625 L 4.1132812 10.708984 C 4.0447181 11.130337 4 11.559284 4 12 C 4 12.440716 4.0447181 12.869663 4.1132812 13.291016 L 2.7949219 14.4375 C 2.4339219 14.7515 2.3469375 15.278359 2.5859375 15.693359 L 4.09375 18.306641 C 4.33275 18.721641 4.8321562 18.908906 5.2851562 18.753906 L 6.9296875 18.1875 C 7.5958842 18.734206 8.3553934 19.166339 9.1757812 19.476562 L 9.5097656 21.191406 C 9.6017656 21.661406 10.011234 22 10.490234 22 L 13.509766 22 C 13.988766 22 14.398234 21.661406 14.490234 21.191406 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 18.714844 18.751953 C 19.167844 18.907953 19.66625 18.721641 19.90625 18.306641 L 21.414062 15.691406 C 21.653063 15.276406 21.566078 14.7515 21.205078 14.4375 L 19.886719 13.291016 C 19.955282 12.869663 20 12.440716 20 12 C 20 11.559284 19.955282 11.130337 19.886719 10.708984 L 21.205078 9.5625 C 21.566078 9.2485 21.653063 8.7216406 21.414062 8.3066406 L 19.90625 5.6933594 C 19.66725 5.2783594 19.167844 5.0910937 18.714844 5.2460938 L 17.070312 5.8125 C 16.404116 5.2657937 15.644607 4.8336609 14.824219 4.5234375 L 14.490234 2.8085938 C 14.398234 2.3385937 13.988766 2 13.509766 2 L 10.490234 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"/>
							</svg>
						</g>
						<g onClick={e => DeleteIndicatorType(IndicatorPosition,indicator)}>
							<svg className="compare-icon-back" x={160} y={2} width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill='#b2bec3'>
								<rect width="26" height="26" fill="#ffffff"></rect>
								<path fillRule="evenodd" clipRule="evenodd" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
							</svg>
						</g>
	
					<ToolTipText x={15} y={15} fontFamily={fontFamily} fontSize={fontSize} fontWeight={600}>
						{tspans[0]}
					</ToolTipText>
	
					
						
				</g>
			)
		}
		else
		{
			return (
				<g 
					className={className} 
					transform={`translate(${ x }, ${ y })`} 
					onClick={onClick}
					onMouseOver={()=>{this.setState({hover : true})}} 
					onMouseLeave={()=>{this.setState({hover : false})}}
					
					>
	
					{this.state.hover && <>
						<svg width="190" height="22">
							<rect width="190" height="22" fill='#ffffff' rx={3} style={{
								stroke : '#cccccc'
							}}/>
						</svg>
						<g onClick={e => toggleIndicatorSettings(e,indicator)}>
							<svg className="compare-icon-back" x={135} y={3} width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={this.state.settingColor} onMouseOver={()=>{this.setState({settingColor : labelFill})}} onMouseLeave={()=>{this.setState({settingColor : '#636e72'})}}>
								<rect width="26" height="26" fill="#ffffff"></rect>
								<path d="M 10.490234 2 C 10.011234 2 9.6017656 2.3385938 9.5097656 2.8085938 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 5.2851562 5.2480469 C 4.8321563 5.0920469 4.33375 5.2793594 4.09375 5.6933594 L 2.5859375 8.3066406 C 2.3469375 8.7216406 2.4339219 9.2485 2.7949219 9.5625 L 4.1132812 10.708984 C 4.0447181 11.130337 4 11.559284 4 12 C 4 12.440716 4.0447181 12.869663 4.1132812 13.291016 L 2.7949219 14.4375 C 2.4339219 14.7515 2.3469375 15.278359 2.5859375 15.693359 L 4.09375 18.306641 C 4.33275 18.721641 4.8321562 18.908906 5.2851562 18.753906 L 6.9296875 18.1875 C 7.5958842 18.734206 8.3553934 19.166339 9.1757812 19.476562 L 9.5097656 21.191406 C 9.6017656 21.661406 10.011234 22 10.490234 22 L 13.509766 22 C 13.988766 22 14.398234 21.661406 14.490234 21.191406 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 18.714844 18.751953 C 19.167844 18.907953 19.66625 18.721641 19.90625 18.306641 L 21.414062 15.691406 C 21.653063 15.276406 21.566078 14.7515 21.205078 14.4375 L 19.886719 13.291016 C 19.955282 12.869663 20 12.440716 20 12 C 20 11.559284 19.955282 11.130337 19.886719 10.708984 L 21.205078 9.5625 C 21.566078 9.2485 21.653063 8.7216406 21.414062 8.3066406 L 19.90625 5.6933594 C 19.66725 5.2783594 19.167844 5.0910937 18.714844 5.2460938 L 17.070312 5.8125 C 16.404116 5.2657937 15.644607 4.8336609 14.824219 4.5234375 L 14.490234 2.8085938 C 14.398234 2.3385937 13.988766 2 13.509766 2 L 10.490234 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"/>
							</svg>
						</g>
						<g onClick={e => DeleteIndicatorType(IndicatorPosition,indicator)}>
							<svg className="compare-icon-back" x={160} y={2} width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={this.state.removeColor} onMouseOver={()=>{this.setState({removeColor : labelFill})}} onMouseLeave={()=>{this.setState({removeColor : '#636e72'})}}>
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
	toggleIndicatorSettings : PropTypes.func,
	IndicatorPosition : PropTypes.number,
	hide : PropTypes.bool
    
};

IndicatorTooltip.defaultProps = {
	origin: [0, 0],
	labelFill: "#4682B4",
	valueFill: "#000000",
	yDisplayFormat: format(".2f"),
	displayValuesFor: displayValuesFor,
	xAccessor: noop,
	yAccessor: identity,
	hide : false,
	className: "react-stockcharts-indicator-tooltip",
    
};

export default IndicatorTooltip;
