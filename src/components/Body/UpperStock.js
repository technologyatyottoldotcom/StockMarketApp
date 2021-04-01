import React from 'react';
import $ from 'jquery';
import UpperStockChart from './UpperStockChart';

export class UpperStock extends React.Component {

    constructor(props)
    {
        super(props);
        this.setInitialSize = this.setInitialSize.bind(this);
        this.state = {
            chartWidth : 0,
            chartHeight : 0
        }
    }

    componentDidMount()
    {
        this.setInitialSize();
    }

    setInitialSize()
    {
        let wd = $('.upper__stock__info').width();
        let ht = $('.upper__stock__info').height();
        this.setState({
            chartWidth : 100,
            chartHeight : ht
        });
    }

    render() {

        const {name,value,changeP,data} = this.props;
        return (
            <div className="upper__stock">
                <div className="upper__stock__info">
                    <p className="upper__stock__name">{name}</p>
                    <p className="upper__stock__value">{value}</p>
                    <p className="upper__stock__change">{changeP}</p>
                </div>
                <div className="upper__stock__chart">
                    <UpperStockChart 
                        data={data} 
                        width={this.state.chartWidth}   
                        height={this.state.chartHeight} 
                    />
                </div>
            </div>
        )
    }
}

export default UpperStock;
