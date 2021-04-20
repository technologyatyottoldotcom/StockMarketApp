import React from 'react';
import { RangeSlider } from 'rsuite';
import '../../../scss/Technicals.scss';
import learning from "../../../assets/icons/learning.svg" //new (MK)


class CustomSteps extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            printText: this.props.printText || ['Strong Sell', 'Sell', 'Neutral', 'Buy', 'Strong Buy'],
            active: (this.props.active && !Number(this.props.active)) ? this.state.printText.findIndex(e => e === this.props.active) : this.props.active
        }
    }

    render(props) {
        const len = this.state.printText.length;
        return (
            <>
                <div className="stock__view__slider">
                    <RangeSlider

                        barClassName='custome-slider'
                        min={0}
                        max={len-1}
                        value={[0,this.state.active]}
                        defaultValue={[0,1]}
                        className="custom-slider-Technical"
                        graduated
                        progress
                        tooltip={false}
                        renderMark={n =>
                            <span style={{fontSize : '11px' , fontWeight : '700'}}>{this.state.printText[n]}</span>
                        }
                    />
                </div>
            </>
        )
    }
}


class FirstSection extends React.PureComponent {
    render() {
        
        return (
            <>
                <div className="stock__view">
                    <div className="view__name">Short Term Technical View</div>
                    <CustomSteps active={1} />
                </div>
                <div className="stock__view">
                    <div className="view__name">Long Term Technical View</div>
                    <CustomSteps active={1} />
                </div>
                <div className="stock__view">
                    <div className="view__name">Relative Strength Index (RSI)</div>
                    <div style={{ maxWidth: 100 }}>
                        <CustomSteps printText={["Buy", "Sell"]} active={1} width={100} />
                    </div>
                </div>
                <div className="stock__view">
                    <div className="view__name">Moving Average Convergence Divergence (MACD)</div>
                    <div style={{ maxWidth: 100 }}>
                        <CustomSteps printText={["Buy", "Sell"]} active={1} width={100} />
                    </div>
                </div>
            </>
        )
    }
}

class CenterSection extends React.PureComponent {

    render() {
        return (
            <>
                <div className="p-0 m-0" style={{ fontSize: 12 }}>
                    <div className="mb-3">
                        <p>  5 Day MA &nbsp;
                            <br />
                            <b style={{ color: '#E51A4B' }}> is lower than </b>
                            <br />
                            20 Day MA.
                        </p>
                    </div>

                    <div className="mb-3">
                        <p>  5 Day MA &nbsp;
                            <br />
                            <b style={{ color: '#E51A4B' }}> is lower than </b>
                            <br />
                            20 Day MA.
                        </p>
                    </div>

                    <div className="mb-3">
                        <p>  5 Day MA &nbsp;
                            <br />
                            <b style={{ color: '#E51A4B' }}> is lower than </b>
                            <br />
                            20 Day MA.
                        </p>
                    </div>
                </div>

            </>
        )
    }
}

class LastSection extends React.PureComponent {
    render() {
        return (
            <>
                <div style={{ fontSize: 13 }}>
                    <div className="row">
                        <div className="col-4 p-0 m-0">
                            <img src={learning} width={150} className="img-fluid p-3" alt="AI_ML_GENIE_LOGO" />
                        </div>
                        <div className="col p-0 m-0" style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                            <b>AI & ML Genie</b>
                        </div>
                    </div>

                    <div className="col p-0 m-0 text-center">
                        <div>Price Targe For</div>
                        <div style={{ fontWeight: 800, fontSize: 17 }}>10 Days</div>
                        <div>is</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>Rs. 1,325 <span style={{ color: '#E51A4B' }}>(-5.66%)</span> </div>
                    </div>


                    <div className="pt-4">
                        <div style={{ fontWeight: 'bold' }}>Overall Technical View</div>
                        <div className="row">
                            <div className="col pt-2 pl-0 pr-0 m-0">
                                <CustomSteps active={1} />
                            </div>
                        </div>
                        <div className="mt-3 p-2">
                            <p className='w-75' style={{ marginLeft: 50, fontSize: 11.90 }} >
                                This indicator is based on the results of the
                                four indicators on the left hand side.
                             </p>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}


export class Technicals extends React.PureComponent {
    render() {
        return (
            <>
                <div className="bn__stock__technicals">
                    <div className="bn__stock__views">
                        <FirstSection />
                    </div>

                    {/* <div className="col-2">
                        <CenterSection />
                    </div> */}

                    {/* <div className="bn__stock__target">
                        <LastSection />
                    </div> */}
                </div>

            </>
        )
    }
}

export default Technicals;