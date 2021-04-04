import React from 'react';
import '../../css/CashPosition.css';
import Coins from '../../assets/icons/coins.svg';
import SuitCase from '../../assets/icons/suitcase.svg';
import Hand from '../../assets/icons/hand.svg';



const SVGIMG = {
    ChevronDown: _ => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
            </svg>
        )
    },
}

class CashPosition extends React.Component {


    CashPos() {
        return (
            <>
                <div className="cp__header">
                    <div className="menu__btn">
                        <img src={Coins} alt=""/>
                    </div>
                    <div className="cp__title">
                        Cash Position
                    </div>
                </div>
                <div className="cp__value">
                    <span>Rs.&nbsp;</span>
                    <span style={{ fontSize: 20 }}>13,254.00</span>
                </div>
            </>
        )
    }

    PortfolioName({heading}) {
        return (
            <>
                <div>
                    <div>
                        <img src={SuitCase} alt=""/>
                    </div>
                    <p>Portfolio Name</p>
                </div>
                <div className="cp__income">
                    {heading}
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
                <div className="sp__quantity">
                    {row3}
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

    CreateQuantity({position}){
        return <>
            <img src={Hand} alt=""/>
            <span>&nbsp;{position}</span>
        </>
    }

    render() {
        return (
                <div className="cash__position">
                    <div style={{ textAlign: 'right' }}>
                        <SVGIMG.ChevronDown />
                    </div>

                    <this.CashPos />

                    <div className="cp__portfolio__details">
                        <div className="cp__portfolio"><this.PortfolioName heading="Rs. 21,123,254.00" /></div>
                        <div className="cp__portfolio__value">
                            <this.CreatePriceCol
                                heading="Rs. 21,123,254.00"
                                change="+106,000,78.00"
                                changePer="+0.95%"
                            />
                        </div>
                    </div>

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
                            row3={
                                <this.CreateQuantity position="10" />
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
                            row3={
                                <this.CreateQuantity position="15" />
                            }
                         />
                    </div>


                </div>

        )
    }
}

export default CashPosition;
