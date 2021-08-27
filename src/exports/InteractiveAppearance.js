const defaultStrokeColor = '#e67e22';
const edgeFillColor = '#f1c40f';
const edgeStrokeColor = '#000000';
const fillColor = '#ffbe76';


const TrendLineAppearance = {
    stroke : defaultStrokeColor,
    strokeOpacity: 1,
    strokeWidth: 1,
    edgeFill : edgeFillColor,
    edgeStrokeWidth: 0.5,
    edgeStroke: "#000000",
    strokeDasharray : 'Solid',
    r : 5
}

const EquidistantChannelAppearance = {
    stroke : defaultStrokeColor,
    strokeOpacity: 1,
    strokeWidth: 1,
    fill : fillColor,
    fillOpacity: 0.7,
    edgeFill : edgeFillColor,
    edgeFill2 : edgeFillColor,
    edgeStrokeWidth: 0.5,
    edgeStroke: edgeStrokeColor,
    r : 5
}

const StandardDeviationChannelAppearance = {
    stroke : defaultStrokeColor,
    strokeOpacity: 1,
    strokeWidth: 1,
    fill : fillColor,
    fillOpacity: 0.7,
    edgeFill : edgeFillColor,
    edgeStrokeWidth: 0.5,
    edgeStroke: edgeStrokeColor,
    r : 5
}

const FibRetAppearance = {
    stroke: "#e67e22",
    strokeWidth: 1,
    strokeOpacity: 1,
    fontFamily: "Quicksand, Helvetica, Arial, sans-serif",
    fontSize: 11,
    fontFill: edgeStrokeColor,
    edgeStroke: "#e67e22",
    edgeFill: "#FFFFFF",
    nsEdgeFill: "#e74c3c",
    edgeStrokeWidth: 1,
    r: 5,
}

const GannFanAppearance = {
    stroke: "#e74c3c",
    fillOpacity: 0.2,
    strokeOpacity: 1,
    strokeWidth: 0.5,
    edgeStroke: "#e74c3c",
    edgeFill: "#FFFFFF",
    edgeStrokeWidth: 1,
    r: 5,
    fill: [
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ],
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 12,
    fontFill: "#000000",
}


module.exports = {TrendLineAppearance,EquidistantChannelAppearance,StandardDeviationChannelAppearance,FibRetAppearance,GannFanAppearance};