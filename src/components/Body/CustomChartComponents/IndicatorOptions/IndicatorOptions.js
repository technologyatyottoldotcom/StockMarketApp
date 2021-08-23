

import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import displayValuesFor from 'react-stockcharts/lib/tooltip/displayValuesFor';
import GenericChartComponent from "react-stockcharts/lib/GenericChartComponent";

import { isDefined, identity, noop, functor } from "react-stockcharts/lib/utils";

export class IndicatorOptions extends Component {
	constructor(props) {
		super(props);

        this.state = {
            upColor : '#95a5a6',
            downColor : '#95a5a6',
            closeColor : '#95a5a6'
        }
        
		this.renderSVG = this.renderSVG.bind(this);
	}

   

	renderSVG(moreProps) {

		const { onClick, className , showup , showdown , index } = this.props;
		const { chartConfig: { width, height } } = moreProps;

        const { indicator , DeleteIndicatorType , SwapCharts } = this.props;

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

        let sux = showdown ? 0 : 30;
        let srx = showdown && showup ? 0 : 35;

        let wd = showup && showdown ? 95 : 60;


        return (
            <g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick} >
                <g>
                    <svg x={srx} y={0} width={wd} height={25} fill='none'>
                        <rect width={wd} height={25}></rect>
                    </svg>
                </g>
                {showup && 
                    <>
                        <g onClick={e => SwapCharts('up',index)}>
                            <svg x={sux} y={0} width={20} height={20} fill={this.state.upColor} onMouseOver={()=>{this.setState({upColor : '#404040'})}} onMouseLeave={()=>{this.setState({upColor : '#95a5a6'})}}>
                                <rect y="0.0222168" width="20" height="20" rx="3" fill="#F0F0F0"/>
                                <path d="M10.2425 4.82448C10.6954 4.82326 11.0615 5.18939 11.0603 5.64226L11.0355 14.8179C11.0343 15.2708 10.6662 15.6389 10.2133 15.6401V15.6401C9.76043 15.6413 9.3943 15.2752 9.39552 14.8223L9.42029 5.64669C9.42151 5.19382 9.78963 4.8257 10.2425 4.82448V4.82448Z" />
                                <rect width="5.34584" height="1.64" rx="0.82" transform="matrix(-0.707107 0.707107 -0.710915 -0.703278 11.1401 5.68286)" />
                                <rect width="5.34584" height="1.64" rx="0.82" transform="matrix(-0.707107 -0.707107 0.703278 -0.710915 13.1743 9.47534)" />
                            </svg>
                        </g>
                    </>
                }
                {showdown && 
                    <>
                        <g onClick={e => SwapCharts('down',index)}>
                            <svg x={30} y={0} width={20} height={20} fill={this.state.downColor} onMouseOver={()=>{this.setState({downColor : '#404040'})}} onMouseLeave={()=>{this.setState({downColor : '#95a5a6'})}}>
                                <rect width="20" height="20" rx="3" fill="#F0F0F0"/>
                                <path d="M10.2131 15.6177C9.76019 15.6189 9.39406 15.2527 9.39528 14.7999L9.42005 5.62424C9.42128 5.17137 9.78939 4.80325 10.2423 4.80203V4.80203C10.6951 4.80081 11.0613 5.16694 11.06 5.61981L11.0353 14.7954C11.0341 15.2483 10.6659 15.6164 10.2131 15.6177V15.6177Z"/>
                                <rect width="5.34584" height="1.64" rx="0.82" transform="matrix(0.707107 -0.707107 0.710915 0.703278 9.31543 14.7595)" />
                                <rect width="5.34584" height="1.64" rx="0.82" transform="matrix(0.707107 0.707107 -0.703278 0.710915 7.28125 10.9668)" />
                            </svg>
                        </g>
                    </>
                }
                <g onClick={e => DeleteIndicatorType(1,indicator)}>
                    <svg x={60} y={0} width={20} height={20} fill={this.state.closeColor} onMouseOver={()=>{this.setState({closeColor : '#404040'})}} onMouseLeave={()=>{this.setState({closeColor : '#95a5a6'})}}>
                        <rect width="20" height="20" rx="3" fill="#F0F0F0"/>
                        <rect width="13.828" height="1.64" rx="0.82" transform="matrix(0.705195 0.709013 -0.705195 0.709013 5.95703 4)" />
                        <rect width="13.828" height="1.64" rx="0.82" transform="matrix(0.705195 -0.709013 0.705195 0.709013 4.80029 13.8042)" />
                    </svg>
                </g>
            </g>
        );

	}
	render() {
		return <GenericChartComponent
			clip={true}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
		/>;
	}
}

IndicatorOptions.propTypes = {
	
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
    index : PropTypes.number,
    showup : PropTypes.bool,
    showdown : PropTypes.bool,
    indicator : PropTypes.string,
	className: PropTypes.string,
    DeleteIndicatorType : PropTypes.func,
    SwapCharts : PropTypes.func,
	onClick: PropTypes.func,
};

IndicatorOptions.defaultProps = {
	origin: [0, 0],
    showup : true,
    showdown : true,
    DeleteIndicatorType : noop,
    SwapCharts : noop,
	className: "react-stockcharts-indicator-options",
};

export default IndicatorOptions;
