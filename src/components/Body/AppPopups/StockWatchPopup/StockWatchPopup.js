import React from 'react';
import axios from 'axios';
import StockWatch from './StockWatch';
import Pulse from '../../../Loader/Pulse';
import CrossIcon from '../../../../assets/icons/crossicon.svg';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


export class StockWatchPopup extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.handleSelection = this.handleSelection.bind(this);

    }

    handleSelection()
    {
        this.setState({
            stocks : [],
            isLoading : true,
        });
        this.props.CloseStockWatchPopup();
    }

    render() {


        const stocks = this.props.WatchStocks;
        // console.log(stocks);
        return (
            <div className="Stock__watch__popup">
                <div className="Stock__watch__title__name">
                    <p>People Also Watch</p>
                    <span id="Stock__watch__close" onClick={()=> {this.props.CloseStockWatchPopup()}}>
                        <img src={CrossIcon} alt="X"/>
                    </span>
                    
                </div>
                    {stocks.length <= 0 ? 
                        <div className="Stock__watch__container loader">
                            <Pulse />
                        </div>
                        :
                        <> 
                        <div className="Stock__watch__container">
                            {stocks && stocks.map((s,indx)=>{             
                                return (
                                    <StockWatch 
                                        key={indx} 
                                        config={s}
                                        selectedStock={this.props.selectedStock}
                                        handleSelection={this.handleSelection}
                                    />
                                )
                                })}
                        </div>
                        
                        </>
                    }
            </div>
        )
    }
}

export default StockWatchPopup;
