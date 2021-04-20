import React from 'react';
import Eraser from '../../assets/icons/eraser.svg';
import '../../css/CashPosition.css';

class WatchList extends React.Component {

    TopSection() {
        return (
            <>
                <div className="cp__watchlist__edit">
                    <img src={Eraser} alt=""/>
                    <span>Edit</span>
                </div>
            </>
        )
    }

    CreateRow({ row1, row2, row3 }) {
        return (
            <div className="share__profile">
                <div className="sp__profile">
                    {row1}
                </div>
                <div className="sp__price">
                    {row2}
                </div>
            </div>

        )
    }

    CreatePriceCol({ change, changePer }) {
        return (
            <>
                <div id="cp__portfolio__name">
                    Growth Portfolio
                </div>
                <div className="cp__change">
                    {change} 
                    <span>({changePer})</span>
                </div>
            </>
        )
    }

    CreateProfile({ name , heading }) {
        return (
            <>
                <div>
                    <div className="sp__status"></div>
                    <div className="sp__name">{name}</div>
                </div>
                <div className="sp__income">
                    {heading}
                </div>

                {/* <div className="sp__quantity">
                    <img src={Hand} alt=""/>
                    <span>&nbsp;{position}</span>
                </div> */}
            </>
        )
    }

    CreateStock({ fullName , change, changePer }) {
        return (
            <>
                <div className="sp__fullname">{fullName}</div>
                <div className="cp__change">
                    {change} 
                    <span>({changePer})</span>
                </div>
            </>
        )
    }

    render() {
        return (
            <>
                
                <div className="cp__watchlist">
                    <p>Watchlist</p>
                    <this.TopSection />
                </div>

                {/* set max height */}
                {/* Add global  "customScrollbar" class name  */}
                <div className="cp__shares__container">
                    <this.CreateRow 
                        row1={
                            <this.CreateProfile
                                name="RELIANCE.NS"
                                heading="Rs. 30,000.56"
                            />
                        } 
                        row2={
                            <this.CreateStock
                                fullName="Reliance Industries Ltd."
                                change="+3,060.00"
                                changePer="+0.95%"
                            />
                        }
                        
                    />
                    <this.CreateRow 
                        row1={
                            <this.CreateProfile
                                name="NSE:HDFCBANK"
                                heading="Rs. 20,103.96"
                            />
                        } 
                        row2={
                            <this.CreateStock
                                fullName="HDFC Bank Ltd."
                                change="+2,060.00"
                                changePer="+0.95%"
                            />
                        }
                        
                    />
                </div>
            </>
        )
    }
}


export default WatchList;

