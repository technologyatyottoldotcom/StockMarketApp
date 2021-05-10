import React from 'react';
import $ from 'jquery';
import PortfolioView from './PortfolioView';
import WatchList from './WatchList';


const SVGIMG = {
    ChevronDown: _ => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
        )
    },
}

const Portfolios = ['Growth Portfolio','Savings Portfolio'];

class CashPosition extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state={
            cashPosition : 'W',
            DropDownOpen : false
        }
        this.ToggleDropDown = this.ToggleDropDown.bind(this);
    }

    ToggleDropDown()
    {
        if(this.state.DropDownOpen)
        {
            $('.cp__dropdown__options').slideUp(100);
            $('.cp__dropdown__icon').css('transform', 'rotate(0deg)');
            $('.cp__data').css('opacity','1');
        }
        else
        {
            $('.cp__dropdown__options').slideDown(200);
            $('.cp__dropdown__icon').css('transform', 'rotate(180deg)');
            $('.cp__data').css('opacity','0.2');
        }
        this.setState({
            DropDownOpen : !this.state.DropDownOpen
        });
        
    }

    LoadCashPosition(e)
    {
        this.setState({cashPosition : e.target.dataset.field})
        this.ToggleDropDown();
    }

    render() {
        if(this.state)
        {
            return (
            
                <div className="cash__position">
    
                        <div className="cp__dropdown">
                            <div className="cp__dropdown__icon" onClick={this.ToggleDropDown}>
                                <SVGIMG.ChevronDown />
                            </div>
                            <div className="cp__dropdown__options" onClick={
                                (e)=>{this.LoadCashPosition(e)}
                            }>
                                <p data-field="W">Watch List</p>
                                {Portfolios.map((p,i) => {
                                    return <p key={i} data-field="P">{p}</p>
                                })}
                            </div> 
                        </div>
                        <div className="cp__data">
                            {this.state.cashPosition === 'P' && <PortfolioView />}
                            {this.state.cashPosition === 'W' && <WatchList />}
                        </div>
                        
                </div>
    
            )
        }
        else
        {
            return null;
        }
    }
}

export default CashPosition;
