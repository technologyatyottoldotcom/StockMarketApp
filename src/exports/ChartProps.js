import {timeFormat} from 'd3-time-format';
import { format } from 'd3-format';

const fillColor = '#000000';
const fontFamily = 'Open Sans, sans-serif';
const fontWeight = 600;
const cursorFontSize = 10;
const rectWidth = 100;


const getXCoordinateProps = ()=>
{
    return {
        at : 'bottom',
        orient : 'bottom',
        displayFormat : timeFormat("%d %b '%y  %H:%M"),
        fontFamily : fontFamily,
        fontSize : cursorFontSize,
        rectWidth : rectWidth,
        rectHeight : 20,
        fill : fillColor

    }
}


const getYCoordinateProps = ()=>
{
    return {
        at : "right",
        orient : "right",
        displayFormat : format(".2f"),
        arrowWidth : 0,
        fontFamily : fontFamily,
        fontSize : cursorFontSize,
        rectHeight : 25,
        fill : fillColor
    }
}

const getXAxisProps = ()=>
{
    return {
        axisAt : "bottom",
        orient : "bottom",
        ticks : 10,
        tickStroke : '#888888',
        stroke : '#c8c8c8' ,
        fontWeight : fontWeight,
        fontFamily : fontFamily,
        fontSize : 10
    }
}

const getYAxisProps = ()=>
{
    return {
        axisAt : "right",
        orient : "right",
        ticks : 10,
        tickStroke : '#888888',
        stroke : '#c8c8c8' ,
        fontWeight : fontWeight,
        fontFamily : fontFamily,
        fontSize : 10,
        tickFormat : format(".2f")
    }
}

export {
    getXCoordinateProps,
    getYCoordinateProps,
    getXAxisProps,
    getYAxisProps
}