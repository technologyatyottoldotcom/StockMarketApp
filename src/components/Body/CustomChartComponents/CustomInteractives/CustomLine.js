import React from 'react';
import {TrendLine,DrawingObjectSelector} from 'react-stockcharts/lib/interactive/TrendLine';
import {saveInteractiveNodes,getInteractiveNodes} from '../../../../exports/InteractiveUtils';

class CustomLine extends React.PureComponent {

    constructor(props)
    {
        super(props);

        this.state = {
            enabled : true,
            trends : []
        }

        this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
        this.getInteractiveNodes = getInteractiveNodes.bind(this);
        this.onDrawCompleteChart = this.onDrawCompleteChart.bind(this);
        this.onLineSelect = this.onLineSelect.bind(this);
    }

    

    onDrawCompleteChart(trends)
    {
        console.log(trends);
        // trends[trends.length - 1]['selected'] = false;
        trends[trends.length - 1]['id'] = `L${trends.length - 1}`;
        this.setState({
            enabled : false,
            trends : trends
        },()=>{
            console.log('Drawing Done....',this.state);
        })
        
        this.props.wrapCanvas();

        // setTimeout(()=>{
        //     this.setState({
        //         enabled : true,
        //     });
        // },3000)
    }

    onLineSelect(trends)
    {

        console.log('select')
        const selected = trends.filter(each => !each.selected);

        console.log(selected)
    }

    render() {
        return (
            <>
                <TrendLine
                    ref={this.saveInteractiveNodes("Trendline", 1)}
                    enabled={this.state.enabled}
                    type="LINE"
                    snap={false}
                    snapTo={d => [d.high, d.low]}
                    onStart={() => console.log("START")}
                    onComplete={this.onDrawCompleteChart}
                    onSelect={()=> {console.log('select')}}
                    trends={this.state.trends}
                    currentPositionStroke='#f1c40f'
                    currentPositionStrokeWidth={4}
                    currentPositionRadius={5}
                    hoverText={{
                        text : 'Select'
                    }}
                />

                
                
            </>
        )
    }
}

export default CustomLine;
