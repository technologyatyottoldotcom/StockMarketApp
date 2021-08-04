import React from 'react';
import { BusinessChart } from './BusinessChart';

export class ChartContainer extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            type: 'annual',
            stockcode: this.props.stockDetails.stockSymbol,
            from : 'screener' // reuters // screener
        }
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockDetails.stockSymbol !== this.props.stockDetails.stockSymbol)
        {
            this.setState({
                stockcode : this.props.stockDetails.stockSymbol
            });
        }
    }

    render() {
        return (
            <div>
                 <BusinessChart field="income" {...this.state} stockDetails={this.props.stockDetails} fixed={0}/>
                 <BusinessChart field="margin" {...this.state} stockDetails={this.props.stockDetails} fixed={1}/>
                 <BusinessChart field="ratios" {...this.state} stockDetails={this.props.stockDetails} fixed={1}/>
                 <BusinessChart field="shareholdings" {...this.state} stockDetails={this.props.stockDetails} fixed={1}/>
            </div>
        )
    }
}

export default ChartContainer;
