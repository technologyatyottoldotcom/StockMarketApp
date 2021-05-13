import React from "react";

import { isDefined} from "react-stockcharts/lib/utils";

/* eslint-disable react/prop-types */
export function renderSVG(props) {
	const { className } = props;

	const edge = helper(props);
	if (edge === null) return null;
	let circle,blink;

    if(isDefined(edge.circle))
    {
        circle = <g>
            <circle class="pulse-disk" cx={edge.circle.x} cy={edge.circle.y} r={edge.circle.radius} fill={edge.circle.fill}/>
            <circle class="pulse-circle-1" cx={edge.circle.x} cy={edge.circle.y} stroke-width="2" />
            <circle class="pulse-circle-2" cx={edge.circle.x} cy={edge.circle.y}  stroke-width="2" />
        </g>
    }

    // blink = (
    //     <svg class="pulse" x="100px" y="100px" width="100px" height="100px" viewBox="0 0 100 100">
    //         <circle class="pulse-disk" cx="50" cy="50" r={10} fill="#000000" stroke-width="2"/>	
    //         <circle class="pulse-circle" cx="50" cy="50" stroke-width="2" r={10} fill="#000000"/>
    //         <circle class="pulse-circle-2" cx="50" cy="50"  stroke-width="2" r={10}/>
    //     </svg>
    // );


	return (
		<g className={className}>
            {circle}
            {/* {blink} */}
		</g>
	);
}
/* eslint-enable react/prop-types */

function helper(props) {
	const {show,hideLine} = props;
	const {fill,lineStroke,lineOpacity,radius} = props;
	const { x1, y1} = props;

	if (!show) return null;
    
    const circle = hideLine 
        ? undefined
        : {
            opacity: lineOpacity,
            stroke: lineStroke,
            fill,
            radius,
            x : x1,
            y : y1,
        };

	return {
        circle,
	};
}



// export default EdgeCoordinate;
